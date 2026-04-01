import logger from "./logger";

const DEFAULT_SIZE = 1000;
const DEFAULT_TEXT = "This is a test of the text background generator 🪨";

// Validators
const parseInteger = (value?: string, fallback = DEFAULT_SIZE) => {
  if (value === undefined) return fallback;
  const n = parseInt(value);
  return Number.isNaN(n) ? fallback : n;
};

const parseBoolean = (value?: string, fallback = true) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const parseString = (value?: string, fallback = DEFAULT_TEXT) => {
  if (value === undefined || value.length === 0) return fallback;
  return value;
};

const validateRoute = ({
  width,
  height,
  displayText,
  randomTextToggle,
  cutOffTextToggle,
}: {
  width?: string;
  height?: string;
  displayText?: string;
  randomTextToggle?: string;
  cutOffTextToggle?: string;
}) => {
  const parsedWidth = parseInteger(width);
  const parsedHeight = parseInteger(height);
  const parsedDisplayText = parseString(displayText);
  const parsedRandomTextToggle = parseBoolean(randomTextToggle);
  const parsedCutOffTextToggle = parseBoolean(cutOffTextToggle);
  return {
    width: parsedWidth,
    height: parsedHeight,
    displayText: parsedDisplayText,
    randomTextToggle: parsedRandomTextToggle,
    cutOffTextToggle: parsedCutOffTextToggle,
  };
};

const isEmoji = (ch: string) => /\p{Extended_Pictographic}/u.test(ch);

// Calculators
const fontSizePx = 128;
const paddingX = 32 * 2;
const avgGlyphWidth = fontSizePx * 0.6;

const calculateCpl = (width: number) => {
  const cpl = Math.floor((width - paddingX) / avgGlyphWidth);
  logger.info({ width, cpl }, "calculated cpl");
  return cpl;
};

const calculateLpp = (height: number) => {
  const lpp = Math.floor(height / fontSizePx);
  logger.info({ height, lpp }, "calculated lpp");
  return lpp;
};

export {
  parseInteger,
  parseBoolean,
  parseString,
  validateRoute,
  calculateCpl,
  calculateLpp,
  isEmoji,
};
