import { Hono } from "hono";
import { renderer } from "./renderer";
import LandingPage from "./pages/landing";
import TextBackground from "./pages/text-background";
import { validateRoute } from "./utils/text-background-validation";
import validateScreenshot from "./utils/screenshot-validator";
import {
  buildScreenshotHtml,
  createBrowserRenderingRequest,
  getBrowserRenderingConfig,
} from "./utils/browser-rendering";

type Bindings = {
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
  try {
    const { accountId, apiToken } = getBrowserRenderingConfig(c.env);
    const screenshotHtml = buildScreenshotHtml({
      width,
      height,
      displayText,
      randomTextToggle,
      cutOffTextToggle,
    });

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
            html: screenshotHtml,
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
