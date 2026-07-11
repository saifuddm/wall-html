import { describe, it, expect } from "vitest";
import { getDisplayText, mapWordsToCharacters } from "../text-background";
import { createRandom } from "../../utils/random";

const renderElements = (params: {
  displayText: string;
  cutOffTextToggle: boolean;
  cpl: number;
  seed?: string;
  randomTextToggle?: boolean;
}) =>
  getDisplayText({
    displayText: params.displayText,
    randomTextToggle: params.randomTextToggle ?? true,
    cutOffTextToggle: params.cutOffTextToggle,
    wordMap: mapWordsToCharacters({ displayText: params.displayText }),
    cpl: params.cpl,
    random: createRandom(params.seed ?? "test"),
  });

describe("getDisplayText newline handling", () => {
  it("pads to the end of the line in cut-off mode", () => {
    // "abc" (3 cells) + newline pads 7 more + "de" (2 cells)
    const elements = renderElements({
      displayText: "abc\nde",
      cutOffTextToggle: true,
      cpl: 10,
    });
    expect(elements.length).toBe(12);
  });

  it("pads a full blank line for a double newline", () => {
    // "abc" + pad 7 + blank line of 10 + "de"
    const elements = renderElements({
      displayText: "abc\n\nde",
      cutOffTextToggle: true,
      cpl: 10,
    });
    expect(elements.length).toBe(22);
  });

  it("pads to the end of the line in word mode", () => {
    // "hello" (5 cells) + newline pads 5 more + "world" (5 cells)
    const elements = renderElements({
      displayText: "hello\nworld",
      cutOffTextToggle: false,
      cpl: 10,
    });
    expect(elements.length).toBe(15);
  });

  it("counts spaces around a newline as cells in word mode", () => {
    // "hi" (2) + " " (1) + newline pads 7 + " " (1) + "yo" (2)
    const elements = renderElements({
      displayText: "hi \n yo",
      cutOffTextToggle: false,
      cpl: 10,
    });
    expect(elements.length).toBe(13);
  });

  it("does not pad when cpl is zero", () => {
    const elements = renderElements({
      displayText: "ab\ncd",
      cutOffTextToggle: true,
      cpl: 0,
    });
    expect(elements.length).toBe(4);
  });
});

describe("getDisplayText determinism", () => {
  it("renders identical filler for the same seed", () => {
    const run = () =>
      JSON.stringify(
        renderElements({
          displayText: "a  b\nc",
          cutOffTextToggle: true,
          cpl: 10,
          seed: "wall",
        }),
      );
    expect(run()).toBe(run());
  });

  it("renders different filler for different seeds", () => {
    const withSeed = (seed: string) =>
      JSON.stringify(
        renderElements({
          displayText: "a                b",
          cutOffTextToggle: true,
          cpl: 10,
          seed,
        }),
      );
    expect(withSeed("wall")).not.toBe(withSeed("html"));
  });
});

describe("mapWordsToCharacters", () => {
  it("segments simple text into words and spaces", () => {
    const result = mapWordsToCharacters({ displayText: "Hello world" });
    expect(result).toEqual(["Hello", " ", "world"]);
  });

  it("handles single word", () => {
    const result = mapWordsToCharacters({ displayText: "Hello" });
    expect(result).toEqual(["Hello"]);
  });

  it("handles punctuation as separate segments", () => {
    const result = mapWordsToCharacters({ displayText: "Hello, world!" });
    // Intl.Segmenter treats punctuation attached to words differently
    expect(result).toContain("Hello");
    expect(result).toContain("world");
    expect(result.length).toBeGreaterThan(2);
  });

  it("handles emoji in text", () => {
    const result = mapWordsToCharacters({ displayText: "Hello 🪨" });
    expect(result).toContain("Hello");
    expect(result).toContain("🪨");
  });

  it("handles empty string", () => {
    const result = mapWordsToCharacters({ displayText: "" });
    expect(result).toEqual([]);
  });

  it("handles multiple spaces", () => {
    const result = mapWordsToCharacters({ displayText: "a  b" });
    // Intl.Segmenter groups consecutive spaces as a single segment
    expect(result).toContain("a");
    expect(result).toContain("b");
    expect(result.some((s) => s.trim() === "" && s.length > 0)).toBe(true);
  });

  it("handles text with numbers", () => {
    const result = mapWordsToCharacters({ displayText: "test 123 hello" });
    expect(result).toContain("test");
    expect(result).toContain("123");
    expect(result).toContain("hello");
  });
});
