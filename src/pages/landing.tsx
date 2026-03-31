const LandingPage = () => {
  return (
    <main class="relative min-h-screen bg-surface text-slate-100 overflow-hidden noise-bg grid-bg">
      {/* Decorative orbs */}
      <div class="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-lime-glow opacity-[0.4] blur-[120px]" />
      <div class="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400 opacity-[0.3] blur-[120px]" />

      <div class="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        {/* ─── Hero ─── */}
        <section class="animate-slide-up space-y-6">
          <div class="flex items-center gap-3">
            <span class="inline-block rounded-full border border-border bg-card px-3 py-1 font-mono text-xs tracking-widest text-lime-glow uppercase">
              wall-html
            </span>
          </div>

          <h1 class="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            <span class="block">Text walls</span>
            <span class="block bg-linear-to-r from-lime-glow to-emerald-400 bg-clip-text text-transparent animate-gradient">
              as images
            </span>
          </h1>

          <p class="max-w-xl font-mono text-sm leading-7 text-slate-400 sm:text-base">
            Turn any text into a bold, typographic screenshot. Set dimensions,
            tweak spacing, hit the button — get a PNG back instantly.
          </p>
        </section>

        <div class="grid gap-6 lg:grid-cols-5">
          {/* ─── How it works ─── */}
          <div class="animate-slide-up-2 lg:col-span-2 space-y-4">
            <h2 class="font-display text-lg font-bold tracking-tight text-slate-300 uppercase">
              How it works
            </h2>
            <div class="space-y-2">
              {[
                {
                  n: "01",
                  title: "Set dimensions",
                  desc: "1080×1920 for stories, 1200×630 for social cards — your call.",
                },
                {
                  n: "02",
                  title: "Drop in your text",
                  desc: "It becomes the giant typographic content filling the frame.",
                },
                {
                  n: "03",
                  title: "Toggle the vibes",
                  desc: "Randomize letter spacing, allow cut-off text for that raw, graphic look.",
                },
                {
                  n: "04",
                  title: "Get your PNG",
                  desc: "The API renders it in a real browser and hands you a screenshot.",
                },
              ].map((step) => (
                <div class="step-card group flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <span class="font-display text-2xl font-black text-lime-glow opacity-40 group-hover:opacity-100 transition-opacity">
                    {step.n}
                  </span>
                  <div>
                    <p class="font-mono text-sm font-bold text-slate-200">
                      {step.title}
                    </p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Endpoints reference ─── */}
            <div class="mt-2 space-y-2 rounded-2xl border border-border bg-card p-4">
              <h3 class="font-display text-xs font-bold tracking-widest text-slate-500 uppercase">
                Endpoints
              </h3>
              <div class="space-y-2 font-mono text-xs">
                <div class="rounded-xl bg-surface p-3 border border-border">
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      GET
                    </span>
                    <span class="text-slate-300">/screenshot-rest-url</span>
                  </div>
                  <p class="mt-1.5 text-[11px] leading-4 text-slate-500">
                    Renders via Cloudflare Browser Rendering REST API. Returns a
                    PNG screenshot of the text wall.
                  </p>
                </div>
                <div class="rounded-xl bg-surface p-3 border border-border">
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      GET
                    </span>
                    <span class="text-slate-300">/text-background</span>
                  </div>
                  <p class="mt-1.5 text-[11px] leading-4 text-slate-500">
                    Returns the raw HTML page with the typographic text wall —
                    no screenshot, just the rendered page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Builder form ─── */}
          <section class="animate-slide-up-3 lg:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div class="space-y-6">
              <div class="space-y-1">
                <h2 class="font-display text-2xl font-black tracking-tight sm:text-3xl">
                  Build a request
                </h2>
                <p class="font-mono text-xs text-slate-500">
                  configure → generate → download your png
                </p>
              </div>

              <form
                action="/screenshot-rest-url"
                class="space-y-5"
                method="get"
                target="_blank"
              >
                {/* Dimensions */}
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="space-y-1.5">
                    <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Width
                    </span>
                    <input
                      class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow"
                      min="1"
                      name="width"
                      placeholder="1080"
                      required
                      type="number"
                      value="1080"
                    />
                  </label>
                  <label class="space-y-1.5">
                    <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Height
                    </span>
                    <input
                      class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow"
                      min="1"
                      name="height"
                      placeholder="1920"
                      required
                      type="number"
                      value="1920"
                    />
                  </label>
                </div>

                {/* Display text */}
                <label class="block space-y-1.5">
                  <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Display text
                  </span>
                  <input
                    class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow"
                    name="displayText"
                    placeholder="your text goes here..."
                    required
                    type="text"
                    value="This is a test of the text background generator"
                  />
                </label>

                {/* Toggles */}
                <div class="grid gap-4 sm:grid-cols-2">
                  <fieldset class="space-y-2">
                    <legend class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Random spacing
                    </legend>
                    <div class="space-y-2">
                      <label class="step-card flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          checked
                          class="accent-lime-glow"
                          name="randomTextToggle"
                          type="radio"
                          value="true"
                        />
                        <span>Fill gaps with random chars</span>
                      </label>
                      <label class="step-card flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          class="accent-lime-glow"
                          name="randomTextToggle"
                          type="radio"
                          value="false"
                        />
                        <span>Keep normal spacing</span>
                      </label>
                    </div>
                  </fieldset>

                  <fieldset class="space-y-2">
                    <legend class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Cut-off text
                    </legend>
                    <div class="space-y-2">
                      <label class="step-card flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          checked
                          class="accent-lime-glow"
                          name="cutOffTextToggle"
                          type="radio"
                          value="true"
                        />
                        <span>Allow cut-off edges</span>
                      </label>
                      <label class="step-card flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          class="accent-lime-glow"
                          name="cutOffTextToggle"
                          type="radio"
                          value="false"
                        />
                        <span>Keep contained</span>
                      </label>
                    </div>
                  </fieldset>
                </div>

                {/* Submit */}
                <div class="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p class="font-mono text-[11px] leading-5 text-slate-600">
                    Opens in a new tab as a PNG image.
                  </p>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <button
                      class="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-bold text-surface tracking-wide cursor-pointer"
                      type="submit"
                    >
                      <span>Generate screenshot</span>
                      <span class="text-base">→</span>
                    </button>
                    <button
                      class="btn-outline inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-mono text-xs text-slate-400 hover:text-lime-glow hover:border-lime-glow/30 cursor-pointer"
                      formAction="/text-background"
                      type="submit"
                    >
                      Preview HTML
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* ─── Footer ─── */}
        <footer class="animate-slide-up-4 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-slate-600">
          <span>built on cloudflare workers</span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            api online
          </span>
        </footer>
      </div>
    </main>
  );
};

export default LandingPage;
