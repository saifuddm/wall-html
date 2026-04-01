const DEFAULT_SIZE = 1000;
const DEFAULT_TEXT = "This is a test of the text background generator 🪨";

const parseInteger = (value?: string, fallback = DEFAULT_SIZE) => {
  if (value === undefined) return fallback;
  const n = parseInt(value);
  return Number.isNaN(n) ? fallback : n;
};

const parseString = (value?: string, fallback = DEFAULT_TEXT) => {
  if (value === undefined || value.length === 0) return fallback;
  return value;
};

const parseBoolean = (value?: string, fallback = true) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const validateScreenshot = ({
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

export default validateScreenshot;
