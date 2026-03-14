# Wallpaper Generator

Generate wallpaper PNGs from this React/Vite page using Playwright.

## Prerequisites

- Install dependencies:
  - `bun install`
- Install Playwright Chromium once:
  - `bunx playwright install chromium`

## Generate A Wallpaper

Run:

```bash
bun run wallpaper -- --text "Hello, World!" --width 3440 --height 1440 --out output/wall-3440x1440.png
```

Options:

- `--text` text rendered in the wallpaper (default: `Hello, World!`)
- `--width` output width in pixels (default: `1920`)
- `--height` output height in pixels (default: `1080`)
- `--out` output image path (default: `output/wallpaper-{width}x{height}.png`)

## Workflow (Option B)

`npm run wallpaper` is self-contained:

- builds the app,
- starts `vite preview` automatically,
- captures the image with Playwright,
- then shuts down preview.

You do not need to run `npm run dev` first.
