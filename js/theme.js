/* ============================================================
   Theme switcher — three modes: black, blue, beige.
   Persists to localStorage. Broadcasts a "themechange" event.
   ============================================================ */
(function () {
  const THEMES = ["black", "blue", "beige"];
  const KEY = "ps3-xmb-theme";

  function current() {
    return document.documentElement.getAttribute("data-theme") || "black";
  }

  function apply(theme, { toast = true } = {}) {
    if (!THEMES.includes(theme)) theme = "black";
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (_) {}
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    if (toast) showToast(`Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`);
  }

  function cycle() {
    const idx = THEMES.indexOf(current());
    apply(THEMES[(idx + 1) % THEMES.length]);
  }

  function showToast(text) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 1400);
  }

  /* boot */
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  apply(saved || "black", { toast: false });

  /* expose */
  window.Theme = { apply, cycle, current, THEMES };

  /* wire up any theme buttons on the page */
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-btn");
    if (btn) btn.addEventListener("click", cycle);
  });

  /* keyboard: T cycles theme */
  window.addEventListener("keydown", (e) => {
    if (e.key === "t" || e.key === "T") {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      cycle();
    }
  });
})();
