import { useMemo } from "react";

function App() {
  const SHOW_TEXT = "Hello,world!";
  // random characters from a to z generator
  const randomCharacters = useMemo(() => {
    return Array.from({ length: 3500 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    ).join("");
  }, []);

  return (
    <div
      className="w-screen h-screen bg-slate-800 text-9xl text-white uppercase text-wrap text-center py-5 relative
    "
    >
      {/* Single overlay frame using inset box-shadow */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-lg shadow-[inset_0_0_0_4rem_rgba(30,41,59,0.8)]"
        aria-hidden
      />

      {/* Main content - padded so text sits inside the frame */}
      <p className="opacity-25 w-full wrap-anywhere absolute inset-0 overflow-hidden p-5 box-border uppercase">
        {randomCharacters}
      </p>
    </div>
  );
}

export default App;
