import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const DEFAULT_TEXT = "Hello, World!";
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_SPACE_WITH_RANDOM_CHARACTERS = 2;
const DEFAULT_REPLACE_BLANK_SPACE = false;
const BASE_PORT = 4173;

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

function parseBoolean(value, fallback, name) {
  if (value === undefined) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid --${name} value "${value}". Expected a boolean.`);
}

function parseArgs(argv) {
  const args = {
    text: DEFAULT_TEXT,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    out: undefined,
    spaceWithRandomCharacters: DEFAULT_SPACE_WITH_RANDOM_CHARACTERS,
    replaceBlankSpace: DEFAULT_REPLACE_BLANK_SPACE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      throw new Error(
        `Unknown argument "${token}". Use --text --width --height --out.`,
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
    else if (key === "spaceWithRandomCharacters")
      args.spaceWithRandomCharacters = parsePositiveInt(
        value,
        DEFAULT_SPACE_WITH_RANDOM_CHARACTERS,
        "spaceWithRandomCharacters",
      );
    else if (key === "replaceBlankSpace")
      args.replaceBlankSpace = parseBoolean(
        value,
        DEFAULT_REPLACE_BLANK_SPACE,
        "replaceBlankSpace",
      );
    else if (key === "out") args.out = value;
    else throw new Error(`Unknown option "${token}".`);
  }

  if (!args.text.trim()) args.text = DEFAULT_TEXT;
  if (!args.out) args.out = `output/wallpaper-${args.width}x${args.height}.png`;
  return args;
}

function runCommand(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `Command failed: ${command} ${commandArgs.join(" ")} (exit ${
              code ?? "null"
            })`,
          ),
        );
    });
  });
}

async function waitForServer(url, timeoutMs = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) return;
    } catch {
      // Keep polling until timeout.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for preview server at ${url}.`);
}

async function stopProcessTree(child) {
  if (!child || child.exitCode !== null || child.pid === undefined) return;

  if (process.platform === "win32") {
    await runCommand("taskkill", ["/pid", String(child.pid), "/t", "/f"]).catch(
      () => {},
    );
  } else {
    child.kill("SIGTERM");
  }

  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 4_000)),
  ]);
}

async function main() {
  const {
    text,
    width,
    height,
    out,
    spaceWithRandomCharacters,
    replaceBlankSpace,
  } = parseArgs(process.argv.slice(2));
  const outputPath = path.resolve(projectRoot, out);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const port = BASE_PORT + Math.floor(Math.random() * 1000);
  const baseUrl = `http://127.0.0.1:${port}`;
  const params = new URLSearchParams({
    text,
    width: String(width),
    height: String(height),
    spaceWithRandomCharacters: String(spaceWithRandomCharacters),
    replaceBlankSpace: String(replaceBlankSpace),
  });
  const wallpaperUrl = `${baseUrl}/?${params.toString()}`;

  await runCommand("bun", ["run", "build"]);

  const previewProcess = spawn(
    "bun",
    [
      "run",
      "preview",
      "--",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({
        viewport: { width, height },
      });
      await page.goto(wallpaperUrl, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      await page.screenshot({
        path: outputPath,
      });
    } finally {
      await browser.close();
    }
  } finally {
    await stopProcessTree(previewProcess);
  }

  console.log(`Wallpaper generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
