import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const DEFAULT_TEXT = "Hello, World!";
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_SPACE_WITH_RANDOM_CHARACTERS = 2;

function parsePositiveInt(value, fallback, name) {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(
      `Invalid --${name} value "${value}". Expected a positive integer.`,
    );
  }
  return parsed;
}

function parseArgs(argv) {
  const args = {
    text: DEFAULT_TEXT,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    out: undefined,
    spaceWithRandomCharacters: DEFAULT_SPACE_WITH_RANDOM_CHARACTERS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      throw new Error(
        `Unknown argument "${token}". Use --text --width --height --out --spaceWithRandomCharacters.`,
      );
    }
    const key = token.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for "${token}".`);
    }
    i += 1;

    if (key === "text") args.text = value;
    else if (key === "width")
      args.width = parsePositiveInt(value, DEFAULT_WIDTH, "width");
    else if (key === "height")
      args.height = parsePositiveInt(value, DEFAULT_HEIGHT, "height");
    else if (key === "out") args.out = value;
    else if (key === "spaceWithRandomCharacters")
      args.spaceWithRandomCharacters = parsePositiveInt(
        value,
        DEFAULT_SPACE_WITH_RANDOM_CHARACTERS,
        "spaceWithRandomCharacters",
      );
    else throw new Error(`Unknown option "${token}".`);
  }

  if (!args.text.trim()) args.text = DEFAULT_TEXT;
  if (!args.out) args.out = `output/wallpaper-${args.width}x${args.height}.png`;
  return args;
}

async function assertWallpaperBuildExists(wallpaperHtmlPath) {
  try {
    await access(wallpaperHtmlPath);
  } catch {
    throw new Error(
      `Missing build artifact at ${wallpaperHtmlPath}. Run "bun run build" before generating a wallpaper.`,
    );
  }
}

async function main() {
  const { text, width, height, out, spaceWithRandomCharacters } = parseArgs(
    process.argv.slice(2),
  );
  const outputPath = path.resolve(projectRoot, out);
  await mkdir(path.dirname(outputPath), { recursive: true });
  const wallpaperHtmlPath = path.resolve(projectRoot, "dist", "wallpaper.html");
  await assertWallpaperBuildExists(wallpaperHtmlPath);
  const wallpaperUrl = pathToFileURL(wallpaperHtmlPath);
  wallpaperUrl.search = new URLSearchParams({
    text,
    width: String(width),
    height: String(height),
    spaceWithRandomCharacters: String(spaceWithRandomCharacters),
  }).toString();

  const browser = await chromium.launch({
    headless: true,
    args: ["--allow-file-access-from-files", "--disable-web-security"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width, height },
    });
    await page.goto(wallpaperUrl.href, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__wallpaperReady === true);
    await page.screenshot({
      path: outputPath,
    });
  } finally {
    await browser.close();
  }

  console.log(`Wallpaper generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
