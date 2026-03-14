export const DEFAULT_TEXT = "There are things in the universe that are not yet known";
export const DEFAULT_SPACE_WITH_RANDOM_CHARACTERS = 2;
export const DEFAULT_REPLACE_BLANK_SPACE = false;

export function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;

  const parsed = Number.parseInt(value, 10);
  console.debug("parsed", parsed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function parseBoolean(value: string | null): boolean | null {
  if (!value) return null;

  return value === "true";
}

export function getRenderParams(search: string) {
  const params = new URLSearchParams(search);

  console.debug("params", params);

  return {
    showText: params.get("text")?.trim() || DEFAULT_TEXT,
    renderWidth: parsePositiveInt(params.get("width")),
    renderHeight: parsePositiveInt(params.get("height")),
    spaceWithRandomCharacters:
      parsePositiveInt(params.get("spaceWithRandomCharacters")) ||
      DEFAULT_SPACE_WITH_RANDOM_CHARACTERS,
    replaceBlankSpace:
      parseBoolean(params.get("replaceBlankSpace")) ||
      DEFAULT_REPLACE_BLANK_SPACE,
  };
}
