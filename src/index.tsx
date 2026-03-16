import { Hono } from "hono";
import { renderer } from "./renderer";
import puppeteer, { BrowserWorker } from "@cloudflare/puppeteer";

type Bindings = {
  MYBROWSER: BrowserWorker;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <main class="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div class="mx-auto max-w-2xl space-y-4">
        <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
          Wall HTML Screenshot API
        </h1>
        <p class="text-base text-slate-300 sm:text-lg">
          Generate wallpaper screenshots from API requests using a Cloudflare
          Worker powered by Hono.
        </p>
      </div>
    </main>,
  );
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
