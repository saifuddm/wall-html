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

export const buildTextBackgroundUrl = ({
  origin,
  width,
  height,
  displayText,
  randomTextToggle,
  cutOffTextToggle,
}: TextBackgroundScreenshotProps & {
  origin: string;
}): string => {
  const target = new URL("/text-background", origin);
  target.searchParams.set("width", width.toString());
  target.searchParams.set("height", height.toString());
  target.searchParams.set("displayText", displayText);
  target.searchParams.set("randomTextToggle", randomTextToggle.toString());
  target.searchParams.set("cutOffTextToggle", cutOffTextToggle.toString());

  return target.toString();
};

export const createBrowserRenderingRequest = ({
  width,
  height,
  url,
}: {
  width: number;
  height: number;
  url: string;
}) => {
  return {
    url,
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
