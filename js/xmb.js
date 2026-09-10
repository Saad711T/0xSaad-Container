/* ============================================================
   XMB renderer and navigation.
   Exposes window.XMB with: moveCat, moveItem, activate.
   Emits "xmb:activate" custom events for action items.
   ============================================================ */
(function () {
  const root = document.getElementById("xmb");
  if (!root || typeof XMB_CATEGORIES === "undefined") return;

  const state = {
    catIndex: 2,   // Blog highlighted by default (feels welcoming)
    itemIndex: 0,
  };

  /* ---------- render ---------- */
  const track = document.createElement("div");
  track.className = "xmb-track";
  root.appendChild(track);

  const row = document.createElement("div");
  row.className = "xmb-row";
  track.appendChild(row);

  XMB_CATEGORIES.forEach((cat, i) => {
    const el = document.createElement("div");
    el.className = "xmb-cat";
    el.setAttribute("role", "menuitem");
    el.setAttribute("aria-selected", i === state.catIndex ? "true" : "false");
    el.dataset.index = i;
    el.innerHTML = `
      <div class="icon" aria-hidden="true">${iconMarkup(cat.icon, cat.label)}</div>
      <div class="label">${escapeHtml(cat.label)}</div>
    `;
    el.addEventListener("click", () => {
      if (i === state.catIndex) return;
      const delta = i > state.catIndex ? 1 : -1;
      state.catIndex = i;
      state.itemIndex = 0;
      if (window.SFX) window.SFX.play("move");
      render();
    });
    row.appendChild(el);
  });

  const itemsWrap = document.createElement("div");
  itemsWrap.className = "xmb-items";
  itemsWrap.setAttribute("role", "menu");
  track.appendChild(itemsWrap);

  function render() {
    /* highlight categories */
    [...row.children].forEach((el, i) => {
      el.setAttribute("aria-selected", i === state.catIndex ? "true" : "false");
    });

    /* slide the row so the selected category sits centered */
    const cats = [...row.children];
    if (cats[state.catIndex]) {
      const target = cats[state.catIndex];
      const rowRect = row.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offset =
        (rowRect.left + rowRect.width / 2) - (targetRect.left + targetRect.width / 2);
      row.style.transform = `translate(calc(-50% + ${offset}px), -50%)`;
    }

    /* render items for the selected category */
    const cat = XMB_CATEGORIES[state.catIndex];
    itemsWrap.innerHTML = "";
    cat.items.forEach((it, i) => {
      const selected = i === state.itemIndex;
      const isLink = !!it.href;
      const el = document.createElement(isLink ? "a" : "button");
      el.className = "xmb-item";
      el.setAttribute("role", "menuitem");
      el.setAttribute("aria-selected", selected ? "true" : "false");
      el.style.animationDelay = `${i * 60}ms`;
      if (isLink) {
        el.href = it.href;
        if (it.external) { el.target = "_blank"; el.rel = "noopener"; }
      } else {
        el.type = "button";
      }
      el.innerHTML = `
        <div class="thumb" aria-hidden="true">${iconMarkup(it.thumb || fallbackGlyph(cat, it), it.title)}</div>
        <div class="meta">
          <div class="title">${escapeHtml(it.title)}</div>
          <div class="sub">${escapeHtml(it.sub || "")}</div>
        </div>
      `;
      el.addEventListener("click", (e) => {
        state.itemIndex = i;
        render();
        if (it.action) {
          e.preventDefault();
          if (window.SFX) window.SFX.play("select");
          runAction(it.action);
        } else {
          if (window.SFX) window.SFX.play("select");
        }
      });
      itemsWrap.appendChild(el);
    });
  }

  function iconMarkup(value, altText) {
    if (typeof isImagePath === "function" && isImagePath(value)) {
      // onerror clears itself so a missing file doesn't loop, and falls back
      // to a subtle placeholder glyph.
      const safe = escapeAttr(value);
      const alt = escapeAttr(altText || "");
      return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.replaceWith(document.createTextNode('◆'));" />`;
    }
    return escapeHtml(value || "•");
  }

  function fallbackGlyph(cat, it) {
    if (it.action && it.action.startsWith("theme:")) return "◐";
    if (it.action && it.action.startsWith("audio:")) return "♪";
    if (cat.id === "blog") return "▶";
    if (cat.id === "about") return "i";
    if (cat.id === "projects") return "◆";
    if (cat.id === "friends") return "♥";
    if (cat.id === "settings") return "⚙";
    return "•";
  }

  function runAction(action) {
    if (action.startsWith("theme:")) {
      const t = action.split(":")[1];
      if (t === "cycle") window.Theme.cycle();
      else window.Theme.apply(t);
      return;
    }
    if (action === "audio:toggle") {
      if (window.SFX) {
        const nowMuted = window.SFX.toggleMute();
        const el = document.getElementById("toast");
        if (el) {
          el.textContent = nowMuted ? "Audio: muted" : "Audio: on";
          el.classList.add("show");
          clearTimeout(window.__sfxToast);
          window.__sfxToast = setTimeout(() => el.classList.remove("show"), 1200);
        }
      }
      return;
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  function escapeAttr(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- navigation ---------- */
  function moveCat(delta) {
    const n = XMB_CATEGORIES.length;
    state.catIndex = (state.catIndex + delta + n) % n;
    state.itemIndex = 0;
    if (window.SFX) window.SFX.play("move");
    render();
  }
  function moveItem(delta) {
    const items = XMB_CATEGORIES[state.catIndex].items;
    if (!items.length) return;
    const prev = state.itemIndex;
    state.itemIndex = Math.max(0, Math.min(items.length - 1, state.itemIndex + delta));
    if (prev !== state.itemIndex && window.SFX) window.SFX.play("tick");
    render();
  }
  function activate() {
    const item = XMB_CATEGORIES[state.catIndex].items[state.itemIndex];
    if (!item) return;
    if (window.SFX) window.SFX.play("select");
    if (item.action) return runAction(item.action);
    if (item.href) {
      if (item.external) window.open(item.href, "_blank", "noopener");
      else location.href = item.href;
    }
  }

  window.XMB = { moveCat, moveItem, activate, render };

  /* re-center on resize (transform math depends on layout) */
  window.addEventListener("resize", render);
  window.addEventListener("orientationchange", render);

  render();
})();
