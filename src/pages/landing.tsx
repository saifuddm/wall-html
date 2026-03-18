const LandingPage = () => {
  return (
    <main class="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-16">
      <div class="mx-auto flex max-w-6xl flex-col gap-8">
        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
          <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div class="space-y-5">
              <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-300">
                Screenshot API
              </p>
              <div class="space-y-3">
                <h1 class="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  Generate image screenshots from simple query parameters
                </h1>
                <p class="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Use the <code class="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">/screenshot</code>{" "}
                  endpoint to render a text background and receive a PNG in
                  response. Choose the width, height, text, and toggle options
                  below, then open the generated request in a new tab.
                </p>
              </div>

              <div class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p class="text-sm text-slate-400">Method</p>
                  <p class="mt-2 text-lg font-semibold text-slate-50">GET</p>
                </div>
                <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p class="text-sm text-slate-400">Response</p>
                  <p class="mt-2 text-lg font-semibold text-slate-50">PNG image</p>
                </div>
                <div class="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p class="text-sm text-slate-400">Best for</p>
                  <p class="mt-2 text-lg font-semibold text-slate-50">
                    Social, wallpaper, demo assets
                  </p>
                </div>
              </div>
            </div>

            <aside class="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <p class="text-sm font-medium text-slate-200">Quick example</p>
              <pre class="mt-4 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-sky-200 sm:text-sm">
                <code>
                  {`/screenshot?width=1080&height=1920&displayText=Hello%20world&randomTextToggle=true&cutOffTextToggle=false`}
                </code>
              </pre>
              <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>
                  <span class="font-semibold text-slate-100">width</span> and{" "}
                  <span class="font-semibold text-slate-100">height</span>{" "}
                  control the screenshot size.
                </li>
                <li>
                  <span class="font-semibold text-slate-100">displayText</span>{" "}
                  sets the visible text rendered in the background.
                </li>
                <li>
                  <span class="font-semibold text-slate-100">
                    randomTextToggle
                  </span>{" "}
                  and{" "}
                  <span class="font-semibold text-slate-100">
                    cutOffTextToggle
                  </span>{" "}
                  accept <code>true</code> or <code>false</code>.
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  How to use the API
                </h2>
                <p class="text-sm leading-7 text-slate-300 sm:text-base">
                  Build a GET request to the screenshot endpoint with the query
                  parameters below. The service renders a background page, takes
                  a screenshot at your chosen dimensions, and returns a PNG.
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
              </ol>

              <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                <p class="font-semibold text-slate-100">Query parameters</p>
                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <div class="rounded-xl border border-slate-800 p-3">
                    <p class="font-medium text-slate-100">width</p>
                    <p>Number of pixels for the output width.</p>
                  </div>
                  <div class="rounded-xl border border-slate-800 p-3">
                    <p class="font-medium text-slate-100">height</p>
                    <p>Number of pixels for the output height.</p>
                  </div>
                  <div class="rounded-xl border border-slate-800 p-3">
                    <p class="font-medium text-slate-100">displayText</p>
                    <p>Text that appears in the rendered background.</p>
                  </div>
                  <div class="rounded-xl border border-slate-800 p-3">
                    <p class="font-medium text-slate-100">randomTextToggle</p>
                    <p>Boolean flag for random text layout behavior.</p>
                  </div>
                  <div class="rounded-xl border border-slate-800 p-3 sm:col-span-2">
                    <p class="font-medium text-slate-100">cutOffTextToggle</p>
                    <p>Boolean flag that allows the rendered text to be cut off.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Build a screenshot request
                </h2>
                <p class="text-sm leading-7 text-slate-300 sm:text-base">
                  Enter the query values you want to send. Submitting this form
                  opens the screenshot endpoint in a new browser tab.
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
                    Random text layout
                  </legend>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        checked
                        name="randomTextToggle"
                        type="radio"
                        value="true"
                      />
                      Enable randomization
                    </label>
                    <label class="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                      <input
                        name="randomTextToggle"
                        type="radio"
                        value="false"
                      />
                      Keep text uniform
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
                    The request opens in a new tab so you can view or save the
                    generated PNG directly.
                  </p>
                  <button
                    class="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                    type="submit"
                  >
                    Open screenshot URL
                  </button>
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
