/* ============================================================
   PS3-style intro overlay.
   Full-black screen → "0xSaad" text fades in → holds → fades out
   → the overlay fades away and reveals the site.
   Runs every load / refresh. Skippable with Enter, Space,
   click, tap, or any controller button.
   ============================================================ */
(function () {
  const overlay = document.getElementById("intro");
  if (!overlay) return;

  const text = overlay.querySelector(".intro-text");

  const TIMING = {
    holdBlack:  200,   // pure black beat before text appears
    textIn:     900,   // text fade-in
    textHold:  1300,   // text sits
    textOut:    700,   // text fade-out
    overlayOut: 550,   // overlay fade to reveal site
  };

  let done = false;
  let timers = [];

  function schedule(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function play() {
    // Try to play the startup sfx if the user provided one.
    if (window.SFX) window.SFX.play("startup");

    let t = 0;
    t += TIMING.holdBlack;
    schedule(() => text.classList.add("show"), t);
    t += TIMING.textIn + TIMING.textHold;
    schedule(() => text.classList.remove("show"), t);
    t += TIMING.textOut;
    schedule(finish, t);
  }

  function finish() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    overlay.classList.add("fading");
    setTimeout(() => {
      overlay.remove();
      // Let the page know it can start any deferred work.
      window.dispatchEvent(new CustomEvent("intro:done"));
    }, TIMING.overlayOut);
  }

  // Skip on any input.
  const skip = (e) => {
    if (e && e.type === "keydown") {
      // don't skip on modifier-only keys
      if (["Shift","Control","Alt","Meta"].includes(e.key)) return;
    }
    finish();
  };
  overlay.addEventListener("click", skip);
  overlay.addEventListener("touchstart", skip, { passive: true });
  window.addEventListener("keydown", skip, { once: true });
  window.addEventListener("gamepadconnected", skip, { once: true });

  // Kick it off after the first paint so the black frame is definitely up.
  requestAnimationFrame(() => requestAnimationFrame(play));
})();
