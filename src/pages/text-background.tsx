import { JSX } from "hono/jsx/jsx-runtime";
import { isEmoji } from "../utils/text-background-validation";

type TextBackgroundProps = {
  cpl: number;
  lpp: number;
  displayText: string;
  randomTextToggle: boolean;
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

const getDisplayText = ({ displayText }: { displayText: string }) => {
  const displayTextElements = [];
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

  for (const { segment } of segmenter.segment(displayText)) {
    displayTextElements.push(handleDisplayCharacter({ char: segment }));
  }
  return displayTextElements;
};

const handleDisplayCharacter = ({ char }: { char: string }) => {
  if (isEmoji(char)) {
    console.log("emoji found", char);
    return <span class="opacity-100 font-emoji">{char}</span>;
  } else if (char === " ") {
    return <span class="opacity-100">{"\u00A0"}</span>;
  } else {
    return <span class="opacity-100 font-display uppercase">{char}</span>;
  }
};

const TextBackground = ({
  cpl,
  lpp,
  displayText,
  randomTextToggle,
}: TextBackgroundProps) => {
  const totalNumberOfCharacters = cpl * lpp;
  const remainingCharacters = totalNumberOfCharacters - displayText.length;
  const randomTextElements = getRandomText({ cpl: remainingCharacters });
  const displayTextElements = getDisplayText({ displayText });
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
