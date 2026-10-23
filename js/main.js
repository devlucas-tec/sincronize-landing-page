/* ==========================================================================
   MAIN — comportamentos da página (menu, header, animações, contadores…)
   Cada bloco é independente: remova ou ajuste sem afetar os demais.
   ========================================================================== */
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Menu mobile ---------- */
  const toggle = $(".menu-toggle");
  const menu = $("#menuMobile");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
    window.matchMedia("(min-width: 1200px)").addEventListener("change", (e) => e.matches && setMenu(false));
  }

  /* ---------- 2. Header compacto ao rolar ---------- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Link ativo no menu conforme a seção visível ---------- */
  const navLinks = $$(".nav a[href^='#']");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- 4. Revelar elementos ao rolar (com cascata em [data-stagger]) ---------- */
  $$("[data-stagger]").forEach((group) => {
    $$("[data-reveal]", group).forEach((el, i) => el.style.setProperty("--delay", `${i * 90}ms`));
  });

  const revealer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  $$("[data-reveal]").forEach((el) => revealer.observe(el));

  /* ---------- 5. Contadores animados: data-count-to="48750" data-prefix="R$ " ---------- */
  const formatNumber = (n) => Math.round(n).toLocaleString("pt-BR");

  function animateCount(el) {
    const target = Number(el.dataset.countTo);
    const prefix = el.dataset.prefix || "";
    if (reducedMotion) return (el.textContent = prefix + formatNumber(target));

    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = prefix + formatNumber(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count-to]").forEach((el) => counterObs.observe(el));

  /* ---------- 6. Contagem regressiva dos leilões: data-countdown="segundos" ---------- */
  const timers = $$("[data-countdown]").map((el) => ({ el, end: Date.now() + Number(el.dataset.countdown) * 1000 }));

  function renderTimers() {
    const now = Date.now();
    timers.forEach(({ el, end }) => {
      const s = Math.max(0, Math.round((end - now) / 1000));
      const p = (n) => String(n).padStart(2, "0");
      el.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
    });
  }
  if (timers.length) {
    renderTimers();
    setInterval(renderTimers, 1000);
  }

  /* ---------- 7. Carrosséis ---------- */
  $$("[data-carousel]").forEach((el) => new window.FocusCarousel(el));

  /* ---------- 8. Abas do Brechó Solidário (clique e setas ← → do teclado) ---------- */
  $$("[role='tablist']").forEach((list) => {
    const tabs = $$("[role='tab']", list);

    function select(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        $(`#${t.getAttribute("aria-controls")}`).hidden = !on;
      });
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  /* ---------- 9. Ano atual no rodapé ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
