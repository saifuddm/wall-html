# Wallpaper HTML

Project is a Cloudflare Workers service that generates text wallpaper/background PNGs. Users submit text and dimensions, and the service renders styled text into a full-viewport HTML page, then screenshots it to produce an image. Built with Hono (web framework), Vite (build), Tailwind CSS v4, and Cloudflare Puppeteer for browser automation.


## Architecture

**Routes** (`src/index.tsx`):
- `GET /` — Landing page with interactive form
- `GET /text-background` — Renders the text background as HTML (strict validation via `validateRoute`)
- `GET /screenshot` — Screenshots `/text-background` using Puppeteer browser binding (`MYBROWSER`)
- `GET /screenshot-rest-url` — Screenshots via Cloudflare Browser Rendering REST API (requires `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_BROWSER_RENDERING_API_TOKEN` env vars)
- `GET /health` — Health check


**Text layout engine** (`src/pages/text-background.tsx`):
- Calculates characters-per-line and lines-per-page from pixel dimensions (font size 128px, padding 64px, glyph width ratio 0.6)
- Supports word-aware wrapping (`cutOffTextToggle=false`) or continuous fill (`cutOffTextToggle=true`)
- Random lowercase letters fill empty space at 25% opacity (`randomTextToggle`)
- All randomness is seeded (`seed` param, `src/utils/random.ts`), so identical URLs render identical walls — the live preview always matches the generated screenshot
- Layout control characters in `displayText`: extra spaces become filler cells (one grid cell each), and `\n` pads the rest of the current line so following text starts on a new line (`\n\n` yields a blank line)
- Emoji characters get special 3ch-wide rendering with hidden spacing elements
- Uses `Intl.Segmenter` for word boundary detection

**SSR rendering**: Hono JSX renderer (`src/renderer.tsx`) wraps pages with HTML shell including Tailwind CSS and Google Fonts (Doto, Noto Emoji).

## Key Parameters

All routes accept: `width`, `height`, `displayText`, `randomTextToggle`, `cutOffTextToggle`, `seed`. Defaults for screenshot routes: 1000×1000, random text enabled with default sample text, seed `"default"`.
