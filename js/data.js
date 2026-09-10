/* ============================================================
   Single source of truth for XMB content and blog posts.
   Add new posts here — blog.html and index.html pick them up
   automatically. Keep the newest post at the TOP of POSTS.
   ============================================================

   ICONS + THUMBNAILS
   ------------------
   `icon` (category) and `thumb` (item) accept either:
     - a path to an image ("assets/icons/blog.png"), or
     - a short string / emoji that renders as text ("✎").
   The renderer picks based on whether the value looks like a
   file path. Drop your PNG/SVG/WebP files into assets/ and
   they'll appear automatically.
   ============================================================ */

const POSTS = [
   {
        title: 'Museum',
        slug: './museum.html',
        date: '2026-02-06',
        image: '',
        excerpt: ''    },
    {
        title: '2025',
        slug: 'articles/datasciencetopics.html',
        date: '2025-09-02',
        image: '',
        excerpt: ''
    },
];

/* Newest-first for listing */
POSTS.sort((a, b) => (a.date < b.date ? 1 : -1));

/* XMB categories — order matches the crossbar left-to-right.
   Drop your own PNG/SVG at each `icon` path to replace them. */
const XMB_CATEGORIES = [
  {
    id: "settings",
    label: "Settings",
    icon: "assets/icons/settings.png",
    items: [
      { title: "Theme: Black",     sub: "Dark mode",    action: "theme:black", thumb: "assets/icons/theme-black.png" },
      { title: "Theme: Blue",      sub: "Reliable night",   action: "theme:blue",  thumb: "assets/icons/theme-blue.png" },
      { title: "Theme: Beige",     sub: "Warm sepia",   action: "theme:beige", thumb: "assets/icons/theme-beige.png" },
      { title: "Cycle theme (T)",  sub: "Next theme",   action: "theme:cycle", thumb: "assets/icons/theme-cycle.png" },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: "assets/icons/about.png",
    items: [
      { title: "About me",   sub: "Who I am",       href: "about.html",                                   thumb: "assets/thumbs/about.jpg" },
      { title: "GitHub",     sub: "@Saad711T",      href: "https://github.com/Saad711T", external: true, thumb: "assets/icons/github.png" },
      { title: "Email",      sub: "Say hi",         href: "mailto:saadlegendcontact78@gmail.com",                     thumb: "assets/icons/mail.webp" },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    icon: "assets/icons/blog.png",
    items: [
      { title: "All posts",  sub: `${POSTS.length} entries`, href: "blog.html", thumb: "assets/icons/blog.png" },
      ...POSTS.slice(0, 4).map((p) => ({
        title: p.title,
        sub: formatDate(p.date),
        href: p.slug,
        thumb: p.thumb,
      })),
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: "assets/icons/projects.png",
    items: [
      { title: "SaadBrowser",    sub: "One of the best unusable browsers", href: "https://github.com/Saad711T/SaadBrowser", external: true, thumb: "assets/icons/saadbrowser.png" },
      { title: "SaadAIBlog",  sub: "Your best way to learn AI",    href: "https://saadaiblog.netlify.app", external: true, thumb: "assets/icons/saadaiblog.png" },
      { title: "Vectorizer-SVG",  sub: "Python linear algebra library with SVG Manipulation",    href: "https://pypi.org/project/vectorizer-svg/", external: true, thumb: "assets/icons/vectorizer.png" },
      { title: "More....",  sub: "View more in My github account",    href: "https://github.com/Saad711T", external: true, thumb: "assets/icons/github.webp" },

    ],
  },
  {
    id: "friends",
    label: "Friends",
    icon: "assets/icons/friends.png",
    items: [
      { title: "CranL", sub: "1v1 vs. vercel",         href: "https://www.cranl.com",      external: true, thumb: "assets/icons/cranl.jpg" },
      { title: "Internet Archive", sub: "The past is still alive",         href: "https://archive.org/",      external: true, thumb: "assets/icons/internet.webp" },
      { title: "Linux", sub: ">> Windows",         href: "https://www.linux.org",      external: true, thumb: "assets/icons/linux.jpg" },
      { title: "Call of Duty : Black Ops 2",       sub: "MENENDEEEEEEEEZ !", href: "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/",  external: true, thumb: "assets/icons/bo2.png" },
      { title: "Quarto",       sub: "My fav static sites generator framework", href: "https://github.com/quarto-dev",  external: true, thumb: "assets/icons/quarto.png" },

    ],
  },
];

function formatDate(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

/* Detects whether an icon/thumb value is a file path vs. inline text. */
function isImagePath(v) {
  if (!v || typeof v !== "string") return false;
  return /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(v) || /^assets\//.test(v);
}
