/* Homepage bootstrap — clock only; XMB and input wire themselves. */
(function () {
  function tick() {
    const el = document.getElementById("clock");
    if (!el) return;
    const now = new Date();
    const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    el.textContent = `${date}  ${time}`;
  }
  tick();
  setInterval(tick, 30 * 1000);
})();
