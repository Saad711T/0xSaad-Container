/* ============================================================
   Video wallpaper.
   Loads a different .mp4 per theme, and swaps it whenever the
   user cycles the theme.

     Theme "black"  →  assets/blackvideo.mp4
     Theme "blue"   →  assets/bluevideo.mp4
     Theme "beige"  →  assets/beigevideo.mp4

   Emergency fallback: if the theme-specific file is missing OR
   fails to load for any reason, the browser falls through to
   assets/wallpaper.mp4.  That file is the safety net — always
   keep it in place.  If both are missing, the theme's solid
   background color shows through.
   ============================================================ */
(function () {
  const video = document.getElementById("wallpaper-video");
  if (!video) return;

  // Resolve path relative to current page (posts/*.html sit one level deeper).
  const BASE = location.pathname.includes("/posts/") ? "../" : "";

  // Ensure autoplay-friendly attributes are set even if the HTML omits them.
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("muted", "");

  const tint = document.createElement("div");
  tint.className = "wallpaper-tint";
  video.after(tint);

  const themedPath   = (theme) => `${BASE}assets/${theme}video.mp4`;
  const FALLBACK_PATH = `${BASE}assets/wallpaper.mp4`;

  function loadForTheme(theme) {
    // Fade out — the .ready class controls opacity via a CSS transition.
    video.classList.remove("ready");

    // Reset <source> list. Browser tries them in order, falling to the
    // next one whenever the previous fails to load.
    while (video.firstChild) video.removeChild(video.firstChild);

    const primary = document.createElement("source");
    primary.src = themedPath(theme);
    primary.type = "video/mp4";
    video.appendChild(primary);

    const fallback = document.createElement("source");
    fallback.src = FALLBACK_PATH;   // ← the emergency file, always tried last
    fallback.type = "video/mp4";
    video.appendChild(fallback);

    video.load();
    tryPlay();
  }

  const reveal = () => video.classList.add("ready");

  // Never DESTROY the element on failure — just hide it. A later theme
  // change might succeed (e.g. blackvideo.mp4 missing but bluevideo.mp4
  // exists), and we want to be ready to fade it back in.
  function hide() {
    video.classList.remove("ready");
  }

  video.addEventListener("loadeddata", reveal);
  video.addEventListener("canplay", reveal);
  video.addEventListener("error", (e) => {
    // <source>-level errors bubble here too during load-fallback; only
    // treat error on <video> itself (all sources failed) as final.
    if (e.target === video) hide();
  });

  // Chromium/Safari may reject the first play() until a user gesture —
  // retry silently on the next click/tap/keydown.
  function tryPlay() {
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        const kick = () => {
          video.play().catch(() => {});
          window.removeEventListener("click", kick);
          window.removeEventListener("touchstart", kick);
          window.removeEventListener("keydown", kick);
        };
        window.addEventListener("click", kick, { once: true });
        window.addEventListener("touchstart", kick, { once: true, passive: true });
        window.addEventListener("keydown", kick, { once: true });
      });
    }
  }

  // Boot with the current theme.
  const initial = document.documentElement.getAttribute("data-theme") || "black";
  loadForTheme(initial);

  // Swap the source whenever the theme changes.
  window.addEventListener("themechange", (e) => {
    const next =
      (e && e.detail && e.detail.theme) ||
      document.documentElement.getAttribute("data-theme") ||
      "black";
    loadForTheme(next);
  });

  // If the intro is running, wait for it to finish before revealing.
  window.addEventListener("intro:done", () => {
    if (video.readyState >= 2) reveal();
  });
})();
