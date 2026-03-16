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

type Bindings = {
  MYBROWSER: BrowserWorker;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(<LandingPage />);
});

app.get("/text-background", (c) => {
  const { cpl, lpp, displayText, randomTextToggle } = validateRoute(
    c.req.query() as {
      cpl: string;
      lpp: string;
      displayText: string;
      randomTextToggle: string;
    },
  );
  return c.render(
    <TextBackground
      cpl={cpl}
      lpp={lpp}
      displayText={displayText}
      randomTextToggle={randomTextToggle}
    />,
  );
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "wall-html",
  });
});

app.get("/example-puppeteer", async (c) => {
  // Variables
  const width = 1290;
  const paddingX = 32 * 2;
  const height = 2796;
  // Build URL
  const origin = new URL(c.req.url).origin;
  const browser = await puppeteer.launch(c.env.MYBROWSER, {
    keep_alive: 600000,
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  // Target URL with query parameters

  const target = new URL("/text-background", origin);

  target.searchParams.set("cpl", calculateCpl(width - paddingX).toString());
  target.searchParams.set("lpp", calculateLpp(height).toString());
  target.searchParams.set(
    "displayText",
    "This is a test of the text background generator 🚀",
  );
  target.searchParams.set("randomTextToggle", "true");

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
