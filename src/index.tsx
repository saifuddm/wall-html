import { Hono } from "hono";
import { renderer } from "./renderer";
import puppeteer, { BrowserWorker } from "@cloudflare/puppeteer";
import LandingPage from "./pages/landing";
import TextBackground from "./pages/text-background";

type Bindings = {
  MYBROWSER: BrowserWorker;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<LandingPage />);
});

app.get("/text-background", (c) => {
  return c.render(<TextBackground />);
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "wall-html",
  });
});

app.get("/example-puppeteer", async (c) => {
  // Build URL
  const origin = new URL(c.req.url).origin;
  const target = new URL("/", origin);
  const browser = await puppeteer.launch(c.env.MYBROWSER, {
    keep_alive: 600000,
  });
  const page = await browser.newPage();
  await page.goto(target.toString(), { waitUntil: "networkidle2" });
  const metrics = await page.metrics();
  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();
  return new Response(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
});

export default app;
