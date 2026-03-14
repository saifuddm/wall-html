# Wallpaper Generator

Generate wallpaper PNGs by opening the built `dist/wallpaper.html` in Playwright.

## Prerequisites

- Install dependencies:
  - `bun install`
- Install Playwright Chromium once:
  - `bunx playwright install chromium`

## Generate A Wallpaper

One-shot (build + capture):

```bash
bun run wallpaper -- --text "Hello, World!" --width 3440 --height 1440 --out output/wall-3440x1440.png
```

Fast repeat captures after a build:

```bash
bun run wallpaper:build
bun run wallpaper:capture -- --text "Hello, World!" --width 3440 --height 1440
```

Control random replacement for spaces in your text:

```bash
bun run wallpaper:capture -- --text "Hello, World!" --spaceWithRandomCharacters 2 --width 3440 --height 1440
```

Options:

- `--text` text rendered in the wallpaper (default: `Hello, World!`)
- `--width` output width in pixels (default: `1920`)
- `--height` output height in pixels (default: `1080`)
- `--out` output image path (default: `output/wallpaper-{width}x{height}.png`)
- `--spaceWithRandomCharacters` replaces each space with this many random letters (default: `2`)

## Workflow

The screenshot flow uses the same React renderer and Tailwind styles as the app:

- Vite builds both `index.html` and `wallpaper.html`.
- Playwright opens `dist/wallpaper.html` via `file://...` with query parameters.
- The page renders with shared app code and sets `window.__wallpaperReady = true`.
- Playwright waits for readiness and captures the PNG.

## Parity Note

Because screenshots come from the built app renderer, visual parity is much closer and duplicated rendering logic is removed. If styles look stale after code changes, rerun `bun run wallpaper:build` (or use `bun run wallpaper`, which rebuilds first).
