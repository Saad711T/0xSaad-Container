/* Blog listing — reads POSTS from data.js */
(function () {
  const list = document.getElementById("post-list");
  if (!list || typeof POSTS === "undefined") return;

  POSTS.forEach((p, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "listitem");
    li.setAttribute("aria-selected", i === 0 ? "true" : "false");
    li.dataset.index = i;
    li.innerHTML = `
      <a class="post-link" href="${p.slug}">
        <span class="date">${formatDate(p.date)}</span>
        <span class="title">${escape(p.title)}</span>
        <span class="arrow" aria-hidden="true">▶</span>
      </a>
    `;
    list.appendChild(li);
  });

  const items = [...list.children];
  let idx = 0;

  function highlight() {
    items.forEach((el, i) => el.setAttribute("aria-selected", i === idx ? "true" : "false"));
    const el = items[idx];
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  window.PageNav = {
    move(delta) {
      idx = Math.max(0, Math.min(items.length - 1, idx + delta));
      highlight();
    },
    jump(delta) { this.move(delta); },
    activate() {
      const a = items[idx] && items[idx].querySelector("a.post-link");
      if (a) location.href = a.href;
    },
  };

  function escape(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"'"
    }[c]));
  }
})();
