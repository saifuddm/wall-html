import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wall HTML — Text-to-Image Screenshot API</title>
        <meta name="description" content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly via Cloudflare Workers." />
        <meta property="og:title" content="Wall HTML — Text-to-Image Screenshot API" />
        <meta property="og:description" content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wall HTML — Text-to-Image Screenshot API" />
        <meta name="twitter:description" content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly." />
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body class="bg-[#0c0f1a]">{children}</body>
    </html>
  )
})
