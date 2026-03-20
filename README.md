# wall-html

This Worker exposes a text-background preview page and two screenshot APIs so
you can compare the original browser-binding flow against Cloudflare Browser
Rendering REST URL mode.

## Install and run

```txt
npm install
npm run dev
```

## Screenshot routes

- `/screenshot`
  - original flow using the Worker browser binding with
    `@cloudflare/puppeteer`
- `/screenshot-rest-url`
  - new flow using Cloudflare Browser Rendering REST API in `url` mode
  - it screenshots your existing `/text-background` route
  - best tested against a deployed/public Worker URL, since Cloudflare cannot
    fetch your local `localhost` dev server

## Required Cloudflare runtime configuration

The original `/screenshot` route requires a Worker browser binding:

- `MYBROWSER`

The `/screenshot-rest-url` route requires:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_BROWSER_RENDERING_API_TOKEN`

The API token must include the `Browser Rendering - Edit` permission.

For local development, you can place these in a `.dev.vars` file:

```txt
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_BROWSER_RENDERING_API_TOKEN=your-api-token
```

For deployed environments, set the account ID and API token in your Worker
configuration and secrets.

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
