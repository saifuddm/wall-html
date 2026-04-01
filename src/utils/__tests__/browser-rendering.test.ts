import { describe, it, expect } from "vitest";
import {
  buildTextBackgroundUrl,
  createBrowserRenderingRequest,
  getBrowserRenderingConfig,
} from "../browser-rendering";

describe("buildTextBackgroundUrl", () => {
  it("builds correct URL with all params", () => {
    const url = buildTextBackgroundUrl({
      origin: "https://example.com",
      width: 1920,
      height: 1080,
      displayText: "Hello world",
      randomTextToggle: true,
      cutOffTextToggle: false,
    });

    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://example.com");
    expect(parsed.pathname).toBe("/text-background");
    expect(parsed.searchParams.get("width")).toBe("1920");
    expect(parsed.searchParams.get("height")).toBe("1080");
    expect(parsed.searchParams.get("displayText")).toBe("Hello world");
    expect(parsed.searchParams.get("randomTextToggle")).toBe("true");
    expect(parsed.searchParams.get("cutOffTextToggle")).toBe("false");
  });

  it("encodes special characters in displayText", () => {
    const url = buildTextBackgroundUrl({
      origin: "https://example.com",
      width: 1000,
      height: 1000,
      displayText: "Hello & goodbye 🪨",
      randomTextToggle: true,
      cutOffTextToggle: true,
    });

    const parsed = new URL(url);
    expect(parsed.searchParams.get("displayText")).toBe("Hello & goodbye 🪨");
  });

  it("works with localhost origin", () => {
    const url = buildTextBackgroundUrl({
      origin: "http://localhost:5173",
      width: 500,
      height: 500,
      displayText: "test",
      randomTextToggle: false,
      cutOffTextToggle: true,
    });

    expect(url).toContain("http://localhost:5173/text-background");
  });
});

describe("createBrowserRenderingRequest", () => {
  it("returns correct payload structure", () => {
    const result = createBrowserRenderingRequest({
      width: 1920,
      height: 1080,
      url: "https://example.com/text-background?width=1920",
    });

    expect(result).toEqual({
      url: "https://example.com/text-background?width=1920",
      viewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      },
      gotoOptions: {
        waitUntil: "networkidle2",
        timeout: 45000,
      },
    });
  });

  it("always sets deviceScaleFactor to 1", () => {
    const result = createBrowserRenderingRequest({
      width: 500,
      height: 500,
      url: "https://example.com",
    });
    expect(result.viewport.deviceScaleFactor).toBe(1);
  });
});

describe("getBrowserRenderingConfig", () => {
  it("returns config when both env vars present", () => {
    const result = getBrowserRenderingConfig({
      CLOUDFLARE_ACCOUNT_ID: "abc123",
      CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: "token456",
    });
    expect(result).toEqual({
      accountId: "abc123",
      apiToken: "token456",
    });
  });

  it("throws when CLOUDFLARE_ACCOUNT_ID is missing", () => {
    expect(() =>
      getBrowserRenderingConfig({
        CLOUDFLARE_BROWSER_RENDERING_API_TOKEN: "token456",
      }),
    ).toThrow("Missing CLOUDFLARE_ACCOUNT_ID runtime binding.");
  });

  it("throws when CLOUDFLARE_BROWSER_RENDERING_API_TOKEN is missing", () => {
    expect(() =>
      getBrowserRenderingConfig({
        CLOUDFLARE_ACCOUNT_ID: "abc123",
      }),
    ).toThrow("Missing CLOUDFLARE_BROWSER_RENDERING_API_TOKEN runtime binding.");
  });

  it("throws when both env vars missing", () => {
    expect(() => getBrowserRenderingConfig({})).toThrow(
      "Missing CLOUDFLARE_ACCOUNT_ID runtime binding.",
    );
  });
});
