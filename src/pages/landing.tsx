const LandingPage = () => {
  return (
    <main class="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-16">
      <div class="mx-auto flex max-w-6xl flex-col gap-8">
        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 sm:p-8 space-y-5">

          <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-300">
            Screenshot API
          </p>
          <div class="space-y-3">
            <h1 class="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Generate image screenshots from simple query parameters
            </h1>
            <p class="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Use the <code class="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">/screenshot</code>{" "}
              endpoint for the original browser-binding flow, or <code class="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">/screenshot-rest-url</code>{" "}
              for Cloudflare Browser Rendering REST URL mode. Choose the width,
              height, text, and toggle options below, then open either request
              in a new tab.
            </p>

          </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-2">
          <div class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">

            <div class="space-y-2">
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                How to use the API
              </h2>
              <p class="text-sm leading-7 text-slate-300 sm:text-base">
                Build a GET request to the screenshot endpoint with the query
                parameters below. Both services render the background page at
                your chosen dimensions and return a PNG so you can compare the
                results side by side.
              </p>
            </div>

            <ol class="space-y-4">
              <li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p class="text-sm font-semibold text-slate-100">
                  1. Pick the image dimensions
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  Use width and height values that match your target format,
                  such as 1080x1920 for stories or 1200x630 for social cards.
                </p>
              </li>
              <li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p class="text-sm font-semibold text-slate-100">
                  2. Provide the display text
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  The text becomes the content rendered into the background
                  before the screenshot is taken.
                </p>
              </li>
              <li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p class="text-sm font-semibold text-slate-100">
                  3. Choose the toggle behavior
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  Select whether to randomize the text layout and whether the
                  text can be cut off for a more graphic look.
                </p>
              </li>
              <li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p class="text-sm font-semibold text-slate-100">
                  4. Open either screenshot flow
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  Use the original browser-binding route or the new REST URL
                  route to compare output and performance in parallel.
                </p>
              </li>
            </ol>

          </div>

          <section class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Build a screenshot request
                </h2>
                <p class="text-sm leading-7 text-slate-300 sm:text-base">
                  Enter the query values you want to send. Each button opens a
                  different screenshot flow in a new browser tab.
                </p>
              </div>

              <form
                action="/screenshot"
                class="space-y-5"
                method="get"
                target="_blank"
              >
                <div class="grid gap-4 sm:grid-cols-2">
                  <label class="space-y-2">
                    <span class="text-sm font-medium text-slate-200">Width</span>
                    <input
                      class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
                      min="1"
                      name="width"
                      placeholder="1080"
                      required
                      type="number"
                      value="1080"
                    />
                  </label>

                  <label class="space-y-2">
                    <span class="text-sm font-medium text-slate-200">Height</span>
                    <input
                      class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
                      min="1"
                      name="height"
                      placeholder="1920"
                      required
                      type="number"
                      value="1920"
                    />
                  </label>
                </div>

                <label class="block space-y-2">
                  <span class="text-sm font-medium text-slate-200">
                    Display text
                  </span>
                  <input
                    class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
                    name="displayText"
                    placeholder="Launch campaign creative"
                    required
                    type="text"
                    value="This is a test of the text background generator"
                  />
                </label>

                <fieldset class="space-y-3">
                  <legend class="text-sm font-medium text-slate-200">
                    Random text spacing
                  </legend>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        checked
                        name="randomTextToggle"
                        type="radio"
                        value="true"
                      />
                      Enable spacing with random characters
                    </label>
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        name="randomTextToggle"
                        type="radio"
                        value="false"
                      />
                      Keep normal spacing
                    </label>
                  </div>
                </fieldset>

                <fieldset class="space-y-3">
                  <legend class="text-sm font-medium text-slate-200">
                    Allow cut off text
                  </legend>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        checked
                        name="cutOffTextToggle"
                        type="radio"
                        value="true"
                      />
                      Yes, allow cut off
                    </label>
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        name="cutOffTextToggle"
                        type="radio"
                        value="false"
                      />
                      No, keep it contained
                    </label>
                  </div>
                </fieldset>

                <div class="flex flex-col gap-3 border-t border-slate-800 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p class="text-sm leading-6 text-slate-400">
                    Open the original browser-binding route or the new REST URL
                    route to compare generated PNGs directly.
                  </p>
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <button
                      class="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                      type="submit"
                    >
                      Open /screenshot
                    </button>
                    <button
                      class="inline-flex items-center justify-center rounded-full border border-sky-400 px-5 py-3 text-sm font-semibold text-sky-300 transition hover:border-sky-300 hover:text-sky-200"
                      formAction="/screenshot-rest-url"
                      type="submit"
                    >
                      Open /screenshot-rest-url
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
