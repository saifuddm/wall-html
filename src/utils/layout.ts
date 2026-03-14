type CharacterLayout = {
  randomCharactersNeeded: number;
  splitIndex: number;
};

export function calculateCharacterLayout(
  contentWidth: number,
  contentHeight: number,
  charWidth: number,
  charHeight: number,
  showTextLength: number,
): CharacterLayout | null {
  console.log("showTextLength", showTextLength);
  if (contentWidth <= 0 || contentHeight <= 0 || charWidth <= 0 || charHeight <= 0) {
    return null;
  }

  const charsPerLine = Math.max(0, Math.floor(contentWidth / charWidth));
  const totalLines = Math.max(0, Math.ceil(contentHeight / charHeight));
  const totalSlots = totalLines * charsPerLine;
  const randomCharactersNeeded = Math.max(0, totalSlots - showTextLength);
  const splitIndex = Math.floor(randomCharactersNeeded / 2);

  return { randomCharactersNeeded, splitIndex };
}
