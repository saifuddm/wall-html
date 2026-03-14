import { useMemo } from "react";
import { WallpaperRenderer } from "./components/WallpaperRenderer";
import { getRenderParams } from "./utils/urlParams";

function App() {
  const { showText, renderWidth, renderHeight, spaceWithRandomCharacters } =
    useMemo(() => getRenderParams(window.location.search), []);

  return (
    <WallpaperRenderer
      text={showText}
      renderWidth={renderWidth}
      renderHeight={renderHeight}
      spaceWithRandomCharacters={spaceWithRandomCharacters}
    />
  );
}

export default App;
