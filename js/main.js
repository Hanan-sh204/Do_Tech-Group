"use strict";
const KEY = "dotech.v1.";
const store = {
  get(n, d) {
    try {
      const r = localStorage.getItem(KEY + n);
      return r ? JSON.parse(r) : d;
    } catch {
      return d;
    }
  },
  set(n, v) {
    try {
      localStorage.setItem(KEY + n, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  },
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
const P = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  target:
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  mobile:
    '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  briefcase:
    '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  grad: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  compass:
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
};
const icon = (n, size = 16, extra = "") =>
  `<svg class="i ${extra}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${
    P[n] || P.code
  }</svg>`;
const CAT_ICON = {
  programming: "code",
  ai: "code",
  web: "globe",
  mobile: "mobile",
  data: "database",
  tools: "code",
  career: "briefcase",
  software: "code",
  webapps: "globe",
  engineering: "code",
  research: "code",
};

const App = {
  lang: (() => {
    try {
      return localStorage.getItem(KEY + "lang") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  })(),
  data: {
    courses: store.get("courses", seedCourses),
    projects: store.get("projects", seedProjects),
    messages: store.get("messages", seedMessages),
    settings: store.get("settings", seedSettings),
  },
  page: "",
  render: null,
  save(k) {
    store.set(k, this.data[k]);
  },
};
// keep contact details filled from data.js when the saved settings have them empty
for (const k of ["phone", "email"])
  if (!App.data.settings[k]) App.data.settings[k] = seedSettings[k];
const tr = () => T[App.lang];

function applyLang() {
  const t = tr(),
    s = App.data.settings;
  document.documentElement.lang = App.lang;
  document.documentElement.dir = t.dir;
  try {
    localStorage.setItem(KEY + "lang", App.lang);
  } catch {
    /* ignore */
  }
  document.documentElement.style.setProperty("--gold", s.accent || "#D6AA55");
  document.title = s.seoTitle?.[App.lang] || t.seo.title;
  document
    .querySelector("meta[name=description]")
    ?.setAttribute("content", s.seoDesc?.[App.lang] || t.seo.desc);
}
const LINKS = [
  ["index.html", "home"],
  ["about.html", "about"],
  ["courses.html", "courses"],
  ["projects.html", "projects"],
  ["contact.html", "contact"],
];

function renderShell() {
  const t = tr(),
    s = App.data.settings;
  const link = ([href, k]) =>
    `<a href="${href}"${
      App.page === k ? ' class="active" aria-current="page"' : ""
    }>${t.nav[k]}${App.page === k ? '<span class="bar"></span>' : ""}</a>`;
  document.getElementById(
    "site-header"
  ).innerHTML = `<header class="nav" id="nav"><div class="wrap">
    <a href="index.html" class="brand" aria-label="Do Tech Group"><img class="logo" src="assets/logo.jpg" alt="Do Tech Group" width="52" height="52"><span>Do Tech Group</span></a>
    <nav class="links" aria-label="Main">${LINKS.map(link).join("")}</nav>
    <div class="nav-actions"><button class="btn ghost sm" id="lang-btn" aria-label="${
      t.switchLang
    }">${
    t.langName
  }</button><a href="contact.html" class="btn primary sm cta">${
    t.nav.contact
  }</a></div>
    <button class="burger" id="burger" aria-expanded="false" aria-label="${
      t.menu
    }">${icon("menu", 22)}</button></div>
    <nav class="mobile" id="mobile" aria-label="Mobile" hidden>${LINKS.map(
      ([h, k]) => `<a href="${h}">${t.nav[k]}</a>`
    ).join("")}</nav></header>`;
  const ph = (k) => `<span class="muted">${t.contact[k]}</span>`;
  document.getElementById(
    "site-footer"
  ).innerHTML = `<footer><div class="wrap fgrid">
    <div><div class="brand"><img class="logo" src="assets/logo.jpg" alt="" width="64" height="64"><span>${esc(
      s.company
    )}</span></div><p class="muted" style="margin-top:.8rem">${esc(
    s.tagline[App.lang] || t.tagline
  )}</p></div>
    <div><h4>${t.footer.links}</h4><ul>${LINKS.map(
    ([h, k]) => `<li><a href="${h}">${t.nav[k]}</a></li>`
  ).join("")}</ul></div>
    <div><h4>${t.footer.contact}</h4><ul><li>${t.contact.emailLabel}: ${
    esc(s.email) || ph("placeholderEmail")
  }</li><li>${t.contact.phoneLabel}: ${
    esc(s.phone) || ph("placeholderPhone")
  }</li>${
    s.social
      ? `<li><a href="${esc(
          s.social
        )}" target="_blank" rel="noreferrer noopener">${esc(s.social)}</a></li>`
      : ""
  }</ul></div></div>
    <p class="wrap muted" style="margin-top:2rem;font-size:.85rem">© ${new Date().getFullYear()} ${esc(
    s.company
  )}. ${t.footer.rights}</p></footer>`;
  const nav = document.getElementById("nav"),
    burger = document.getElementById("burger"),
    mob = document.getElementById("mobile");
  const solid = () =>
    nav.classList.toggle("solid", window.scrollY > 24 || !mob.hidden);
  burger.onclick = () => {
    mob.hidden = !mob.hidden;
    burger.setAttribute("aria-expanded", String(!mob.hidden));
    burger.innerHTML = icon(mob.hidden ? "menu" : "x", 22);
    solid();
  };
  document.getElementById("lang-btn").onclick = () => {
    App.lang = App.lang === "ar" ? "en" : "ar";
    renderAll();
  };
  if (!App._scroll) {
    App._scroll = true;
    window.addEventListener(
      "scroll",
      () =>
        document
          .getElementById("nav")
          ?.classList.toggle(
            "solid",
            window.scrollY > 24 || !document.getElementById("mobile").hidden
          ),
      { passive: true }
    );
  }
  solid();
}
let io;
function observeReveal() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window))
    return els.forEach((e) => e.classList.add("in"));
  io =
    io ||
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -60px 0px" }
    );
  els.forEach((e) => io.observe(e));
}
function renderAll() {
  applyLang();
  renderShell();
  App.render && App.render();
  observeReveal();
}
App.init = (page, render) => {
  App.page = page;
  App.render = render;
  document.addEventListener("DOMContentLoaded", renderAll);
};

function openModal(title, body) {
  const prev = document.activeElement,
    ov = document.createElement("div");
  ov.className = "overlay";
  ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(
    title
  )}" tabindex="-1"><button class="x" aria-label="${tr().common.close}">${icon(
    "x",
    20
  )}</button><h2>${esc(title)}</h2>${body}</div>`;
  const close = () => {
    ov.remove();
    document.removeEventListener("keydown", key);
    document.body.style.overflow = "";
    prev && prev.focus && prev.focus();
  };
  const key = (e) => e.key === "Escape" && close();
  ov.addEventListener("mousedown", (e) => e.target === ov && close());
  ov.querySelector(".x").onclick = close;
  document.addEventListener("keydown", key);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  ov.querySelector(".modal").focus();
  return { el: ov, close };
}
function courseCard(c) {
  const t = tr(),
    L = App.lang;
  return `<article class="card"><div class="visual" aria-hidden="true">${icon(
    CAT_ICON[c.category],
    44
  )}</div><div class="body">
    <div class="row" style="gap:.4rem"><span class="tag">${
      t.courses.cats[c.category]
    }</span>${
    c.sample ? `<span class="tag sample">${t.common.sample}</span>` : ""
  }</div>
    <h3>${esc(c.title[L])}</h3><p>${esc(c.desc[L])}</p>
    <div class="meta"><span>${icon("gauge", 14)}${
    t.courses.levels[c.level]
  }</span><span>${icon("clock", 14)}${esc(c.duration[L])}</span></div>
    <button class="btn ghost sm" style="margin-top:auto;width:fit-content" data-course="${
      c.id
    }">${t.common.details}${icon(
    "arrow",
    16,
    "arrow"
  )}</button></div></article>`;
}
function projectCard(p) {
  const t = tr(),
    L = App.lang;
  return `<article class="card"><div class="visual" aria-hidden="true">${icon(
    CAT_ICON[p.category],
    44
  )}</div><div class="body">
    <div class="row" style="gap:.4rem"><span class="tag">${
      t.projects.cats[p.category]
    }</span>${
    p.sample ? `<span class="tag sample">${t.common.sample}</span>` : ""
  }</div>
    <h3>${esc(p.title[L])}</h3><p>${esc(p.desc[L])}</p>
    <button class="btn ghost sm" style="margin-top:auto;width:fit-content" data-project="${
      p.id
    }">${t.common.details}${icon(
    "arrow",
    16,
    "arrow"
  )}</button></div></article>`;
}
function courseModal(c) {
  const t = tr(),
    L = App.lang,
    o = c.outcomes?.[L] || [];
  openModal(
    c.title[L],
    `<p class="lead">${esc(
      c.desc[L]
    )}</p><p class="meta" style="margin:1rem 0"><span>${
      t.courses.levels[c.level]
    }</span><span>${esc(c.duration[L])}</span><span>${
      t.courses.cats[c.category]
    }</span></p>
    ${
      o.length
        ? `<h3 style="font-size:1rem;margin-bottom:.4rem">${
            t.courses.outcomes
          }</h3><ul>${o.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`
        : ""
    }
    <a class="btn primary" style="margin-top:1rem" href="contact.html?type=0&ref=${encodeURIComponent(
      c.title[L]
    )}">${t.courses.inquire}</a>`
  );
}
function projectModal(p) {
  const t = tr(),
    L = App.lang;
  openModal(
    p.title[L],
    `<p class="lead">${esc(
      p.desc[L]
    )}</p><p class="meta" style="margin:1rem 0"><span>${
      t.projects.cats[p.category]
    }</span></p>
    ${
      p.tech
        ? `<p><b>${t.projects.tech}: </b>${p.tech
            .split(",")
            .map(
              (x) =>
                `<span class="tag" style="display:inline-block;margin:0 .3rem .3rem 0">${esc(
                  x.trim()
                )}</span>`
            )
            .join("")}</p>`
        : ""
    }
    ${
      p.url
        ? `<p style="margin-top:1rem"><a class="btn ghost sm" href="${esc(
            p.url
          )}" target="_blank" rel="noreferrer noopener">${
            t.projects.link
          }</a></p>`
        : ""
    }
    ${
      p.sample
        ? `<p class="notice" style="margin-top:1rem">${t.common.sampleNote}</p>`
        : ""
    }`
  );
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-course]"),
    p = e.target.closest("[data-project]");
  if (c) courseModal(App.data.courses.find((x) => x.id === c.dataset.course));
  if (p)
    projectModal(App.data.projects.find((x) => x.id === p.dataset.project));
});
const rv = (html, d = 0, tag = "div", cls = "") =>
  `<${tag} class="reveal ${cls}" style="--d:${d}s">${html}</${tag}>`;
