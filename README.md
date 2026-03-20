# wall-html

This Worker exposes a text-background preview page and a `/screenshot` API that
uses the Cloudflare Browser Rendering REST API to return a PNG image.

## Install and run

```txt
npm install
npm run dev
```

## Required Cloudflare runtime configuration

The screenshot route no longer uses a Worker browser binding. Instead, it calls
Cloudflare's Browser Rendering `/screenshot` endpoint directly, which requires:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_BROWSER_RENDERING_API_TOKEN`

The API token must include the `Browser Rendering - Edit` permission.

For local development, you can place these in a `.dev.vars` file:

```txt
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_BROWSER_RENDERING_API_TOKEN=your-api-token
```

For deployed environments, set them in your Worker configuration and secrets.

## Deploy

```txt
npm run deploy
```

## Generate Cloudflare binding types

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
