import { useMemo } from "react";
import { useCharacterLayout } from "./hooks/useCharacterLayout";
import { generateRandomCharacters, splitIntoGraphemes } from "./utils/text";
import { getRenderParams } from "./utils/urlParams";

function App() {
  const { showText, renderWidth, renderHeight } = useMemo(
    () => getRenderParams(window.location.search),
    [],
  );

  const showTextChars = useMemo(() => splitIntoGraphemes(showText), [showText]);
  const showTextLength = showTextChars.length;
  const { contentRef, measureCharRef, layoutState } =
    useCharacterLayout(showTextLength);

  // Generate only as many random characters as fit in the content area (computed after measure)
  const randomCharacters = useMemo(() => {
    return generateRandomCharacters(layoutState.characterCount);
  }, [layoutState.characterCount]);

  // Build array of spans: each random char is its own span (opacity-25), SHOW_TEXT is one span (opacity-100)
  const characterSpans = useMemo(() => {
    const spans: React.ReactNode[] = [];
    const before = randomCharacters.slice(0, layoutState.splitIndex);
    const after = randomCharacters.slice(layoutState.splitIndex);
    for (let i = 0; i < before.length; i++) {
      spans.push(
        <span key={`before-${i}`} className="inline-flex w-[1ch] opacity-25">
          {before[i]}
        </span>,
      );
    }
    for (let i = 0; i < showTextChars.length; i++) {
      spans.push(
        <span
          key={`show-text-${i}`}
          className="inline-flex w-[1ch] opacity-100"
        >
          {showTextChars[i]}
        </span>,
      );
    }
    for (let i = 0; i < after.length; i++) {
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
  }, [randomCharacters, layoutState.splitIndex, showTextChars]);

  return (
    <div
      className="bg-slate-800 text-9xl text-white text-wrap relative overflow-hidden"
      style={{
        width: renderWidth ? `${renderWidth}px` : "100vw",
        height: renderHeight ? `${renderHeight}px` : "100vh",
      }}
    >
      {/* Single overlay frame using inset box-shadow */}
      <div
        className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_0_4rem_rgba(30,41,59,0.8)]"
        aria-hidden
      />

      {/* Content wrapper: measured for split calculation */}
      <div
        ref={contentRef}
        className="absolute inset-8 overflow-hidden text-center"
      >
        {/* Hidden span to measure single character width (same font as content) */}
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

export default App;
