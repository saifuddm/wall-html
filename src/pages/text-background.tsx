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
  cutOffTextToggle: boolean;
};

const getRandomText = ({ charCount }: { charCount: number }) => {
  const randomTextElements: JSX.Element[] = [];

  for (let i = 0; i < charCount; i++) {
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
  wordMap,
  cpl,
}: {
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle: boolean;
  wordMap: string[];
  cpl: number;
}) => {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const displayTextElements: JSX.Element[] = [];
  let lineTracker = 0;
  if (cutOffTextToggle) {
    for (const word of wordMap) {
      let remainingCpl = cpl - displayTextElements.length + lineTracker * cpl;

      if (word.length < remainingCpl) {
        for (const { segment } of segmenter.segment(word)) {
          displayTextElements.push(
            ...handleDisplayCharacter({ char: segment, randomTextToggle }),
          );
        }
      } else {
        console.log(
          "cannot fit word in remaining space, padding with random text",
          remainingCpl,
        );
        // cannot fit word in remaining space, pad with random text
        for (let i = 0; i < remainingCpl; i++) {
          displayTextElements.push(
            ...handleDisplayCharacter({ char: " ", randomTextToggle }),
          );
        }
        lineTracker++;
        // after padding with random text, add word to display text elements
        for (const { segment } of segmenter.segment(word)) {
          displayTextElements.push(
            ...handleDisplayCharacter({ char: segment, randomTextToggle }),
          );
        }
      }
    }

    return displayTextElements;
  }

  for (const { segment } of segmenter.segment(displayText)) {
    displayTextElements.push(
      ...handleDisplayCharacter({ char: segment, randomTextToggle }),
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
    // subtract 1 space extra for emoji by adding a none display character

    return [
      <span class="hidden" aria-hidden="true">
        EmojiSpace
      </span>,
      <span class="opacity-100 font-emoji">{char}</span>,
    ];
  } else if (char === " ") {
    if (randomTextToggle) {
      return [
        <span class="opacity-25 font-display uppercase">
          {String.fromCharCode(Math.floor(Math.random() * 26) + 97)}
        </span>,
      ];
    }
    return [<span class="opacity-100 font-display">{"\u00A0"}</span>];
  } else {
    return [<span class="opacity-100 font-display uppercase">{char}</span>];
  }
};

const mapWordsToCharacters = ({ displayText }: { displayText: string }) => {
  const tokenSegmenter = new Intl.Segmenter("en", { granularity: "word" });
  const tokenSegments: string[] = [];
  for (const { segment } of tokenSegmenter.segment(displayText)) {
    tokenSegments.push(segment);
  }

  console.log(tokenSegments);
  return tokenSegments;
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
  const wordMap = mapWordsToCharacters({ displayText });
  const displayTextElements = getDisplayText({
    displayText,
    randomTextToggle,
    cutOffTextToggle,
    wordMap,
    cpl,
  });
  const remainingCharacters =
    totalNumberOfCharacters - displayTextElements.length;

  console.log("display char", displayTextElements.length < cpl);

  // top half of random text
  const topHalfRandomTextElements =
    cutOffTextToggle && displayTextElements.length > cpl
      ? getRandomText({
        charCount: Math.floor(remainingCharacters / 2 / cpl) * cpl,
      })
      : getRandomText({
        charCount: remainingCharacters / 2,
      });
  // bottom half of random text
  const bottomHalfRandomTextElements =
    cutOffTextToggle && displayTextElements.length > cpl
      ? getRandomText({
        charCount: remainingCharacters - topHalfRandomTextElements.length,
      })
      : getRandomText({
        charCount: remainingCharacters - topHalfRandomTextElements.length,
      });

  return (
    <main class="bg-slate-800 text-9xl text-white relative overflow-hidden h-screen w-screen flex flex-col justify-center items-center">
      <div class="text-9xl flex flex-row flex-wrap justify-center items-center px-8">
        {/* Half random text, display text, half random text */}
        {topHalfRandomTextElements}
        {displayTextElements}
        {bottomHalfRandomTextElements}
      </div>
    </main>
  );
};

export default TextBackground;
