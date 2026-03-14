import { useEffect, useMemo } from "react";
import { useCharacterLayout } from "../hooks/useCharacterLayout";
import { generateRandomCharacters, splitIntoGraphemes } from "../utils/text";

type WallpaperRendererProps = {
  text: string;
  renderWidth: number | null;
  renderHeight: number | null;
  spaceWithRandomCharacters: number;
  onReady?: () => void;
};

export function WallpaperRenderer({
  text,
  renderWidth,
  renderHeight,
  spaceWithRandomCharacters,
  onReady,
}: WallpaperRendererProps) {
  const showTextChars = useMemo(() => splitIntoGraphemes(text), [text]);
  const showTextLength = useMemo(() => {
    let nonSpaceCount = 0;
    let spaceCount = 0;
    for (let i = 0; i < showTextChars.length; i += 1) {
      if (showTextChars[i] === " ") {
        spaceCount += 1;
      } else {
        nonSpaceCount += 1;
      }
    }

    return nonSpaceCount + spaceCount * spaceWithRandomCharacters;
  }, [showTextChars, spaceWithRandomCharacters]);
  const { contentRef, measureCharRef, layoutState } =
    useCharacterLayout(showTextLength);

  const randomCharacters = useMemo(() => {
    return generateRandomCharacters(layoutState.characterCount);
  }, [layoutState.characterCount]);

  const characterSpans = useMemo(() => {
    const spans: React.ReactNode[] = [];
    const before = randomCharacters.slice(0, layoutState.splitIndex);
    const after = randomCharacters.slice(layoutState.splitIndex);

    for (let i = 0; i < before.length; i += 1) {
      spans.push(
        <span key={`before-${i}`} className="inline-flex w-[1ch] opacity-25">
          {before[i]}
        </span>,
      );
    }

    let showTextTokenIndex = 0;
    for (let i = 0; i < showTextChars.length; i += 1) {
      if (showTextChars[i] === " " && spaceWithRandomCharacters > 0) {
        const randomSpaceCharacters = generateRandomCharacters(
          spaceWithRandomCharacters,
        );
        for (let j = 0; j < randomSpaceCharacters.length; j += 1) {
          spans.push(
            <span
              key={`show-text-space-random-${showTextTokenIndex}`}
              className="inline-flex w-[1ch] opacity-25"
            >
              {randomSpaceCharacters[j]}
            </span>,
          );
          showTextTokenIndex += 1;
        }
        continue;
      }

      spans.push(
        <span
          key={`show-text-${showTextTokenIndex}`}
          className="inline-flex w-[1ch] opacity-100"
        >
          {showTextChars[i]}
        </span>,
      );
      showTextTokenIndex += 1;
    }

    for (let i = 0; i < after.length; i += 1) {
      spans.push(
        <span
          key={`after-${layoutState.splitIndex + i}`}
          className="inline-flex w-[1ch] opacity-25"
        >
          {after[i]}
        </span>,
      );
    }

    return spans;
  }, [
    randomCharacters,
    layoutState.splitIndex,
    showTextChars,
    spaceWithRandomCharacters,
  ]);

  useEffect(() => {
    if (!onReady) return;

    let cancelled = false;
    const markReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      if (!cancelled) {
        onReady();
      }
    };

    markReady().catch(() => {
      if (!cancelled) {
        onReady();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [characterSpans, onReady]);

  return (
    <div
      className="bg-slate-800 text-9xl text-white text-wrap relative overflow-hidden"
      style={{
        width: renderWidth ? `${renderWidth}px` : "100vw",
        height: renderHeight ? `${renderHeight}px` : "100vh",
      }}
    >
      <div
        className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_0_4rem_rgba(30,41,59,0.8)]"
        aria-hidden
      />
      <div ref={contentRef} className="absolute inset-8 overflow-hidden text-center">
        <span
          ref={measureCharRef}
          className="absolute opacity-0 pointer-events-none"
          aria-hidden
        >
          a
        </span>
        <p className="uppercase wrap-anywhere">{characterSpans}</p>
      </div>
    </div>
  );
}
