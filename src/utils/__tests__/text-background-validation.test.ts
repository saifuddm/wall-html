import { describe, it, expect } from "vitest";
import {
  parseInteger,
  parseBoolean,
  parseString,
  validateRoute,
  calculateCpl,
  calculateLpp,
  isEmoji,
} from "../text-background-validation";

describe("parseInteger", () => {
  it("returns parsed number for valid string", () => {
    expect(parseInteger("500")).toBe(500);
  });

  it("returns default 1000 when undefined", () => {
    expect(parseInteger(undefined)).toBe(1000);
  });

  it("returns fallback when NaN", () => {
    expect(parseInteger("abc")).toBe(1000);
  });

  it("uses custom fallback", () => {
    expect(parseInteger(undefined, 200)).toBe(200);
    expect(parseInteger("xyz", 200)).toBe(200);
  });

  it("handles negative numbers", () => {
    expect(parseInteger("-10")).toBe(-10);
  });

  it("handles zero", () => {
    expect(parseInteger("0")).toBe(0);
  });

  it("truncates floats (parseInt behavior)", () => {
    expect(parseInteger("3.9")).toBe(3);
  });

  it("returns fallback for empty string", () => {
    expect(parseInteger("")).toBe(1000);
  });
});

describe("parseBoolean", () => {
  it('returns true for "true"', () => {
    expect(parseBoolean("true")).toBe(true);
  });

  it('returns false for "false"', () => {
    expect(parseBoolean("false")).toBe(false);
  });

  it("returns default true when undefined", () => {
    expect(parseBoolean(undefined)).toBe(true);
  });

  it("returns fallback for unrecognized strings", () => {
    expect(parseBoolean("yes")).toBe(true);
    expect(parseBoolean("1")).toBe(true);
    expect(parseBoolean("")).toBe(true);
  });

  it("uses custom fallback", () => {
    expect(parseBoolean(undefined, false)).toBe(false);
    expect(parseBoolean("garbage", false)).toBe(false);
  });
});

describe("parseString", () => {
  it("returns the value when provided", () => {
    expect(parseString("hello")).toBe("hello");
  });

  it("returns default text when undefined", () => {
    expect(parseString(undefined)).toBe(
      "This is a test of the text background generator 🪨",
    );
  });

  it("returns default text for empty string", () => {
    expect(parseString("")).toBe(
      "This is a test of the text background generator 🪨",
    );
  });

  it("uses custom fallback", () => {
    expect(parseString(undefined, "fallback")).toBe("fallback");
  });

  it("preserves whitespace in non-empty strings", () => {
    expect(parseString("  ")).toBe("  ");
  });
});

describe("validateRoute", () => {
  it("returns all defaults when no params provided", () => {
    const result = validateRoute({});
    expect(result).toEqual({
      width: 1000,
      height: 1000,
      displayText: "This is a test of the text background generator 🪨",
      randomTextToggle: true,
      cutOffTextToggle: true,
    });
  });

  it("parses all provided params", () => {
    const result = validateRoute({
      width: "1920",
      height: "1080",
      displayText: "Hello world",
      randomTextToggle: "false",
      cutOffTextToggle: "false",
    });
    expect(result).toEqual({
      width: 1920,
      height: 1080,
      displayText: "Hello world",
      randomTextToggle: false,
      cutOffTextToggle: false,
    });
  });

  it("handles partial params with defaults for the rest", () => {
    const result = validateRoute({ width: "800" });
    expect(result.width).toBe(800);
    expect(result.height).toBe(1000);
    expect(result.randomTextToggle).toBe(true);
  });
});

describe("isEmoji", () => {
  it("detects basic emoji", () => {
    expect(isEmoji("😀")).toBe(true);
    expect(isEmoji("🪨")).toBe(true);
    expect(isEmoji("❤")).toBe(true);
  });

  it("rejects regular characters", () => {
    expect(isEmoji("a")).toBe(false);
    expect(isEmoji("Z")).toBe(false);
    expect(isEmoji("1")).toBe(false);
    expect(isEmoji(" ")).toBe(false);
  });

  it("detects complex emoji", () => {
    expect(isEmoji("👍")).toBe(true);
    expect(isEmoji("🏳")).toBe(true);
  });

  it("rejects punctuation and symbols", () => {
    expect(isEmoji(".")).toBe(false);
    expect(isEmoji("@")).toBe(false);
    expect(isEmoji("#")).toBe(false);
  });
});

describe("calculateCpl", () => {
  // Formula: Math.floor((width - 64) / 76.8)
  it("calculates cpl for default width 1000", () => {
    expect(calculateCpl(1000)).toBe(Math.floor((1000 - 64) / 76.8));
    expect(calculateCpl(1000)).toBe(12);
  });

  it("calculates cpl for 1920 width", () => {
    expect(calculateCpl(1920)).toBe(Math.floor((1920 - 64) / 76.8));
    expect(calculateCpl(1920)).toBe(24);
  });

  it("returns 0 for very small width", () => {
    expect(calculateCpl(64)).toBe(0);
  });

  it("handles width smaller than padding", () => {
    expect(calculateCpl(30)).toBe(Math.floor((30 - 64) / 76.8));
  });
});

describe("calculateLpp", () => {
  // Formula: Math.floor(height / 128)
  it("calculates lpp for default height 1000", () => {
    expect(calculateLpp(1000)).toBe(Math.floor(1000 / 128));
    expect(calculateLpp(1000)).toBe(7);
  });

  it("calculates lpp for 1080 height", () => {
    expect(calculateLpp(1080)).toBe(Math.floor(1080 / 128));
    expect(calculateLpp(1080)).toBe(8);
  });

  it("returns 0 for height less than font size", () => {
    expect(calculateLpp(100)).toBe(0);
  });
});
