import { createRoot } from "react-dom/client";
import { WallpaperRenderer } from "./components/WallpaperRenderer";
import "./index.css";
import { getRenderParams } from "./utils/urlParams";

type WallpaperWindow = Window & {
  __wallpaperReady?: boolean;
};

const wallpaperWindow = window as WallpaperWindow;
wallpaperWindow.__wallpaperReady = false;

const { showText, renderWidth, renderHeight, spaceWithRandomCharacters } =
  getRenderParams(window.location.search);

const markReady = () => {
  wallpaperWindow.__wallpaperReady = true;
};

createRoot(document.getElementById("root")!).render(
  <WallpaperRenderer
    text={showText}
    renderWidth={renderWidth}
    renderHeight={renderHeight}
    spaceWithRandomCharacters={spaceWithRandomCharacters}
    onReady={markReady}
  />,
);
