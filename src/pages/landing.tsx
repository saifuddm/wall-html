const LandingPage = () => {
  return (
    <main class="relative min-h-screen bg-surface text-slate-100 overflow-hidden noise-bg grid-bg">
      {/* Decorative orbs */}
      <div class="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-lime-glow opacity-[0.4] blur-[120px]" />
      <div class="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400 opacity-[0.3] blur-[120px]" />

      <div class="relative z-10 mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        {/* ─── Hero ─── */}
        <section class="lcp-visible space-y-6" id="hero-section">
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

        <div class="grid gap-6 lg:grid-cols-5" id="main-grid">
          {/* ─── How it works ─── */}
          <div class="animate-slide-up-2 lg:col-span-2 space-y-4" id="info-column">
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
                  title: "Tune the layout",
                  desc: "Space out letters or words, push text onto new lines — live preview as you go.",
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
          <section
            class="animate-slide-up-3 lg:col-span-3 min-w-0 rounded-3xl border border-border bg-card p-6 sm:p-8"
            id="builder-section"
          >
            <div class="space-y-6">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <h2 class="font-display text-2xl font-black tracking-tight sm:text-3xl">
                    Build a request
                  </h2>
                  <p class="font-mono text-xs text-slate-500">
                    configure → tune layout → generate your png
                  </p>
                </div>
                <button
                  class="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-slate-400 hover:text-lime-glow hover:border-lime-glow/30 cursor-pointer"
                  id="editor-exit"
                  type="button"
                >
                  ← back to setup
                </button>
              </div>

              <form class="space-y-5" id="builder-form">
                {/* Quick size presets */}
                <div class="space-y-1.5" id="presets-block">
                  <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Quick sizes
                  </span>
                  <div class="flex gap-2 overflow-x-auto pt-2 pb-2 scrollbar-thin">
                    {[
                      { icon: "smartphone", label: "Story", w: 1080, h: 1920 },
                      { icon: "square", label: "Square", w: 1080, h: 1080 },
                      { icon: "monitor", label: "Desktop", w: 1920, h: 1080 },
                      { icon: "tablet", label: "Tablet", w: 1668, h: 2388 },
                      { icon: "share-2", label: "Social Card", w: 1200, h: 630 },
                      { icon: "play", label: "YouTube", w: 1280, h: 720 },
                      { icon: "image", label: "Banner", w: 1500, h: 500 },
                    ].map((preset) => (
                      <button
                        type="button"
                        class="preset-btn step-card group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 cursor-pointer transition-all hover:border-lime-glow/40 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                        data-w={preset.w}
                        data-h={preset.h}
                      >
                        <i data-lucide={preset.icon} class="h-5 w-5 text-slate-500 group-hover:text-lime-glow transition-colors" />
                        <span class="font-mono text-[11px] font-bold text-slate-300 group-hover:text-lime-glow transition-colors whitespace-nowrap">
                          {preset.label}
                        </span>
                        <span class="font-mono text-[10px] text-slate-600">
                          {preset.w}×{preset.h}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div class="grid gap-4 sm:grid-cols-2" id="dimensions-block">
                  <label class="space-y-1.5">
                    <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      Width
                    </span>
                    <input
                      class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow disabled:opacity-40"
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
                      class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow disabled:opacity-40"
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
                  <textarea
                    class="input-glow w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-glow resize-y"
                    name="displayText"
                    placeholder="your text goes here..."
                    required
                    rows={3}
                  >
                    This is a test of the text background generator
                  </textarea>
                </label>

                {/* Toggles */}
                <div class="grid gap-4 sm:grid-cols-2" id="toggles-block">
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

                {/* Enter editor */}
                <div
                  class="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
                  id="editor-enter-row"
                >
                  <p class="font-mono text-[11px] leading-5 text-slate-600">
                    Tune the layout live, then generate your screenshot.
                  </p>
                  <button
                    class="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-bold text-surface tracking-wide cursor-pointer"
                    id="editor-enter"
                    type="button"
                  >
                    <span>Edit layout</span>
                    <span class="text-base">→</span>
                  </button>
                </div>

                {/* ─── Layout editor (hidden until entered) ─── */}
                <div class="hidden space-y-4 border-t border-border pt-5" id="editor-section">
                  {/* Token controls */}
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Select &amp; move
                      </span>
                      <div class="flex rounded-full border border-border bg-surface p-0.5 font-mono text-[11px]">
                        <button
                          class="mode-btn rounded-full px-3 py-1 cursor-pointer text-slate-400"
                          data-mode="word"
                          type="button"
                        >
                          Word
                        </button>
                        <button
                          class="mode-btn rounded-full px-3 py-1 cursor-pointer text-slate-400"
                          data-mode="letter"
                          type="button"
                        >
                          Letter
                        </button>
                      </div>
                    </div>

                    <div
                      class="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-3 min-h-12"
                      id="token-strip"
                    />

                    <div class="flex flex-wrap gap-2 font-mono text-[11px]">
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="space-before" type="button">
                        + space before
                      </button>
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="space-after" type="button">
                        + space after
                      </button>
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="unspace-before" type="button">
                        − space before
                      </button>
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="unspace-after" type="button">
                        − space after
                      </button>
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="newline-before" type="button">
                        ↵ line before
                      </button>
                      <button class="editor-action rounded-full border border-border bg-surface px-3 py-1.5 text-slate-300 hover:border-lime-glow/40 hover:text-lime-glow cursor-pointer disabled:opacity-40 disabled:pointer-events-none" data-action="newline-after" type="button">
                        ↵ line after
                      </button>
                    </div>
                  </div>

                  {/* Live preview */}
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Live preview
                      </span>
                      <button
                        class="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-slate-400 hover:text-lime-glow hover:border-lime-glow/30 cursor-pointer"
                        id="seed-reroll"
                        title="Re-roll the random filler letters"
                        type="button"
                      >
                        <i data-lucide="shuffle" class="h-3 w-3" />
                        <span>shuffle filler</span>
                      </button>
                    </div>
                    <div class="flex justify-center rounded-xl border border-border bg-surface p-3">
                      <div class="overflow-hidden" id="preview-wrapper">
                        <iframe class="border-none block" id="preview-iframe" />
                      </div>
                    </div>
                    <div class="flex items-center justify-between gap-3">
                      <span
                        class="rounded-full bg-surface px-3 py-1 font-mono text-xs text-slate-500"
                        id="preview-dimensions"
                      />
                      <div class="flex items-center gap-2">
                        <a
                          class="btn-outline inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-slate-400 hover:text-lime-glow hover:border-lime-glow/30 no-underline"
                          id="preview-open-tab"
                          href="#"
                          target="_blank"
                        >
                          Open in tab
                        </a>
                        <a
                          class="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[11px] font-bold text-surface no-underline cursor-pointer"
                          id="preview-screenshot"
                          href="#"
                          target="_blank"
                        >
                          Generate Screenshot
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* ─── Footer ─── */}
        <footer class="animate-slide-up-4 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-slate-600">
          <a href="https://github.com/saifuddm" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-lime-glow transition-colors no-underline">@saifuddm</a>
          <span class="flex items-center gap-1.5">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-glow" />
            api online
          </span>
        </footer>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  // Initialize Lucide icons
  function initLucide() {
    if (window.lucide) { lucide.createIcons(); return; }
    var check = setInterval(function() { if (window.lucide) { lucide.createIcons(); clearInterval(check); } }, 100);
    setTimeout(function() { clearInterval(check); }, 3000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLucide);
  } else {
    requestAnimationFrame(initLucide);
  }

  // Preset size buttons
  var presetBtns = document.querySelectorAll('.preset-btn');
  var widthInput = document.querySelector('input[name="width"]');
  var heightInput = document.querySelector('input[name="height"]');

  function syncPresetHighlight() {
    var w = widthInput.value;
    var h = heightInput.value;
    presetBtns.forEach(function(btn) {
      if (btn.dataset.w === w && btn.dataset.h === h) {
        btn.classList.add('preset-active');
      } else {
        btn.classList.remove('preset-active');
      }
    });
  }

  presetBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      widthInput.value = btn.dataset.w;
      heightInput.value = btn.dataset.h;
      syncPresetHighlight();
    });
  });

  widthInput.addEventListener('input', syncPresetHighlight);
  heightInput.addEventListener('input', syncPresetHighlight);
  requestAnimationFrame(syncPresetHighlight);

  // ─── Layout editor ───
  var form = document.getElementById('builder-form');
  var textarea = form.querySelector('textarea[name="displayText"]');
  var heroSection = document.getElementById('hero-section');
  var infoColumn = document.getElementById('info-column');
  var mainGrid = document.getElementById('main-grid');
  var builderSection = document.getElementById('builder-section');
  var enterRow = document.getElementById('editor-enter-row');
  var enterBtn = document.getElementById('editor-enter');
  var exitBtn = document.getElementById('editor-exit');
  var editorSection = document.getElementById('editor-section');
  var tokenStrip = document.getElementById('token-strip');
  var modeBtns = document.querySelectorAll('.mode-btn');
  var actionBtns = document.querySelectorAll('.editor-action');
  var iframe = document.getElementById('preview-iframe');
  var wrapper = document.getElementById('preview-wrapper');
  var dimLabel = document.getElementById('preview-dimensions');
  var openTab = document.getElementById('preview-open-tab');
  var screenshotBtn = document.getElementById('preview-screenshot');
  var rerollBtn = document.getElementById('seed-reroll');

  // The SSR textarea content is indented by JSX; normalize it once.
  textarea.value = textarea.value.trim();

  var seed = Math.random().toString(36).slice(2, 10);
  var mode = 'word';
  var selectedOrdinal = null;
  var editing = false;
  var debounceTimer = null;
  var graphemeSegmenter = window.Intl && Intl.Segmenter
    ? new Intl.Segmenter('en', { granularity: 'grapheme' })
    : null;

  function buildParams() {
    var formData = new FormData(form);
    var params = new URLSearchParams(formData);
    // Disabled inputs are excluded from FormData, so set dimensions explicitly.
    params.set('width', widthInput.value);
    params.set('height', heightInput.value);
    params.set('seed', seed);
    return params;
  }

  function updatePreview() {
    var params = buildParams();
    var previewUrl = '/text-background?' + params.toString();
    var screenshotUrl = '/screenshot-rest-url?' + params.toString();

    var w = parseInt(widthInput.value) || 1080;
    var h = parseInt(heightInput.value) || 1920;

    var maxW = Math.min(builderSection.clientWidth - 80, 640);
    var maxH = Math.round(window.innerHeight * 0.55);
    var scale = Math.min(maxW / w, maxH / h, 1);

    iframe.style.width = w + 'px';
    iframe.style.height = h + 'px';
    iframe.style.transform = 'scale(' + scale + ')';
    iframe.style.transformOrigin = 'top left';
    wrapper.style.width = Math.round(w * scale) + 'px';
    wrapper.style.height = Math.round(h * scale) + 'px';

    dimLabel.textContent = w + ' \\u00d7 ' + h + ' (scaled ' + Math.round(scale * 100) + '%)';
    openTab.href = previewUrl;
    screenshotBtn.href = screenshotUrl;
    if (iframe.dataset.src !== previewUrl) {
      iframe.dataset.src = previewUrl;
      iframe.src = previewUrl;
    }
  }

  function schedulePreview() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePreview, 400);
  }

  // Tokenize the textarea value into selectable tokens with string offsets.
  function getTokens() {
    var text = textarea.value;
    var tokens = [];
    if (mode === 'word') {
      var re = /\\S+/g;
      var m;
      while ((m = re.exec(text)) !== null) {
        tokens.push({ text: m[0], start: m.index, end: m.index + m[0].length });
      }
    } else if (graphemeSegmenter) {
      var segments = graphemeSegmenter.segment(text);
      var iter = segments[Symbol.iterator]();
      var step;
      while (!(step = iter.next()).done) {
        var seg = step.value;
        if (seg.segment.trim() === '') continue;
        tokens.push({ text: seg.segment, start: seg.index, end: seg.index + seg.segment.length });
      }
    }
    return tokens;
  }

  // Render the gap between tokens as dim markers: one dot per extra space,
  // one return arrow per newline.
  function gapMarker(gapText, minSpaces) {
    var spaces = (gapText.match(/ /g) || []).length;
    var newlines = (gapText.match(/\\n/g) || []).length;
    var label = '';
    for (var i = 0; i < newlines; i++) label += '\\u21B5';
    for (var j = 0; j < spaces - minSpaces; j++) label += '\\u00B7';
    if (!label) return null;
    var el = document.createElement('span');
    el.className = 'font-mono text-xs text-lime-glow/70 tracking-widest';
    el.textContent = label;
    return el;
  }

  function buildChips() {
    var text = textarea.value;
    var tokens = getTokens();
    tokenStrip.textContent = '';
    if (selectedOrdinal !== null && selectedOrdinal >= tokens.length) {
      selectedOrdinal = tokens.length ? tokens.length - 1 : null;
    }
    var betweenMin = mode === 'word' ? 1 : 0;
    var prevEnd = 0;
    tokens.forEach(function(token, i) {
      // Edge gaps have no implicit separator, so every space there counts.
      var marker = gapMarker(text.slice(prevEnd, token.start), i === 0 ? 0 : betweenMin);
      if (marker) tokenStrip.appendChild(marker);
      prevEnd = token.end;

      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'rounded-lg border px-2 py-1 font-mono text-xs uppercase cursor-pointer transition-colors ' +
        (i === selectedOrdinal
          ? 'border-lime-glow text-lime-glow bg-lime-glow/10'
          : 'border-border text-slate-300 hover:border-lime-glow/40');
      chip.textContent = token.text;
      chip.addEventListener('click', function() {
        selectedOrdinal = i === selectedOrdinal ? null : i;
        buildChips();
      });
      tokenStrip.appendChild(chip);
    });
    var trailing = gapMarker(text.slice(prevEnd), 0);
    if (trailing) tokenStrip.appendChild(trailing);

    var hasSelection = selectedOrdinal !== null;
    actionBtns.forEach(function(btn) { btn.disabled = !hasSelection; });
  }

  function applyAction(action) {
    if (selectedOrdinal === null) return;
    var tokens = getTokens();
    var token = tokens[selectedOrdinal];
    if (!token) return;
    var text = textarea.value;

    if (action === 'space-before') {
      text = text.slice(0, token.start) + ' ' + text.slice(token.start);
    } else if (action === 'space-after') {
      text = text.slice(0, token.end) + ' ' + text.slice(token.end);
    } else if (action === 'unspace-before') {
      if (text[token.start - 1] === ' ') {
        text = text.slice(0, token.start - 1) + text.slice(token.start);
      }
    } else if (action === 'unspace-after') {
      if (text[token.end] === ' ') {
        text = text.slice(0, token.end) + text.slice(token.end + 1);
      }
    } else if (action === 'newline-before') {
      text = text.slice(0, token.start) + '\\n' + text.slice(token.start);
    } else if (action === 'newline-after') {
      text = text.slice(0, token.end) + '\\n' + text.slice(token.end);
    }

    textarea.value = text;
    buildChips();
    schedulePreview();
  }

  function syncModeButtons() {
    modeBtns.forEach(function(btn) {
      if (btn.dataset.mode === mode) {
        btn.classList.add('bg-lime-glow/15', 'text-lime-glow');
        btn.classList.remove('text-slate-400');
      } else {
        btn.classList.remove('bg-lime-glow/15', 'text-lime-glow');
        btn.classList.add('text-slate-400');
      }
    });
  }

  function setDimensionsLocked(locked) {
    widthInput.disabled = locked;
    heightInput.disabled = locked;
    presetBtns.forEach(function(btn) { btn.disabled = locked; });
  }

  function enterEditor() {
    if (editing) return;
    editing = true;
    heroSection.classList.add('hidden');
    infoColumn.classList.add('hidden');
    mainGrid.classList.remove('lg:grid-cols-5');
    builderSection.classList.remove('lg:col-span-3');
    enterRow.classList.add('hidden');
    editorSection.classList.remove('hidden');
    exitBtn.classList.remove('hidden');
    exitBtn.classList.add('inline-flex');
    setDimensionsLocked(true);
    selectedOrdinal = null;
    syncModeButtons();
    buildChips();
    updatePreview();
  }

  function exitEditor() {
    if (!editing) return;
    editing = false;
    heroSection.classList.remove('hidden');
    infoColumn.classList.remove('hidden');
    mainGrid.classList.add('lg:grid-cols-5');
    builderSection.classList.add('lg:col-span-3');
    enterRow.classList.remove('hidden');
    editorSection.classList.add('hidden');
    exitBtn.classList.add('hidden');
    exitBtn.classList.remove('inline-flex');
    setDimensionsLocked(false);
    iframe.src = 'about:blank';
    iframe.dataset.src = '';
  }

  enterBtn.addEventListener('click', enterEditor);
  exitBtn.addEventListener('click', exitEditor);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.activeElement !== textarea) exitEditor();
  });

  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      mode = btn.dataset.mode;
      selectedOrdinal = null;
      syncModeButtons();
      buildChips();
    });
  });

  actionBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { applyAction(btn.dataset.action); });
  });

  textarea.addEventListener('input', function() {
    if (!editing) return;
    buildChips();
    schedulePreview();
  });

  form.querySelectorAll('input[type="radio"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      if (editing) schedulePreview();
    });
  });

  rerollBtn.addEventListener('click', function() {
    seed = Math.random().toString(36).slice(2, 10);
    updatePreview();
  });

  window.addEventListener('resize', function() {
    if (editing) schedulePreview();
  });
})();
      `,
        }}
      />
    </main>
  );
};

export default LandingPage;
