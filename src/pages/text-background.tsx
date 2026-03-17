import { JSX } from "hono/jsx/jsx-runtime";
import {
  calculateCpl,
  calculateLpp,
  isEmoji,
} from "../utils/text-background-validation";

type TextBackgroundProps = {
  width: number;
  height: number;
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle?: boolean;
};

const getRandomText = ({ cpl }: { cpl: number }) => {
  const randomTextElements: JSX.Element[] = [];

  for (let i = 0; i < cpl; i++) {
    randomTextElements.push(
      <span class="opacity-25 font-display uppercase">
        {String.fromCharCode(Math.floor(Math.random() * 26) + 97)}
      </span>,
    );
  }
  return randomTextElements;
};

const getDisplayText = ({
  displayText,
  randomTextToggle,
  cutOffTextToggle,
  cpl,
}: {
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle?: boolean;
  cpl?: number;
}) => {
  const displayTextElements = [];
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

  for (const { segment } of segmenter.segment(displayText)) {
    displayTextElements.push(
      handleDisplayCharacter({ char: segment, randomTextToggle }),
    );
  }
  return displayTextElements;
};

const handleDisplayCharacter = ({
  char,
  randomTextToggle,
}: {
  char: string;
  randomTextToggle: boolean;
}) => {
  if (isEmoji(char)) {
    console.log("emoji found", char);
    return <span class="opacity-100 font-emoji">{char}</span>;
  } else if (char === " ") {
    if (randomTextToggle) {
      return (
        <span class="opacity-25 font-display uppercase">
          {String.fromCharCode(Math.floor(Math.random() * 26) + 97)}
        </span>
      );
    }
    return <span class="opacity-100 font-display">{"\u00A0"}</span>;
  } else {
    return <span class="opacity-100 font-display uppercase">{char}</span>;
  }
};

const TextBackground = ({
  width,
  height,
  displayText,
  randomTextToggle,
  cutOffTextToggle,
}: TextBackgroundProps) => {
  const cpl = calculateCpl(width);
  const lpp = calculateLpp(height);
  const totalNumberOfCharacters = cpl * lpp;
  const remainingCharacters = totalNumberOfCharacters - displayText.length;
  const randomTextElements = getRandomText({ cpl: remainingCharacters });
  console.log("Col start", Math.floor(remainingCharacters / 2), cpl);
  const displayTextElements = getDisplayText({
    displayText,
    randomTextToggle,
    cutOffTextToggle,
  });
  return (
    <main class="bg-slate-800 text-9xl text-white relative overflow-hidden h-screen w-screen flex flex-col justify-center items-center">
      <div class="text-9xl flex flex-row flex-wrap justify-center items-center px-8">
        {/* Half random text, display text, half random text */}
        {randomTextElements.slice(0, remainingCharacters / 2)}
        {displayTextElements}
        {randomTextElements.slice(
          remainingCharacters / 2,
          randomTextElements.length,
        )}
      </div>
    </main>
  );
};

export default TextBackground;
