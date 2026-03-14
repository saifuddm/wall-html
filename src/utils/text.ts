export function splitIntoGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }

  return Array.from(text);
}

export function generateRandomCharacters(length: number): string {
  if (length <= 0) return "";

  return Array.from(
    { length },
    () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
  ).join("");
}
