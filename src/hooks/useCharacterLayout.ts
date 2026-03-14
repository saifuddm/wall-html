import { useLayoutEffect, useRef, useState } from "react";
import { calculateCharacterLayout } from "../utils/layout";

export type CharacterLayoutState = {
  splitIndex: number;
  characterCount: number;
};

export function useCharacterLayout(showTextLength: number) {
  const contentRef = useRef<HTMLDivElement>(null);
  const measureCharRef = useRef<HTMLSpanElement>(null);
  const [layoutState, setLayoutState] = useState<CharacterLayoutState>({
    splitIndex: 0,
    characterCount: 0,
  });

  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!contentRef.current || !measureCharRef.current) return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const charRect = measureCharRef.current.getBoundingClientRect();
      const layout = calculateCharacterLayout(
        contentRect.width,
        contentRect.height,
        charRect.width,
        charRect.height,
        showTextLength,
      );
      if (!layout) return;

      const nextCharacterCount = layout.randomCharactersNeeded;
      const nextSplitIndex = Math.max(
        0,
        Math.min(layout.splitIndex, layout.randomCharactersNeeded),
      );

      setLayoutState((prev) => {
        if (
          prev.characterCount === nextCharacterCount &&
          prev.splitIndex === nextSplitIndex
        ) {
          return prev;
        }

        return {
          characterCount: nextCharacterCount,
          splitIndex: nextSplitIndex,
        };
      });
    };

    let rafId: number | null = null;
    const scheduleLayoutUpdate = () => {
      // Coalesce bursts of resize/font events into one layout pass.
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateLayout();
      });
    };

    const onResize = () => scheduleLayoutUpdate();
    const onFontsLoadingDone = () => scheduleLayoutUpdate();

    scheduleLayoutUpdate();
    window.addEventListener("resize", onResize);
    document.fonts?.addEventListener?.("loadingdone", onFontsLoadingDone);
    document.fonts?.ready?.then(scheduleLayoutUpdate).catch(() => {});

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", onResize);
      document.fonts?.removeEventListener?.("loadingdone", onFontsLoadingDone);
    };
  }, [showTextLength]);

  return { contentRef, measureCharRef, layoutState };
}
