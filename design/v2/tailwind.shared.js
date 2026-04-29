/* Shared JS for the Tailwind portfolio pages.
   Theme toggle, lang toggle, sticky nav background, scroll-spy.
*/

(() => {
  const root = document.documentElement;

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    const sun = document.getElementById("icon-sun");
    const moon = document.getElementById("icon-moon");
    if (sun)  sun.style.display  = mode === "dark" ? "block" : "none";
    if (moon) moon.style.display = mode === "dark" ? "none"  : "block";
    try { localStorage.setItem("theme", mode); } catch (e) {}
  }

  // Init theme
  (function init() {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved) { setTheme(saved); return; }
    const prefDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefDark ? "dark" : "light");
  })();

  // Theme toggle
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  // Lang toggle (vertical slide swap)
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const cur = btn.querySelector(".now");
      if (!cur) return;
      const nextText = cur.textContent === "EN" ? "DE" : "EN";
      const next = document.createElement("span");
      next.className = "in";
      next.textContent = nextText;
      btn.appendChild(next);
      requestAnimationFrame(() => {
        cur.classList.remove("now"); cur.classList.add("out");
        requestAnimationFrame(() => {
          next.classList.remove("in"); next.classList.add("now");
        });
      });
      setTimeout(() => cur.remove(), 500);
    });
  }

  // Sticky-nav scrolled state — bumps bg opacity
  (function navScroll() {
    const nav = document.querySelector("[data-nav-bg]");
    if (!nav) return;
    const upd = () => {
      const scrolled = window.scrollY > 8;
      nav.style.background = scrolled
        ? "color-mix(in oklab, var(--bg) 70%, transparent)"
        : "color-mix(in oklab, var(--bg) 55%, transparent)";
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
  })();

  // Scroll-spy on in-page nav links
  (function navSpy() {
    const wrap = document.getElementById("nav-links");
    if (!wrap) return;
    const links = [...wrap.querySelectorAll("a")];
    const map = links
      .map(a => {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#") || href === "#") return null;
        return { a, sec: document.querySelector(href) };
      })
      .filter(Boolean);
    if (!map.length) return;

    let active = null;
    function spy() {
      const y = window.scrollY + 140;
      let cur = null;
      for (const { a, sec } of map) {
        if (sec.offsetTop <= y) cur = a;
      }
      if (cur !== active) {
        if (active) active.classList.remove("active");
        active = cur;
        if (active) active.classList.add("active");
      }
    }
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  })();

  // Filter buttons (work + writing index pages)
  (function listFilters() {
    const filterRoot = document.querySelector("[data-filters]");
    if (!filterRoot) return;
    const list = document.getElementById("list");
    const countEl = document.getElementById("count");
    if (!list) return;
    const items = [...list.querySelectorAll("li")];
    const buttons = [...filterRoot.querySelectorAll("button[data-tag]")];

    const total = items.length;
    function setCount(shown) {
      if (!countEl) return;
      countEl.textContent =
        String(shown).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => {
          b.classList.remove("text-accent");
          b.classList.add("text-muted");
          b.dataset.on = "false";
        });
        btn.classList.remove("text-muted");
        btn.classList.add("text-accent");
        btn.dataset.on = "true";

        const tag = btn.dataset.tag;
        let shown = 0;
        items.forEach(li => {
          const tags = (li.dataset.tags || "").split(",");
          const visible = tag === "all" || tags.includes(tag);
          li.style.display = visible ? "" : "none";
          if (visible) shown++;
        });
        setCount(shown);
      });
    });

    setCount(total);
  })();
})();
