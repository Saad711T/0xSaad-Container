/* ============================================================
   Controller + keyboard input.
   Sends abstract intents to the currently-installed handler:
     - up / down / left / right / activate / back / theme / shoulder-l / shoulder-r
   Keyboard mappings:
     Arrows, WASD, Enter/Space (activate), Esc/Backspace (back)
     PageUp / PageDown (jump items)
     ] / [   or  L / R  (shoulder = switch category)
     T (theme)
   Gamepad mappings (standard mapping):
     D-Pad + left stick, A (activate), B (back)
     LB / RB (shoulder = switch category)
     Start (theme)
   Touch: swipe on the body — horizontal switches category,
     vertical scrolls items.
   ============================================================ */
(function () {
  const handlers = { current: defaultHandler() };

  function defaultHandler() {
    return {
      onIntent(intent) {
        // Home page (XMB)
        if (window.XMB) {
          switch (intent) {
            case "left":    return window.XMB.moveCat(-1);
            case "right":   return window.XMB.moveCat(1);
            case "up":      return window.XMB.moveItem(-1);
            case "down":    return window.XMB.moveItem(1);
            case "activate":return window.XMB.activate();
            case "back":    return; // already at root
            case "shoulder-l": return window.XMB.moveCat(-1);
            case "shoulder-r": return window.XMB.moveCat(1);
            case "theme":   return window.Theme && window.Theme.cycle();
          }
        }
        // Inner pages
        switch (intent) {
          case "back":
            if (document.referrer && new URL(document.referrer).origin === location.origin) {
              history.back();
            } else {
              location.href = "index.html";
            }
            return;
          case "theme": return window.Theme && window.Theme.cycle();
          case "up":    return window.PageNav && window.PageNav.move(-1);
          case "down":  return window.PageNav && window.PageNav.move(1);
          case "activate": return window.PageNav && window.PageNav.activate();
          case "shoulder-l": return window.PageNav && window.PageNav.jump(-5);
          case "shoulder-r": return window.PageNav && window.PageNav.jump(5);
        }
      },
    };
  }

  function dispatch(intent) {
    if (!intent) return;
    try { handlers.current.onIntent(intent); } catch (e) { console.error(e); }
  }

  /* ------------------- keyboard ------------------- */
  const KEY_MAP = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", a: "left", s: "down", d: "right",
    W: "up", A: "left", S: "down", D: "right",
    Enter: "activate", " ": "activate",
    Escape: "back", Backspace: "back",
    PageUp: "up", PageDown: "down",
    "[": "shoulder-l", "]": "shoulder-r",
    l: "shoulder-l", r: "shoulder-r",
    L: "shoulder-l", R: "shoulder-r",
    t: "theme", T: "theme",
  };

  window.addEventListener("keydown", (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    const intent = KEY_MAP[e.key];
    if (!intent) return;
    // Theme is handled in theme.js — don't fire twice
    if (intent === "theme") return;
    e.preventDefault();
    dispatch(intent);
  });

  /* ------------------- gamepad ------------------- */
  const BTN = {
    A: 0, B: 1, X: 2, Y: 3,
    LB: 4, RB: 5, LT: 6, RT: 7,
    BACK: 8, START: 9,
    LS: 10, RS: 11,
    DUP: 12, DDOWN: 13, DLEFT: 14, DRIGHT: 15,
  };

  const held = {};
  const REPEAT_DELAY = 350; // ms before repeat kicks in
  const REPEAT_RATE = 130;
  const lastRepeat = {};

  function poll() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp) continue;
      handlePad(gp);
    }
    requestAnimationFrame(poll);
  }

  function edge(id, isDown, intent, { repeat = false } = {}) {
    const now = performance.now();
    if (isDown && !held[id]) {
      held[id] = now;
      lastRepeat[id] = now;
      dispatch(intent);
    } else if (isDown && repeat && held[id]) {
      const elapsed = now - held[id];
      if (elapsed > REPEAT_DELAY && now - lastRepeat[id] > REPEAT_RATE) {
        lastRepeat[id] = now;
        dispatch(intent);
      }
    } else if (!isDown && held[id]) {
      held[id] = 0;
    }
  }

  function axisTo(v) {
    const dz = 0.45;
    if (v > dz) return 1;
    if (v < -dz) return -1;
    return 0;
  }

  function handlePad(gp) {
    const btn = (i) => gp.buttons[i] && gp.buttons[i].pressed;
    const ax = gp.axes || [];
    // stick (left) + d-pad
    const xAxis = axisTo(ax[0] || 0);
    const yAxis = axisTo(ax[1] || 0);
    const up    = btn(BTN.DUP)    || yAxis === -1;
    const down  = btn(BTN.DDOWN)  || yAxis ===  1;
    const left  = btn(BTN.DLEFT)  || xAxis === -1;
    const right = btn(BTN.DRIGHT) || xAxis ===  1;

    edge(gp.index + ":up",    up,    "up",    { repeat: true });
    edge(gp.index + ":down",  down,  "down",  { repeat: true });
    edge(gp.index + ":left",  left,  "left",  { repeat: true });
    edge(gp.index + ":right", right, "right", { repeat: true });

    edge(gp.index + ":a",     btn(BTN.A),     "activate");
    edge(gp.index + ":b",     btn(BTN.B),     "back");
    edge(gp.index + ":lb",    btn(BTN.LB),    "shoulder-l");
    edge(gp.index + ":rb",    btn(BTN.RB),    "shoulder-r");
    edge(gp.index + ":start", btn(BTN.START), "theme");
  }

  window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad.id);
    showConnectToast(`Controller connected: ${trimName(e.gamepad.id)}`);
  });
  window.addEventListener("gamepaddisconnected", (e) => {
    showConnectToast("Controller disconnected");
  });

  function trimName(id) { return id.length > 30 ? id.slice(0, 27) + "…" : id; }

  function showConnectToast(text) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(showConnectToast._t);
    showConnectToast._t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  requestAnimationFrame(poll);

  /* ------------------- touch (swipe) ------------------- */
  let touchStart = null;
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const dx = (e.changedTouches[0].clientX - touchStart.x);
    const dy = (e.changedTouches[0].clientY - touchStart.y);
    const dt = Date.now() - touchStart.t;
    touchStart = null;
    if (dt > 800) return;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    if (Math.max(absX, absY) < 40) return;
    if (absX > absY) {
      dispatch(dx < 0 ? "right" : "left");
    } else {
      // let normal scroll handle Y on inner pages
      if (window.XMB) dispatch(dy < 0 ? "down" : "up");
    }
  }, { passive: true });

  /* ------------------- back button on inner pages ------------------- */
  window.addEventListener("popstate", () => { /* browser handles */ });

  /* expose */
  window.Input = { dispatch, setHandler: (h) => (handlers.current = h) };
})();
