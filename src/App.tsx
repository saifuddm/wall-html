import { useLayoutEffect, useMemo, useRef, useState } from "react";

function App() {
  const SHOW_TEXT = " This is a wall of text and its my background ";
  const showTextChars = useMemo(() => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      return Array.from(segmenter.segment(SHOW_TEXT), (s) => s.segment);
    }
    return Array.from(SHOW_TEXT);
  }, [SHOW_TEXT]);
  const showTextLength = showTextChars.length;
  const contentRef = useRef<HTMLDivElement>(null);
  const measureCharRef = useRef<HTMLSpanElement>(null);
  const [splitIndex, setSplitIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Generate only as many random characters as fit in the content area (computed after measure)
  const randomCharacters = useMemo(() => {
    if (characterCount <= 0) return "";
    return Array.from({ length: characterCount }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    ).join("");
  }, [characterCount]);

  // Build array of spans: each random char is its own span (opacity-25), SHOW_TEXT is one span (opacity-100)
  const characterSpans = useMemo(() => {
    const spans: React.ReactNode[] = [];
    const before = randomCharacters.slice(0, splitIndex);
    const after = randomCharacters.slice(splitIndex);
    for (let i = 0; i < before.length; i++) {
      spans.push(
        <span key={`before-${i}`} className="inline-flex opacity-25">
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
          key={`after-${splitIndex + i}`}
          className="inline-flex opacity-25"
        >
          {after[i]}
        </span>,
      );
    }
    return spans;
  }, [randomCharacters, splitIndex, showTextChars]);

  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!contentRef.current || !measureCharRef.current) return;
      const contentRect = contentRef.current.getBoundingClientRect();
      const charRect = measureCharRef.current.getBoundingClientRect();
      const charWidth = charRect.width;
      const charHeight = charRect.height;
      if (charWidth <= 0 || charHeight <= 0) return;

      const charsPerLine = Math.max(
        0,
        Math.ceil(contentRect.width / charWidth),
      );
      const totalLines = Math.max(
        0,
        Math.ceil(contentRect.height / charHeight),
      );
      const totalSlots = totalLines * charsPerLine;
      const randomCharsNeeded = Math.max(0, totalSlots - showTextLength);
      const splitIndexValue = Math.floor(randomCharsNeeded / 2);

      setCharacterCount((prev) =>
        prev !== randomCharsNeeded ? randomCharsNeeded : prev,
      );
      setSplitIndex((prev) => {
        const next = Math.max(0, Math.min(splitIndexValue, randomCharsNeeded));
        return next !== prev ? next : prev;
      });
    };

    const onResize = () => updateLayout();
    const onFontsLoadingDone = () => updateLayout();

    updateLayout();
    window.addEventListener("resize", onResize);
    document.fonts?.addEventListener?.("loadingdone", onFontsLoadingDone);
    document.fonts?.ready?.then(updateLayout).catch(() => {});

    return () => {
      window.removeEventListener("resize", onResize);
      document.fonts?.removeEventListener?.("loadingdone", onFontsLoadingDone);
    };
  }, [showTextLength]);

  return (
    <div className="w-screen h-screen bg-slate-800 text-9xl text-white uppercase text-wrap relative">
      {/* Single overlay frame using inset box-shadow */}
      <div
        className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_0_4rem_rgba(30,41,59,0.8)]"
        aria-hidden
      />

      {/* Content wrapper: measured for split calculation */}
      <div ref={contentRef} className="absolute inset-8 overflow-hidden">
        {/* Hidden span to measure single character width (same font as content) */}
        <span
          ref={measureCharRef}
          className="absolute opacity-0 pointer-events-none"
          aria-hidden
        >
          a
        </span>

        <p className="uppercase leading-none wrap-anywhere">{characterSpans}</p>
      </div>
    </div>
  );
}

export default App;
