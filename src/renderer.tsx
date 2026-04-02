import { jsxRenderer } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";

export const renderer = jsxRenderer(({ children }, c) => {
  const origin = new URL(c.req.url).origin;
  const canonicalUrl = `${origin}${c.req.path}`;
  const ogImageUrl = `${origin}/screenshot-rest-url?width=1200&height=630&displayText=Wall+HTML&randomTextToggle=true&cutOffTextToggle=false`;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#0c0f1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wall HTML — Text-to-Image Screenshot API</title>
        <meta
          name="description"
          content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly via Cloudflare Workers."
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Wall HTML — Text-to-Image Screenshot API"
        />
        <meta
          property="og:description"
          content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Wall HTML — Text-to-Image Screenshot API"
        />
        <meta
          name="twitter:description"
          content="Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly."
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta
          name="google-site-verification"
          content="W-MoMLbOEiODbIQuB--Urae1Aw3EQBIZ3S7xq7Xzpx4"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Wall HTML",
              url: "https://wall.saifuddm.work/",
              description:
                "Turn any text into bold typographic screenshots. Set dimensions, tweak spacing, and get a PNG back instantly via Cloudflare Workers.",
              applicationCategory: "DesignApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "50",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
        <script
          src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"
          defer
        />
      </head>
      <body class="bg-surface">{children}</body>
    </html>
  );
});
