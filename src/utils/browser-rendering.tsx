import { renderToString } from "hono/jsx/dom/server";
import TextBackground from "../pages/text-background";

type TextBackgroundScreenshotProps = {
  width: number;
  height: number;
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle: boolean;
};

type BrowserRenderingEnv = {
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_BROWSER_RENDERING_API_TOKEN?: string;
};

const SCREENSHOT_STYLE = `
  @import url("https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@300..700&display=swap");

  :root {
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(30 41 59);
  }

  body {
    color: white;
  }

  .bg-slate-800 {
    background: rgb(30 41 59);
  }

  .text-9xl {
    font-size: 8rem;
    line-height: 1;
  }

  .text-white {
    color: white;
  }

  .relative {
    position: relative;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .h-screen {
    height: 100vh;
  }

  .w-screen {
    width: 100vw;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-row {
    flex-direction: row;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .justify-center {
    justify-content: center;
  }

  .items-center {
    align-items: center;
  }

  .px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .opacity-25 {
    opacity: 0.25;
  }

  .opacity-100 {
    opacity: 1;
  }

  .font-display {
    font-family: "Doto", sans-serif;
  }

  .font-emoji {
    font-family: "Noto Emoji", sans-serif;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .hidden {
    display: none;
  }
`;

const ScreenshotDocument = ({
  width,
  height,
  displayText,
  randomTextToggle,
  cutOffTextToggle,
}: TextBackgroundScreenshotProps) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content={`width=${width}, height=${height}, initial-scale=1`}
        />
        <style>{SCREENSHOT_STYLE}</style>
      </head>
      <body>
        <TextBackground
          width={width}
          height={height}
          displayText={displayText}
          randomTextToggle={randomTextToggle}
          cutOffTextToggle={cutOffTextToggle}
        />
      </body>
    </html>
  );
};

export const buildScreenshotHtml = (
  props: TextBackgroundScreenshotProps,
): string => {
  return `<!DOCTYPE html>${renderToString(<ScreenshotDocument {...props} />)}`;
};

export const createBrowserRenderingRequest = ({
  width,
  height,
  html,
}: {
  width: number;
  height: number;
  html: string;
}) => {
  return {
    html,
    viewport: {
      width,
      height,
      deviceScaleFactor: 1,
    },
    gotoOptions: {
      waitUntil: "networkidle2",
      timeout: 45000,
    },
  };
};

export const getBrowserRenderingConfig = (
  env: BrowserRenderingEnv,
): {
  accountId: string;
  apiToken: string;
} => {
  if (!env.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID runtime binding.");
  }

  if (!env.CLOUDFLARE_BROWSER_RENDERING_API_TOKEN) {
    throw new Error(
      "Missing CLOUDFLARE_BROWSER_RENDERING_API_TOKEN runtime binding.",
    );
  }

  return {
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: env.CLOUDFLARE_BROWSER_RENDERING_API_TOKEN,
  };
};
