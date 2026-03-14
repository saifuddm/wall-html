export const DEFAULT_TEXT = "Build. Ship. Repeat.";

export function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getRenderParams(search: string) {
  const params = new URLSearchParams(search);

  return {
    showText: params.get("text")?.trim() || DEFAULT_TEXT,
    renderWidth: parsePositiveInt(params.get("width")),
    renderHeight: parsePositiveInt(params.get("height")),
  };
}
