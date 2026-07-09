import { Hono } from "hono";
import { renderer } from "./renderer";
import LandingPage from "./pages/landing";
import TextBackground from "./pages/text-background";
import { validateRoute } from "./utils/text-background-validation";
import validateScreenshot from "./utils/screenshot-validator";
import puppeteer from "@cloudflare/puppeteer";
import {
  buildTextBackgroundUrl,
  createBrowserRenderingRequest,
  getBrowserRenderingConfig,
  hasBrowserRenderingConfig,
} from "./utils/browser-rendering";
import logger from "./utils/logger";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(async (c, next) => {
  const start = Date.now();
  await next();
  logger.info(
    { method: c.req.method, path: c.req.path, status: c.res.status, duration: Date.now() - start },
    "request",
  );
});

app.use(renderer);

app.get("/", (c) => {
  return c.render(<LandingPage />);
});

app.get("/text-background", (c) => {
  const { width, height, displayText, randomTextToggle, cutOffTextToggle } =
    validateRoute(c.req.query());
  return c.render(
    <TextBackground
      width={width}
      height={height}
      displayText={displayText}
      randomTextToggle={randomTextToggle}
      cutOffTextToggle={cutOffTextToggle}
    />,
  );
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "wall-html",
  });
});

app.get("/screenshot-rest-url", async (c) => {
  const { width, height, displayText, randomTextToggle, cutOffTextToggle } =
    validateScreenshot(c.req.query());
  const origin = new URL(c.req.url).origin;
  const targetUrl = buildTextBackgroundUrl({
    origin,
    width,
    height,
    displayText,
    randomTextToggle,
    cutOffTextToggle,
  });

  const etag = `"${await crypto.subtle.digest("SHA-256", new TextEncoder().encode(targetUrl)).then((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")).then((hex) => hex.slice(0, 32))}"`;

  if (c.req.header("If-None-Match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const buildHeaders = (contentType: string) =>
    new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      ETag: etag,
    });

  try {
    if (!hasBrowserRenderingConfig(c.env)) {
      // Local dev fallback: no REST API credentials, so screenshot via the
      // MYBROWSER binding (wrangler runs it against a local Chrome).
      const browser = await puppeteer.launch(c.env.MYBROWSER);
      try {
        const page = await browser.newPage();
        await page.setViewport({ width, height, deviceScaleFactor: 1 });
        await page.goto(targetUrl, {
          waitUntil: "networkidle2",
          timeout: 45000,
        });
        const screenshot = await page.screenshot({ type: "png" });
        return new Response(screenshot, {
          status: 200,
          headers: buildHeaders("image/png"),
        });
      } finally {
        await browser.close();
      }
    }

    const { accountId, apiToken } = getBrowserRenderingConfig(c.env);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/screenshot`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          createBrowserRenderingRequest({
            width,
            height,
            url: targetUrl,
          }),
        ),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return c.json(
        {
          error: "Cloudflare Browser Rendering screenshot request failed.",
          status: response.status,
          details: errorText,
        },
        502,
      );
    }

    const headers = buildHeaders(
      response.headers.get("Content-Type") ?? "image/png",
    );
    const browserMsUsed = response.headers.get("X-Browser-Ms-Used");
    if (browserMsUsed) {
      headers.set("X-Browser-Ms-Used", browserMsUsed);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected screenshot generation error.",
      },
      500,
    );
  }
});

export default app;
