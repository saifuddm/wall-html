import { describe, it, expect } from "vitest";
import validateScreenshot from "../screenshot-validator";

describe("validateScreenshot", () => {
  it("returns all defaults when no params provided", () => {
    const result = validateScreenshot({});
    expect(result).toEqual({
      width: 1000,
      height: 1000,
      displayText: "This is a test of the text background generator 🪨",
      randomTextToggle: true,
      cutOffTextToggle: true,
    });
  });

  it("parses all provided params", () => {
    const result = validateScreenshot({
      width: "1920",
      height: "1080",
      displayText: "Custom text",
      randomTextToggle: "false",
      cutOffTextToggle: "false",
    });
    expect(result).toEqual({
      width: 1920,
      height: 1080,
      displayText: "Custom text",
      randomTextToggle: false,
      cutOffTextToggle: false,
    });
  });

  it("handles invalid width gracefully", () => {
    const result = validateScreenshot({ width: "not-a-number" });
    expect(result.width).toBe(1000);
  });

  it("handles empty displayText", () => {
    const result = validateScreenshot({ displayText: "" });
    expect(result.displayText).toBe(
      "This is a test of the text background generator 🪨",
    );
  });
});
