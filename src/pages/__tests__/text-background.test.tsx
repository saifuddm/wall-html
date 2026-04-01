import { describe, it, expect } from "vitest";
import { mapWordsToCharacters } from "../text-background";

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
