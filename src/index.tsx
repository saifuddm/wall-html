import { Hono } from "hono";
import { renderer } from "./renderer";
import LandingPage from "./pages/landing";
import TextBackground from "./pages/text-background";
import { validateRoute } from "./utils/text-background-validation";
import validateScreenshot from "./utils/screenshot-validator";
import {
  buildTextBackgroundUrl,
  createBrowserRenderingRequest,
  getBrowserRenderingConfig,
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

  try {
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

    const etag = `"${await crypto.subtle.digest("SHA-256", new TextEncoder().encode(targetUrl)).then((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")).then((hex) => hex.slice(0, 32))}"`;

    if (c.req.header("If-None-Match") === etag) {
      return new Response(null, { status: 304, headers: { ETag: etag } });
    }

    const headers = new Headers({
      "Content-Type": response.headers.get("Content-Type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      ETag: etag,
    });
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
