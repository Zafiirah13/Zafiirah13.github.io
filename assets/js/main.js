(function () {
  "use strict";
  const S = window.SITE, POSTS = window.POSTS, SERIES = window.SERIES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => String(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\*\*/g, "");
  const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;
  const IMG = "assets/img/gallery/";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BOOK = ["Zhang & Zohren, Deep Learning in Quantitative Trading (Cambridge University Press, 2025)", "https://www.cambridge.org/core/books/deep-learning-in-quantitative-trading/C39DE06D255470F6232BC97E2E5474E7"];
  const SERIES_HOME = { agentic: "evals/agentic", quant: "quant/log", splats: "research/splats", research: "research/earlier" };
  let simReady = false;

  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const setThemeColor = () => $('meta[name="theme-color"]').setAttribute("content", root.dataset.theme === "dark" ? "#0b1020" : "#f7f4ee");
  setThemeColor();
  $("#themeToggle").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("zh-theme", root.dataset.theme);
    setThemeColor();
    if (simReady) drawSim();
  });

  /* ---------------- Starfield (dark mode) ---------------- */
  (function stars() {
    const c = $("#stars"), ctx = c.getContext("2d");
    let pts = [];
    function size() {
      c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
      pts = Array.from({ length: Math.round((innerWidth * innerHeight) / 5200) }, () => ({
        x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.3 * devicePixelRatio + 0.2, p: Math.random() * Math.PI * 2
      }));
    }
    function frame(t) {
      if (root.dataset.theme === "dark") {
        ctx.clearRect(0, 0, c.width, c.height);
        for (const s of pts) {
          ctx.globalAlpha = 0.35 + 0.45 * Math.sin(t / 1400 + s.p) ** 2;
          ctx.fillStyle = "#e8eefc";
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    size(); addEventListener("resize", size); requestAnimationFrame(frame);
  })();

  /* ---------------- Routing: #tab, #tab/sub, #post/id, #blog/series ---------------- */
  const tabs = $$(".tab");
  function showSub(group, sub) {
    const btns = $$(`.subtabs[data-group="${group}"] .subtab`);
    if (!btns.some((b) => b.dataset.sub === sub)) return;
    btns.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.sub === sub)));
    $$(`.subpanel[data-group="${group}"]`).forEach((p) => p.classList.toggle("active", p.dataset.sub === sub));
    if (group === "evals" && sub === "vlm") playSlices();
    if (group === "quant" && sub === "playground") runSim();
    if (group === "quant" && sub === "scoreboard") animateBars("#sbRows");
  }
  function showPanel(tab, sub) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
    $$(".panel").forEach((p) => p.classList.toggle("active", p.id === tab));
    if (sub && tab === "blog") setBlogFilter(sub);
    else if (sub) showSub(tab, sub);
    else {
      const cur = $(`.subtabs[data-group="${tab}"] .subtab[aria-selected="true"]`);
      if (cur) showSub(tab, cur.dataset.sub);
    }
    const active = $(`.tab[data-tab="${tab}"]`), bar = $(".tabs");
    if (active && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: active.offsetLeft - bar.offsetLeft - (bar.clientWidth - active.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }
  let currentView = "home";
  function go(target, push = true) {
    target = target || "home";
    const [tab, sub] = target.split("/");
    if (tab === "post") {
      const p = POSTS.find((x) => x.id === sub);
      if (!p) return go("blog", push);
      if (!$(".panel.active") || !readerOpenedFrom) {
        const home = SERIES_HOME[p.series].split("/");
        if (currentView === "home" && !push) showPanel(home[0], home[1]);
      }
      openPost(p.id, push);
      return;
    }
    if (!$("#" + tab) || !$("#" + tab).classList.contains("panel")) return go("home", push);
    if (reader.classList.contains("open")) closeReader(false);
    showPanel(tab, sub);
    currentView = target;
    if (push) history.pushState(null, "", "#" + target);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
  tabs.forEach((t) => t.addEventListener("click", () => go(t.dataset.tab)));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) { e.preventDefault(); go(g.dataset.goto); return; }
    const pc = e.target.closest("[data-post]");
    if (pc) { e.preventDefault(); go("post/" + pc.dataset.post); }
  });
  $$(".subtab").forEach((b) => b.addEventListener("click", () => {
    const group = b.closest(".subtabs").dataset.group;
    showSub(group, b.dataset.sub);
    currentView = `${group}/${b.dataset.sub}`;
    history.replaceState(null, "", "#" + currentView);
  }));
  $(".tabs").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    n.focus(); go(n.dataset.tab);
  });
  addEventListener("hashchange", () => { go(location.hash.slice(1), false); if (!location.hash.startsWith("#post/")) window.scrollTo(0, 0); });

  /* ---------------- Modal, lightbox ---------------- */
  const modal = $("#modal"), lb = $("#lightbox"), reader = $("#reader");
  let lastFocus = null;
  const anyOpen = () => [modal, lb, reader].some((m) => m.classList.contains("open"));
  function open(el) { if (!anyOpen()) lastFocus = document.activeElement; el.classList.add("open"); document.body.style.overflow = "hidden"; const f = el.querySelector("button, a"); f && f.focus({ preventScroll: true }); }
  function close(el) { el.classList.remove("open"); if (!anyOpen()) { document.body.style.overflow = ""; lastFocus && lastFocus.focus({ preventScroll: true }); } }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest("[data-close]")) close(modal); });
  lb.addEventListener("click", () => close(lb));
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (lb.classList.contains("open")) close(lb);
    else if (modal.classList.contains("open")) close(modal);
    else if (reader.classList.contains("open")) closeReader(true);
  });
  document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (!z) return;
    $("#lbImg").src = z.dataset.zoom; $("#lbImg").alt = z.dataset.cap || ""; $("#lbCap").textContent = z.dataset.cap || "";
    open(lb);
  });

  /* ---------------- Scorecards & reader ---------------- */
  function cardHTML(p) {
    const s = SERIES[p.series];
    const label = p.ch || p.tag || s.name;
    const thumb = p.img
      ? `<div class="sc-thumb"><img src="${p.img}" alt="" loading="lazy" /></div>`
      : `<div class="sc-band ${s.color}"><span class="num">${String(p.n || "").padStart(2, "0")}</span>${icon(s.icon)}</div>`;
    return `<button class="card hover score-card" data-post="${p.id}" aria-label="Read: ${esc(p.title)}">
      ${thumb}
      <div class="sc-body">
        <div class="sc-top"><span class="chip ${s.color}">${esc(label)}</span><span class="sc-read">${icon("clock")}${p.read || 2} min · <b class="sc-go">Read →</b></span></div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.card)}</p>
        <div class="metrics">${(p.chips || []).map((c) => `<span class="metric">${esc(c)}</span>`).join("")}</div>
      </div></button>`;
  }
  $$(".post-grid[data-series]").forEach((g) => { g.innerHTML = POSTS.filter((p) => p.series === g.dataset.series).map(cardHTML).join(""); });

  // Blog hub
  const blogFilters = $("#blogFilters");
  blogFilters.innerHTML = [["all", "All"]].concat(Object.entries(SERIES).map(([k, v]) => [k, v.name]))
    .map(([k, l]) => `<button class="filter" data-f="${k}" aria-pressed="${k === "all"}">${esc(l)} <span class="muted">${k === "all" ? POSTS.length : POSTS.filter((p) => p.series === k).length}</span></button>`).join("");
  function setBlogFilter(f) {
    if (!SERIES[f]) f = "all";
    $$(".filter", blogFilters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    $("#blogGrid").innerHTML = POSTS.filter((p) => f === "all" || p.series === f).map(cardHTML).join("");
  }
  blogFilters.addEventListener("click", (e) => {
    const b = e.target.closest(".filter"); if (!b) return;
    setBlogFilter(b.dataset.f);
    currentView = b.dataset.f === "all" ? "blog" : "blog/" + b.dataset.f;
    history.replaceState(null, "", "#" + currentView);
  });
  setBlogFilter("all");

  let readerOpenedFrom = null;
  function sectionHTML(sec) {
    let h = sec.h ? `<h3>${esc(sec.h)}</h3>` : "";
    if (sec.p) h += `<p>${md(sec.p)}</p>`;
    if (sec.list) h += `<ul>${sec.list.map((li) => `<li>${md(li)}</li>`).join("")}</ul>`;
    if (sec.table) h += `<table class="r-table"><thead><tr>${sec.table.head.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${sec.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    if (sec.img) h += `<figure class="r-fig"><img src="${sec.img}" alt="${esc(sec.cap || "")}" loading="lazy" data-zoom="${sec.img}" data-cap="${esc(sec.cap || "")}" />${sec.cap ? `<figcaption>${esc(sec.cap)}</figcaption>` : ""}</figure>`;
    return `<section class="r-sec">${h}</section>`;
  }
  function openPost(id, push = true) {
    const p = POSTS.find((x) => x.id === id);
    if (!p) return;
    const s = SERIES[p.series];
    const siblings = POSTS.filter((x) => x.series === p.series);
    const i = siblings.indexOf(p), prev = siblings[i - 1], next = siblings[i + 1];
    const refs = (p.refs || []).slice();
    if (p.series === "quant") refs.unshift(BOOK);
    const media = p.video
      ? `<div class="r-media"><video poster="${p.img || ""}" controls muted loop playsinline autoplay preload="auto">
          <source src="${p.video}.webm" type="video/webm" />
          <source src="${p.video}.mp4" type="video/mp4" />
          <a href="${p.video}.mp4">Download the video</a>
        </video></div>`
      : p.img ? `<div class="r-media"><img src="${p.img}" alt="${esc(p.title)}" data-zoom="${p.img}" data-cap="${esc(p.title)}" /></div>` : "";
    $("#readerBody").innerHTML = `
      <header class="r-head">
        <div class="r-meta"><span class="chip ${s.color}">${esc(s.name)}</span>${p.ch || p.tag ? `<span class="chip">${esc(p.ch || p.tag)}</span>` : ""}<span class="sc-read">${icon("clock")}${p.read || 2} min read</span></div>
        <h2 id="readerTitle">${esc(p.title)}</h2>
        <p class="lead">${esc(p.card)}</p>
        <div class="metrics">${(p.chips || []).map((c) => `<span class="metric">${esc(c)}</span>`).join("")}</div>
      </header>
      <div class="r-body">
        ${p.series === "quant" || p.series === "agentic" ? `<div class="r-note">${icon("info")}<span>${s.note}</span></div>` : ""}
        ${media}
        ${p.sections.map(sectionHTML).join("")}
        ${(p.figs || []).map(([src, cap]) => `<figure class="r-fig"><img src="${src}" alt="${esc(cap)}" loading="lazy" data-zoom="${src}" data-cap="${esc(cap)}" /><figcaption>${esc(cap)}</figcaption></figure>`).join("")}
        ${refs.length ? `<section class="r-sec"><h3>Sources &amp; further reading</h3><ol class="r-refs">${refs.map(([t, u]) => `<li><a href="${u}" ${u.startsWith("#") ? "" : 'target="_blank" rel="noopener"'}>${esc(t)}</a></li>`).join("")}</ol></section>` : ""}
        <nav class="r-nav" aria-label="More in this series">
          <button ${prev ? `data-post="${prev.id}"` : "disabled"}><small>← Previous</small><span>${prev ? esc(prev.title) : ""}</span></button>
          <button ${next ? `data-post="${next.id}"` : "disabled"}><small>Next →</small><span>${next ? esc(next.title) : ""}</span></button>
        </nav>
      </div>`;
    if (!reader.classList.contains("open")) { readerOpenedFrom = currentView; open(reader); }
    reader.scrollTop = 0;
    if (push) history.pushState(null, "", "#post/" + id);
    document.title = p.title + " · Zafiirah Hosenie";
  }
  function closeReader(updateHash = true) {
    const v = $("#readerBody video"); v && v.pause();
    close(reader);
    document.title = "Zafiirah Hosenie · Senior Research Scientist · VLM Evaluation, Gaussian Splats & Quant";
    if (updateHash) {
      const back = readerOpenedFrom && !readerOpenedFrom.startsWith("post/") ? readerOpenedFrom : (SERIES_HOME[(POSTS.find((p) => "post/" + p.id === location.hash.slice(1)) || {}).series] || currentView);
      if (back !== currentView) go(back, false);
      history.pushState(null, "", "#" + back);
      currentView = back;
    }
    readerOpenedFrom = null;
  }
  reader.addEventListener("click", (e) => {
    if (e.target === reader || e.target.closest("[data-close]")) closeReader(true);
  });

  /* ---------------- Journey timeline ---------------- */
  const tlList = $("#tlList"), tlDetail = $("#tlDetail");
  tlList.innerHTML = S.timeline.map((x, i) =>
    `<button class="tl-item" role="tab" aria-selected="${i === 0}" data-i="${i}"><span class="yr">${esc(x.yr)}</span><span class="rl">${esc(x.role)}</span></button>`).join("");
  function showTl(i) {
    const x = S.timeline[i];
    $$(".tl-item", tlList).forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.i === i)));
    tlDetail.innerHTML = `<span class="chip autumn">${esc(x.yr)}</span><h3>${esc(x.role)}</h3><div class="org">${esc(x.org)}</div>
      <p style="margin-top:10px">${esc(x.summary)}</p>
      ${x.points.length ? `<ul>${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${x.link ? `<button class="btn ghost" style="margin-top:14px;padding:8px 14px;font-size:.86rem" data-goto="${x.link[1]}">${esc(x.link[0])} ${icon("arrow")}</button>` : ""}`;
    tlDetail.animate && !reduceMotion && tlDetail.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "ease-out" });
  }
  tlList.addEventListener("click", (e) => { const b = e.target.closest(".tl-item"); if (b) showTl(+b.dataset.i); });
  showTl(0);

  /* ---------------- Publications ---------------- */
  const PER = 6;
  let pubFilter = "all", pubPage = 0;
  const catLabel = { ai: "AI & Vision", astro: "Astro-ML", cosmo: "Cosmology" };
  const byMe = (a) => esc(a).replace("Z. Hosenie", '<span class="me">Z. Hosenie</span>');
  function renderPubs() {
    const list = S.pubs.map((p, i) => ({ ...p, i })).filter((p) => pubFilter === "all" || p.cat === pubFilter);
    const pages = Math.ceil(list.length / PER);
    pubPage = Math.min(pubPage, pages - 1);
    $("#pubGrid").innerHTML = list.slice(pubPage * PER, pubPage * PER + PER).map((p) => `
      <button class="card hover pub" data-pub="${p.i}">
        <span class="yr">${p.y} · ${esc(catLabel[p.cat])}</span>
        <h3>${esc(p.t)}</h3>
        <span class="venue">${byMe(p.a.length > 90 ? p.a.slice(0, 90).replace(/,[^,]*$/, "") + ", et al." : p.a)}</span>
        <span class="chip" style="align-self:flex-start">${esc(p.v)}</span>
      </button>`).join("");
    const arrow = (d) => icon(d).replace("<svg>", '<svg width="16" height="16">');
    $("#pubPager").innerHTML = pages > 1
      ? `<button ${pubPage === 0 ? "disabled" : ""} data-pg="-1" aria-label="Previous page">${arrow("left")}</button>
         <span class="muted">Page ${pubPage + 1} of ${pages}</span>
         <button ${pubPage >= pages - 1 ? "disabled" : ""} data-pg="1" aria-label="Next page">${arrow("right")}</button>` : "";
  }
  $("#pubFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter"); if (!b) return;
    pubFilter = b.dataset.f; pubPage = 0;
    $$("#pubFilters .filter").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderPubs();
  });
  $("#pubPager").addEventListener("click", (e) => { const b = e.target.closest("[data-pg]"); if (b) { pubPage += +b.dataset.pg; renderPubs(); } });
  $("#pubGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pub]"); if (!b) return;
    const p = S.pubs[+b.dataset.pub];
    $("#modalBody").innerHTML = `<span class="chip autumn">${p.y} · ${esc(p.v)}</span>
      <h3 id="modalTitle">${esc(p.t)}</h3><p class="muted">${byMe(p.a)}</p><p>${esc(p.abs)}</p>
      <div class="chips" style="margin-top:14px">${p.links.map(([l, u]) => u.startsWith("#")
        ? `<a class="btn ghost" style="padding:8px 14px" href="${u}" data-close-modal>${esc(l)} ${icon("arrow")}</a>`
        : `<a class="btn ghost" style="padding:8px 14px" href="${u}" target="_blank" rel="noopener">${esc(l)} ${icon("arrow")}</a>`).join("")}</div>`;
    open(modal);
  });
  $("#modalBody").addEventListener("click", (e) => { if (e.target.closest("[data-close-modal]")) close(modal); });
  renderPubs();

  /* ---------------- Repos, mentorship, events, awards ---------------- */
  $("#repoGrid").innerHTML = S.repos.map((r) => `
    <a class="card hover repo" href="https://github.com/Zafiirah13/${r.n}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">
      <div class="top"><span class="ico sage" style="margin:0;width:38px;height:38px">${icon("github")}</span>
      <span class="stars"><svg width="14" height="14" style="color:var(--mustard)"><use href="#i-star"/></svg>${r.s}</span></div>
      <h3>${esc(r.n)}</h3><p>${esc(r.d)}</p><span class="chip" style="align-self:flex-start">${esc(r.lang)}</span>
    </a>`).join("");
  const mediaCard = (m) => `
    <article class="card hover media-card">
      <img src="${IMG + m.img}" alt="${esc(m.t)}" loading="lazy" data-zoom="${IMG + m.img}" data-cap="${esc(m.t)}" />
      <div class="body"><span class="chip sky">${esc(m.tag)}</span><h3 style="margin-top:10px">${esc(m.t)}</h3><p>${esc(m.d)}</p>
      ${m.link ? `<a href="${m.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:.86rem;font-weight:600">Learn more →</a>` : ""}</div>
    </article>`;
  $("#mentorGrid").innerHTML = S.mentorship.map(mediaCard).join("");
  $("#eventGrid").innerHTML = S.events.map(mediaCard).join("");
  $("#awardGrid").innerHTML = S.awards.map((a) => `
    <article class="card hover award">
      <img src="${IMG + a.img}" alt="${esc(a.t)}" loading="lazy" data-zoom="${IMG + a.img}" data-cap="${esc(a.t)}" ${a.contain ? 'style="object-fit:contain;padding:8px"' : ""} />
      <div><span class="yr">${esc(a.y)}</span><h3 style="margin:4px 0 6px;font-size:1.05rem">${esc(a.t)}</h3><p>${esc(a.d)}</p>
      ${a.link ? `<a href="${a.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;font-size:.84rem;font-weight:600">View →</a>` : ""}</div>
    </article>`).join("");

  /* ---------------- Bars (scoreboard & slice report) ---------------- */
  function barRow(name, v, max, hi, low) {
    const style = hi ? "" : low ? 'style="background:linear-gradient(90deg,var(--autumn-deep),var(--mustard))"' : 'style="background:linear-gradient(90deg,var(--sky-deep),var(--sage-deep));opacity:.75"';
    return `<div class="sb-row"><span>${esc(name)}</span><div class="bar"><i data-w="${(v / max) * 100}" ${style}></i></div><span class="v">${v.toFixed(2)}</span></div>`;
  }
  function animateBars(sel) {
    const bars = $$(sel + " .bar i");
    bars.forEach((b) => (b.style.width = "0"));
    setTimeout(() => bars.forEach((b) => (b.style.width = b.dataset.w + "%")), reduceMotion ? 0 : 80);
  }
  const maxV = Math.max(...S.scoreboard.filter((r) => r.v != null).map((r) => r.v));
  $("#sbRows").innerHTML = S.scoreboard.map((r) => r.g ? `<div class="sb-group">${esc(r.g)}</div>` : barRow(r.n, r.v, maxV, r.hi)).join("");

  const SLICES = [["Overall", 0.82, true], ["Frontal faces", 0.91], ["Turned away / profile", 0.79], ["6+ people in room", 0.70, false, true], ["Low frame rate", 0.73, false, true], ["Low resolution", 0.64, false, true], ["Heavy occlusion", 0.61, false, true]];
  $("#sliceRows").innerHTML = `<div class="sb-group">Task accuracy by condition</div>` + SLICES.map(([n, v, hi, low]) => barRow(n, v, 1, hi, low)).join("");
  let sliceTimer = null;
  function playSlices() {
    const v = $("#sliceVerdict");
    v.classList.remove("show");
    animateBars("#sliceRows");
    clearTimeout(sliceTimer);
    sliceTimer = setTimeout(() => v.classList.add("show"), reduceMotion ? 0 : 900);
  }
  $("#replaySlices").addEventListener("click", playSlices);

  /* ---------------- Vol-targeting simulator ---------------- */
  let seed = 17, sim = null;
  function rng(s) { return function () { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const stats = (rets) => {
    const n = rets.length, m = rets.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(rets.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
    let peak = 0, cum = 0, mdd = 0;
    for (const r of rets) { cum += r; peak = Math.max(peak, cum); mdd = Math.min(mdd, cum - peak); }
    return { sharpe: (m / sd) * Math.sqrt(252), vol: sd * Math.sqrt(252), ret: m * 252, mdd: Math.exp(mdd) - 1 };
  };
  function runSim() {
    const a = +$("#alpha").value;
    let b = +$("#beta").value;
    if (a + b > 0.985) { b = +(0.985 - a).toFixed(2); $("#beta").value = b; }
    const tgt = +$("#target").value, mu = +$("#drift").value;
    $("#alphaOut").textContent = a.toFixed(2);
    $("#betaOut").textContent = b.toFixed(2) + "  (α+β=" + (a + b).toFixed(2) + ")";
    $("#targetOut").textContent = Math.round(tgt * 100) + "%";
    $("#driftOut").textContent = Math.round(mu * 100) + "%";
    const N = 1500, r = rng(seed), longRun = 0.25 / Math.sqrt(252);
    const omega = longRun ** 2 * (1 - a - b);
    let s2 = longRun ** 2, prev = 0, ew = longRun ** 2;
    const R = [], SIG = [], VT = [], lam = 0.94, tgtD = tgt / Math.sqrt(252);
    for (let t = 0; t < N; t++) {
      s2 = omega + a * prev * prev + b * s2;
      const sig = Math.sqrt(s2), eps = sig * gauss(r), ret = mu / 252 - 0.5 * s2 + eps;
      const w = Math.min(3, tgtD / Math.sqrt(ew));
      R.push(ret); VT.push(w * ret); SIG.push(sig);
      ew = lam * ew + (1 - lam) * ret * ret;
      prev = eps;
    }
    sim = { R, VT, SIG, bh: stats(R), vt: stats(VT) };
    simReady = true;
    drawSim();
    const k = (l, v) => `<div class="kpi"><span>${l}</span><b>${v}</b></div>`;
    const pct = (x) => (x * 100).toFixed(1) + "%";
    $("#kpis").innerHTML = k("Sharpe · buy &amp; hold", sim.bh.sharpe.toFixed(2)) + k("Sharpe · vol-targeted", sim.vt.sharpe.toFixed(2)) +
      k("Max drawdown · B&amp;H", pct(sim.bh.mdd)) + k("Max drawdown · VT", pct(sim.vt.mdd));
  }
  function drawSim() {
    const c = $("#simChart");
    if (!sim || !c.offsetWidth) return;
    const dpr = devicePixelRatio || 1, W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dark = root.dataset.theme === "dark";
    const cum = (arr) => { let s = 0; return arr.map((x) => (s += x)); };
    const A = cum(sim.R), B = cum(sim.VT);
    const lo = Math.min(0, ...A, ...B), hi = Math.max(0, ...A, ...B);
    const pad = { l: 44, r: 12, t: 14, b: 24 };
    const x = (i) => pad.l + (i / (A.length - 1)) * (W - pad.l - pad.r);
    const y = (v) => pad.t + (1 - (v - lo) / (hi - lo || 1)) * (H - pad.t - pad.b);
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillStyle = dark ? "#8590a0" : "#7a8592";
    ctx.strokeStyle = dark ? "rgba(255,255,255,.08)" : "rgba(31,42,55,.08)";
    for (let g = 0; g <= 4; g++) {
      const v = lo + ((hi - lo) * g) / 4, yy = y(v);
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
      ctx.fillText(v.toFixed(2), 6, yy + 4);
    }
    ctx.fillText("Trading days →", W - pad.r - 90, H - 6);
    const sMax = Math.max(...sim.SIG);
    ctx.beginPath();
    sim.SIG.forEach((s, i) => { const yy = H - pad.b - (s / sMax) * (H - pad.t - pad.b) * 0.28; i ? ctx.lineTo(x(i), yy) : ctx.moveTo(x(i), yy); });
    ctx.lineTo(x(sim.SIG.length - 1), H - pad.b); ctx.lineTo(x(0), H - pad.b); ctx.closePath();
    ctx.fillStyle = dark ? "rgba(166,210,176,.18)" : "rgba(111,156,124,.18)"; ctx.fill();
    const line = (arr, col) => { ctx.beginPath(); arr.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)))); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); };
    line(A, dark ? "#9cc4ea" : "#5f8fbd");
    line(B, dark ? "#f0a87c" : "#c8774b");
  }
  ["alpha", "beta", "target", "drift"].forEach((id) => $("#" + id).addEventListener("input", runSim));
  $("#reroll").addEventListener("click", () => { seed = Math.floor(Math.random() * 1e9); runSim(); });
  addEventListener("resize", () => simReady && drawSim());

  /* =========================================================
     Ask-my-agent: site search → web (Wikipedia, DuckDuckGo) → LLM (Pollinations.ai)
     ========================================================= */
  const STOP = new Set("a an the and or of to in on for with is are was were be been it its this that these those what which who whom how why when where do does did can could would should will about her his she he you your i me my we our they their them from by as at into than then there here any some tell explain please give show list".split(" "));
  const stem = (w) => w.length > 4 ? w.replace(/(ies|ing|ed|es|s)$/, "") : w;
  const tokens = (s) => (String(s).toLowerCase().match(/[a-z0-9^]+/g) || []).filter((w) => !STOP.has(w) && w.length > 1).map(stem);

  // Build a small search index over the site and blog.
  const DOCS = [];
  const addDoc = (title, text, go, kind) => DOCS.push({ title, text: strip(text).replace(/\s+/g, " ").replace(/\.\s*\./g, ".").trim(), go, kind });
  const sentence = (s) => { s = String(s || "").trim(); return s && !/[.!?:]$/.test(s) ? s + "." : s; };
  POSTS.forEach((p) => addDoc(p.title, [
    sentence(p.card), "Key numbers: " + sentence((p.chips || []).join(", ")),
    ...p.sections.map((s) => [s.h ? s.h + ":" : "", sentence(s.p), ...(s.list || []).map(sentence), s.table ? s.table.rows.map((r) => sentence(r.join(", "))).join(" ") : ""].join(" ")),
    `Series: ${SERIES[p.series].name}.`
  ].join(" "), "post/" + p.id, "Blog"));
  addDoc("What Zafiirah works on now (her job and current work)", "Zafiirah Hosenie is a Senior Research Scientist at Microsoft in the Teams AI Lab, UK. Her current work is vision-language model (VLM) and multimodal LLM evaluation for meeting intelligence using real meeting video; enrollment quality scoring and outlier metrics for meeting-room devices; and face identity and multi-person tracking metrics. Before that, at the Microsoft Mixed Reality & AI Lab in Cambridge, she worked on 3D Gaussian splats, splat compression with vector quantisation, and avatar technology such as auto-generated avatars (VoluMe, ICCV 2025; Hairmony, SIGGRAPH Asia 2024). Her PhD was in machine learning for astronomy at the University of Manchester. Outside work she is learning quantitative trading and is interested in agentic evaluation.", "research/now", "Page");
  S.timeline.forEach((t) => addDoc(`${t.role}, ${t.org}`, `${t.yr}. ${t.role} at ${t.org}. ${t.summary} ${t.points.join(" ")}`, "journey/story", "Experience"));
  S.pubs.forEach((p) => addDoc(p.t, `${p.t}. ${p.v} ${p.y}. Authors: ${p.a}. ${p.abs}`, "research/pubs", "Publication"));
  S.awards.forEach((a) => addDoc(a.t, `${a.y}. ${a.t}. ${a.d}`, "impact/awards", "Award"));
  S.mentorship.concat(S.events).forEach((m) => addDoc(m.t, `${m.tag}. ${m.t}. ${m.d}`, "impact/mentorship", "Community"));
  $$(".panel").forEach((panel) => {
    const subs = $$(".subpanel", panel);
    const title = (panel.querySelector("h2") || {}).textContent || panel.id;
    if (!subs.length) addDoc(title, panel.textContent, panel.id, "Page");
    subs.forEach((sp) => {
      if (sp.querySelector(".post-grid, #pubGrid, #repoGrid, #awardGrid, #mentorGrid, #eventGrid")) return;
      const lbl = ($(`.subtabs[data-group="${sp.dataset.group}"] .subtab[data-sub="${sp.dataset.sub}"]`) || {}).textContent || "";
      addDoc(`${title}: ${lbl}`, sp.textContent, `${sp.dataset.group}/${sp.dataset.sub}`, "Page");
    });
  });
  addDoc("Contact Zafiirah", "Contact Zafiirah Hosenie by email zafiirah.hosenie@gmail.com, LinkedIn in/zafiirah-hosenie, GitHub Zafiirah13, X/Twitter @ZHosenie. Based in the UK, originally from Mauritius. Open to conversations, speaking and mentoring.", "contact", "Page");
  DOCS.forEach((d) => { d.tok = tokens(d.title + " " + d.title + " " + d.text); d.set = new Set(d.tok); });
  const DF = {};
  DOCS.forEach((d) => d.set.forEach((t) => (DF[t] = (DF[t] || 0) + 1)));
  const idf = (t) => Math.log(1 + DOCS.length / (DF[t] || 0.5));

  function search(q, k = 3) {
    const qt = [...new Set(tokens(q))];
    if (!qt.length) return [];
    return DOCS.map((d) => {
      let s = 0;
      const titleTok = new Set(tokens(d.title));
      for (const t of qt) {
        const tf = d.tok.filter((x) => x === t).length;
        if (tf) s += idf(t) * (1 + Math.log(tf)) + (titleTok.has(t) ? idf(t) : 0);
      }
      return { d, s: s / Math.sqrt(qt.length) };
    }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, k);
  }
  function snippet(text, q, max = 320) {
    const qt = new Set(tokens(q));
    const sents = text.match(/[^.!?]+[.!?]*/g) || [text];
    const scored = sents.map((s, i) => ({ s: s.trim(), i, v: tokens(s).filter((t) => qt.has(t)).length }));
    const best = scored.slice().sort((a, b) => b.v - a.v)[0] || scored[0];
    let out = best.s, j = best.i + 1;
    while (out.length < max * 0.6 && j < sents.length) out += " " + sents[j++].trim();
    return out.length > max ? out.slice(0, max).replace(/\s\S*$/, "") + "…" : out;
  }

  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
  async function wikipedia(q) {
    const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=1&prop=extracts|info&exintro=1&explaintext=1&exsentences=3&inprop=url&format=json&origin=*&gsrsearch=" + encodeURIComponent(q);
    const j = await withTimeout(fetch(url).then((r) => r.json()), 6000);
    const pages = j && j.query && j.query.pages;
    if (!pages) return null;
    const p = Object.values(pages)[0];
    return p && p.extract ? { title: p.title, text: p.extract, url: p.fullurl, src: "Wikipedia" } : null;
  }
  async function duck(q) {
    const j = await withTimeout(fetch("https://api.duckduckgo.com/?format=json&no_html=1&skip_disambig=1&q=" + encodeURIComponent(q)).then((r) => r.json()), 5000);
    const text = j && (j.Answer || j.AbstractText || j.Definition);
    return text ? { title: j.Heading || q, text, url: j.AbstractURL || j.DefinitionURL || "https://duckduckgo.com/?q=" + encodeURIComponent(q), src: j.AbstractSource || "DuckDuckGo" } : null;
  }
  async function webSearch(q) {
    const clean = q.replace(/\b(what|who|how|why|is|are|does|do|can|you|tell|me|about|explain|the|a|an)\b/gi, " ").replace(/[?!.]/g, " ").replace(/\s+/g, " ").trim() || q;
    const res = await Promise.allSettled([duck(clean), wikipedia(clean)]);
    return res.map((r) => (r.status === "fulfilled" ? r.value : null)).filter(Boolean);
  }

  let lastLLM = 0;
  const LLM_GAP = 46000;
  const history_ = [];
  async function llm(q, local, web) {
    if (Date.now() - lastLLM < LLM_GAP) throw new Error("cooldown");
    lastLLM = Date.now();
    const site = local.map((r, i) => `[S${i + 1}] ${r.d.title} (${r.d.kind}): ${r.d.text.slice(0, i === 0 ? 2000 : 1400)}`).join("\n");
    const webCtx = web.map((w, i) => `[W${i + 1}] ${w.src}, ${w.title}: ${w.text.slice(0, 700)}`).join("\n");
    const sys = "You are the friendly assistant on Dr Zafiirah Hosenie's personal website. She is a Senior Research Scientist at Microsoft (Teams AI Lab) working on vision-language model (VLM) evaluation; previously Gaussian splats and avatars at Microsoft's Mixed Reality & AI Lab; PhD in machine learning for astronomy (University of Manchester); from Mauritius; learning quantitative trading; interested in agentic evaluation. " +
      "SITE CONTEXT contains search results from her website and blog: treat it as accurate information about her and use the numbers in it. " +
      "Rules: Answer in at most 90 words, in plain, simple English. For questions about Zafiirah, her work, research or blog, use ONLY facts, methods and numbers stated in SITE CONTEXT; never add techniques, numbers or details that are not there. Keep her own results separate from results reported by papers or books she summarises. Only if it truly does not cover the question, say so briefly and suggest the Contact tab. For general questions, use WEB CONTEXT and your general knowledge. Never use em dashes or en dashes. No markdown headings. Do not mention 'context'.";
    const body = {
      model: "openai", private: true, referrer: "zafiirah-website", temperature: 0.2,
      messages: [{ role: "system", content: sys }, ...history_.slice(-4), { role: "user", content: `SITE CONTEXT:\n${site || "(none)"}\n\nWEB CONTEXT:\n${webCtx || "(none)"}\n\nQUESTION: ${q}` }]
    };
    const r = await withTimeout(fetch("https://text.pollinations.ai/openai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }), 40000);
    if (!r.ok) { if (r.status === 402 || r.status === 429) lastLLM = Date.now(); throw new Error("llm " + r.status); }
    const j = await r.json();
    const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    if (!text) throw new Error("empty");
    history_.push({ role: "user", content: q }, { role: "assistant", content: text });
    return text;
  }
  const tidy = (t) => esc(String(t).replace(/\s*[\u2014\u2013]\s*/g, ", ").replace(/^#+\s*/gm, "").trim())
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");

  const INTENTS = [
    { re: /^\s*(hi|hello|hey|hiya|bonjour|salut|good (morning|afternoon|evening))\b[\s!.?]*$/i, a: "Hi! 👋 I'm Zafiirah's agent. Ask me about her work, research and blog, or any general question. I search this site, Wikipedia and the web." },
    { re: /\b(contact|email|e-mail|hire|reach|linkedin|get in touch)\b/i, a: "You can email <a href='mailto:zafiirah.hosenie@gmail.com'>zafiirah.hosenie@gmail.com</a> or connect on <a href='https://www.linkedin.com/in/zafiirah-hosenie' target='_blank' rel='noopener'>LinkedIn</a>. <a data-goto='contact'>All links →</a>" },
    { re: /\bklopp|quote|motto\b/i, a: "\u201CIt's not important what people think when you come in, it's much more important what people think when you leave.\u201D Jürgen Klopp. It's Zafiirah's guiding principle." },
    { re: /\b(where\b.*\b(from|born|grow|grew|live|based|located)|nationality|mauritian?)\b/i, a: "Zafiirah is from Mauritius 🌴. She studied in Mauritius and South Africa, did her PhD in Manchester, and now works for Microsoft in the UK. <a data-goto='journey/story'>Her journey →</a>" },
    { re: /\b(are you (a bot|an ai|real|human)|how do you work|what are you)\b/i, a: "I'm a small agent: I search this website and blog, look things up on Wikipedia and DuckDuckGo, then (when available) ask a free AI model, Pollinations.ai, to write a short answer grounded in what I found." }
  ];
  const personal = /\b(she|her|hers|zafiirah|hosenie|you|your|yours|blog|website|site|post)\b/i;

  async function answer(q) {
    const intent = INTENTS.find((x) => x.re.test(q));
    if (intent) return { html: intent.a };
    const local = search(q, 3);
    const strongLocal = local.length && local[0].s > 3.2;
    const aboutHer = personal.test(q);
    let web = [];
    if (!aboutHer || !strongLocal) { try { web = await webSearch(q); } catch (e) { web = []; } }
    const useLocal = aboutHer || strongLocal ? local : local.filter((r) => r.s > 3.2);
    const srcs = useLocal.slice(0, 2).map((r) => `<a data-goto="${r.d.go}">${esc(r.d.kind)}: ${esc(r.d.title.length > 42 ? r.d.title.slice(0, 40) + "…" : r.d.title)}</a>`)
      .concat(web.slice(0, 2).map((w) => `<a href="${w.url}" target="_blank" rel="noopener">${esc(w.src)}: ${esc(w.title)}</a>`))
      .concat([`<a href="https://duckduckgo.com/?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">Search the web ↗</a>`]);
    const srcHTML = `<div class="srcs">${srcs.join("")}</div>`;
    try {
      const text = await llm(q, useLocal, web);
      return { html: `<p>${tidy(text)}</p>${srcHTML}` };
    } catch (e) {
      console.warn("Agent AI writer unavailable:", e && e.message);
      const parts = [];
      if (useLocal.length) parts.push(`<p><b>From the site:</b> ${esc(snippet(useLocal[0].d.text, q))}</p>`);
      if (web.length) parts.push(`<p><b>From ${esc(web[0].src)}:</b> ${esc(web[0].text.length > 360 ? web[0].text.slice(0, 360).replace(/\s\S*$/, "") + "…" : web[0].text)}</p>`);
      if (!parts.length) parts.push("<p>I couldn't find that on the site or in a quick web lookup. Try rephrasing, or use the web search link below.</p>");
      if (String(e.message) === "cooldown") parts.push('<p class="muted" style="font-size:.74rem">Quick mode: the free AI writer allows one reply every 45 seconds, so here are my search results.</p>');
      return { html: parts.join("") + srcHTML };
    }
  }

  const SUGGEST = ["What does she work on?", "Explain Gaussian splat compression", "Her quant results", "What is pass^k?", "What is a GARCH model?"];
  const log = $("#agentLog"), agent = $("#agent"), fab = $("#agentFab");
  const say = (html, who = "bot") => { const d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
  let busy = false;
  async function ask(q) {
    q = q.trim();
    if (!q || busy) return;
    busy = true;
    say(esc(q), "me");
    const typing = say('<span class="typing"><span></span><span></span><span></span></span> <span class="muted" style="font-size:.76rem">Searching the site and web…</span>');
    try {
      const r = await answer(q);
      typing.innerHTML = r.html;
    } catch (e) {
      typing.innerHTML = "Sorry, something went wrong. Please try again.";
    }
    log.scrollTop = log.scrollHeight;
    busy = false;
  }
  log.addEventListener("click", (e) => { if (e.target.closest("[data-goto]") && innerWidth < 700) toggleAgent(false); });
  let greeted = false;
  function toggleAgent(force) {
    const on = force ?? !agent.classList.contains("open");
    agent.classList.toggle("open", on); fab.setAttribute("aria-expanded", String(on));
    if (on && !greeted) { greeted = true; say(INTENTS[0].a); }
    if (on) $("#agentInput").focus();
  }
  fab.addEventListener("click", () => toggleAgent());
  $("#agentClose").addEventListener("click", () => toggleAgent(false));
  $("#agentSuggest").innerHTML = SUGGEST.map((s) => `<button type="button">${esc(s)}</button>`).join("");
  $("#agentSuggest").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
  $("#agentForm").addEventListener("submit", (e) => { e.preventDefault(); const i = $("#agentInput"); ask(i.value); i.value = ""; });
  window.__zhAgent = { search, answer };

  /* ---------------- Init ---------------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  go(location.hash.slice(1) || "home", false);
  const top0 = () => { if (!reader.classList.contains("open")) window.scrollTo(0, 0); };
  top0(); addEventListener("load", () => setTimeout(top0, 0));
})();
