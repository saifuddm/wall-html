import { Hono } from "hono";
import { renderer } from "./renderer";
import puppeteer, { BrowserWorker } from "@cloudflare/puppeteer";
import LandingPage from "./pages/landing";
import TextBackground from "./pages/text-background";
import {
  calculateCpl,
  calculateLpp,
  validateRoute,
} from "./utils/text-background-validation";
import validateScreenshot from "./utils/screenshot-validator";

type Bindings = {
  MYBROWSER: BrowserWorker;
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
  // Build URL
  const origin = new URL(c.req.url).origin;
  const browser = await puppeteer.launch(c.env.MYBROWSER, {
    keep_alive: 600000,
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  // Target URL with query parameters
  const target = new URL("/text-background", origin);
  target.searchParams.set("width", width.toString());
  target.searchParams.set("height", height.toString());
  target.searchParams.set("displayText", displayText);
  target.searchParams.set("randomTextToggle", randomTextToggle.toString());
  target.searchParams.set("cutOffTextToggle", cutOffTextToggle.toString());
  console.log(target.toString());

  await page.goto(target.toString(), { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();
  return new Response(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
});

export default app;
