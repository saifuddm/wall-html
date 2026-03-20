import { Hono } from "hono";
import puppeteer, { BrowserWorker } from "@cloudflare/puppeteer";
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

type Bindings = {
  MYBROWSER: BrowserWorker;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: string;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<LandingPage />);
});

app.get("/text-background", (c) => {
  const { width, height, displayText, randomTextToggle, cutOffTextToggle } =
    validateRoute(
      c.req.query() as {
        width: string;
        height: string;
        displayText: string;
        randomTextToggle: string;
        cutOffTextToggle: string;
      },
    );
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

app.get("/screenshot", async (c) => {
  const { width, height, displayText, randomTextToggle, cutOffTextToggle } =
    validateScreenshot(
      c.req.query() as {
        width: string;
        height: string;
        displayText: string;
        randomTextToggle: string;
        cutOffTextToggle: string;
      },
    );
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
    const browser = await puppeteer.launch(c.env.MYBROWSER, {
      keep_alive: 600000,
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width, height });
      await page.goto(targetUrl, { waitUntil: "networkidle2" });
      const screenshot = await page.screenshot({ type: "png" });

      return new Response(screenshot, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    } finally {
      await browser.close();
    }
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

app.get("/screenshot-rest-url", async (c) => {
  const { width, height, displayText, randomTextToggle, cutOffTextToggle } =
    validateScreenshot(
      c.req.query() as {
        width: string;
        height: string;
        displayText: string;
        randomTextToggle: string;
        cutOffTextToggle: string;
      },
    );
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

    const headers = new Headers({
      "Content-Type": response.headers.get("Content-Type") ?? "image/png",
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
