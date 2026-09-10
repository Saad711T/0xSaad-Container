/* Generic page-level nav (about, individual posts). Provides a
   no-op PageNav so controller.js has a target to talk to. */
(function () {
  window.PageNav = {
    move(delta) {
      window.scrollBy({ top: delta * 60, behavior: "smooth" });
    },
    jump(delta) {
      window.scrollBy({ top: delta * 200, behavior: "smooth" });
    },
    activate() { /* no-op on content pages */ },
  };
})();
