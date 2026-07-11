import { JSX } from "hono/jsx/jsx-runtime";
import {
  calculateCpl,
  calculateLpp,
  isEmoji,
} from "../utils/text-background-validation";
import { createRandom } from "../utils/random";
import logger from "../utils/logger";

type TextBackgroundProps = {
  width: number;
  height: number;
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle: boolean;
  seed: string;
};

type RandomFn = () => number;

const getRandomText = ({
  charCount,
  random,
}: {
  charCount: number;
  random: RandomFn;
}) => {
  const randomTextElements: JSX.Element[] = [];

  for (let i = 0; i < charCount; i++) {
    randomTextElements.push(
      <span class="opacity-25 font-display uppercase">
        {String.fromCharCode(Math.floor(random() * 26) + 97)}
      </span>,
    );
  }
  return randomTextElements;
};

// Fill the rest of the current line with filler cells so the next character
// lands on a fresh line. At a line start, pads a full line ("\n\n" shows a
// visible blank line).
const padToLineEnd = ({
  elements,
  cpl,
  randomTextToggle,
  random,
}: {
  elements: JSX.Element[];
  cpl: number;
  randomTextToggle: boolean;
  random: RandomFn;
}) => {
  if (cpl <= 0) return;
  const used = elements.length % cpl;
  const padCount = used === 0 ? cpl : cpl - used;
  for (let i = 0; i < padCount; i++) {
    elements.push(
      ...handleDisplayCharacter({ char: " ", randomTextToggle, random }),
    );
  }
};

const getDisplayText = ({
  displayText,
  randomTextToggle,
  cutOffTextToggle,
  wordMap,
  cpl,
  random,
}: {
  displayText: string;
  randomTextToggle: boolean;
  cutOffTextToggle: boolean;
  wordMap: string[];
  cpl: number;
  random: RandomFn;
}) => {
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const displayTextElements: JSX.Element[] = [];
  if (!cutOffTextToggle) {
    for (const word of wordMap) {
      // Whitespace runs containing newlines come through as single segments
      // (e.g. " \n "), so handle them character by character.
      if (word.includes("\n")) {
        for (const char of word) {
          if (char === "\n") {
            padToLineEnd({
              elements: displayTextElements,
              cpl,
              randomTextToggle,
              random,
            });
          } else {
            displayTextElements.push(
              ...handleDisplayCharacter({ char, randomTextToggle, random }),
            );
          }
        }
        continue;
      }

      const remainingCpl =
        cpl > 0 ? cpl - (displayTextElements.length % cpl) : 0;

      let wordLength = word.length;
      if (isEmoji(word)) {
        wordLength = 3;
      }

      if (wordLength < remainingCpl) {
        for (const { segment } of segmenter.segment(word)) {
          displayTextElements.push(
            ...handleDisplayCharacter({
              char: segment,
              randomTextToggle,
              random,
            }),
          );
        }
      } else {
        logger.debug({ word, remainingCpl }, "padding with random text, word does not fit");
        // cannot fit word in remaining space, pad with random text
        for (let i = 0; i < remainingCpl; i++) {
          displayTextElements.push(
            ...handleDisplayCharacter({ char: " ", randomTextToggle, random }),
          );
        }
        // after padding with random text, add word to display text elements
        for (const { segment } of segmenter.segment(word)) {
          displayTextElements.push(
            ...handleDisplayCharacter({
              char: segment,
              randomTextToggle,
              random,
            }),
          );
        }
      }
    }

    return displayTextElements;
  }

  for (const { segment } of segmenter.segment(displayText)) {
    if (segment === "\n") {
      padToLineEnd({
        elements: displayTextElements,
        cpl,
        randomTextToggle,
        random,
      });
      continue;
    }
    displayTextElements.push(
      ...handleDisplayCharacter({ char: segment, randomTextToggle, random }),
    );
  }
  return displayTextElements;
};

const handleDisplayCharacter = ({
  char,
  randomTextToggle,
  random,
}: {
  char: string;
  randomTextToggle: boolean;
  random: RandomFn;
}) => {
  if (isEmoji(char)) {
    logger.debug({ char }, "emoji found");
    // subtract 1 space extra for emoji by adding a none display character

    return [
      <span class="hidden" aria-hidden="true">
        EmojiSpace
      </span>,
      <div class="w-[3ch] font-display text-center opacity-100">
        <span class=" font-emoji">{char}</span>
      </div>,
      <span class="hidden" aria-hidden="true">
        EmojiSpace
      </span>,
    ];
  } else if (char === " ") {
    if (randomTextToggle) {
      return [
        <span class="opacity-25 font-display uppercase">
          {String.fromCharCode(Math.floor(random() * 26) + 97)}
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

  logger.debug({ words: tokenSegments }, "word map");
  return tokenSegments;
};

const TextBackground = ({
  width,
  height,
  displayText,
  randomTextToggle,
  cutOffTextToggle,
  seed,
}: TextBackgroundProps) => {
  const random = createRandom(seed);
  // Form submissions normalize textarea newlines to CRLF.
  const normalizedText = displayText.replace(/\r\n?/g, "\n");
  const cpl = calculateCpl(width);
  const lpp = calculateLpp(height);
  const totalNumberOfCharacters = cpl * lpp;
  const wordMap = mapWordsToCharacters({ displayText: normalizedText });
  const displayTextElements = getDisplayText({
    displayText: normalizedText,
    randomTextToggle,
    cutOffTextToggle,
    wordMap,
    cpl,
    random,
  });
  const remainingCharacters =
    totalNumberOfCharacters - displayTextElements.length;

  logger.info({ cpl, lpp, totalChars: totalNumberOfCharacters, displayChars: displayTextElements.length }, "rendering text background");

  // top half of random text — line-aligned when the text spans multiple
  // lines (word mode overflow or explicit newlines), otherwise offset so a
  // single line of text sits horizontally centered
  const topHalfRandomTextElements =
    (!cutOffTextToggle && displayTextElements.length > cpl) ||
    normalizedText.includes("\n")
      ? getRandomText({
          charCount: Math.round(remainingCharacters / 2 / cpl) * cpl,
          random,
        })
      : getRandomText({
          charCount:
            Math.round(remainingCharacters / 2 / cpl) * cpl +
            Math.floor((cpl - displayTextElements.length) / 2),
          random,
        });
  // bottom half of random text
  const bottomHalfRandomTextElements = getRandomText({
    charCount: remainingCharacters - topHalfRandomTextElements.length,
    random,
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
export {
  getRandomText,
  getDisplayText,
  handleDisplayCharacter,
  mapWordsToCharacters,
  padToLineEnd,
};
