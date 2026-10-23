/* ==========================================================================
   FocusCarousel — carrossel com foco no card central.
   Reutilizável: qualquer elemento com [data-carousel] vira um carrossel.

   Estrutura esperada:
     [data-carousel]               (opcionais: data-autoplay="5000"  data-loop)
       [data-track] > .carousel__slide …
       [data-prev] / [data-next]   (quantos quiser — ex.: laterais + barra mobile)
       [data-current] [data-total] [data-progress]   (opcionais)

   O JS só calcula posições e escreve variáveis CSS (--o, --ao) em cada slide;
   todo o visual (escala, opacidade, rotação, desfoque) fica no CSS.
   ========================================================================== */
class FocusCarousel {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector("[data-track]");
    const originals = [...this.track.children].filter((el) => el.classList.contains("carousel__slide"));
    if (!originals.length) return;

    this.count = originals.length;
    this.loop = root.hasAttribute("data-loop") && this.count > 2;
    this.slides = this.loop ? this.createClones(originals) : originals;

    this.ui = {
      current: root.querySelector("[data-current]"),
      total: root.querySelector("[data-total]"),
      progress: root.querySelector("[data-progress]"),
    };
    this.index = -1;
    this.ticking = false;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.bind();
    // No modo loop começamos na 1ª cópia "real" (meio da lista), com vizinhos dos dois lados
    if (this.loop) this.jumpTo(this.count);
    this.update();
    if (this.ui.total) this.ui.total.textContent = String(this.count).padStart(2, "0");
    this.setupAutoplay(Number(root.dataset.autoplay) || 0);
  }

  /** Duplica os slides antes e depois para criar um loop infinito sem "salto" visível. */
  createClones(originals) {
    const clone = (el) => {
      const c = el.cloneNode(true);
      c.classList.add("is-clone");
      c.setAttribute("aria-hidden", "true");
      return c;
    };
    const before = originals.map(clone);
    const after = originals.map(clone);
    this.track.prepend(...before);
    this.track.append(...after);
    return [...before, ...originals, ...after];
  }

  /** Posição de scroll que centraliza o slide i. */
  leftFor(i) {
    const s = this.slides[i];
    return s.offsetLeft + s.offsetWidth / 2 - this.track.clientWidth / 2;
  }

  /** Move instantaneamente (sem animação nem snap) — usado para "teleportar" entre cópias. */
  jumpTo(i) {
    this.track.classList.add("is-jumping");
    this.track.scrollLeft = this.leftFor(i);
    this.update();
    void this.track.offsetWidth; // força o reflow antes de reativar o snap
    this.track.classList.remove("is-jumping");
  }

  /** Quando o scroll para numa cópia, volta para o slide equivalente do bloco central. */
  normalize() {
    if (!this.loop) return;
    if (this.index < this.count) this.jumpTo(this.index + this.count);
    else if (this.index >= this.count * 2) this.jumpTo(this.index - this.count);
  }

  bind() {
    this.root.querySelectorAll("[data-prev]").forEach((b) => b.addEventListener("click", () => this.step(-1, true)));
    this.root.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => this.step(1, true)));

    this.track.addEventListener("scroll", () => {
      this.requestUpdate();
      clearTimeout(this.settleTimer);
      this.settleTimer = setTimeout(() => this.normalize(), 160);
    }, { passive: true });
    window.addEventListener("resize", () => {
      if (this.index >= 0) this.jumpTo(this.index);
    });

    // Clicar num card lateral centraliza-o (em vez de seguir o link)
    this.track.addEventListener("click", (e) => {
      const slide = e.target.closest(".carousel__slide");
      if (!slide || slide.classList.contains("is-active")) return;
      e.preventDefault();
      this.goTo(this.slides.indexOf(slide), true);
    });

    this.track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); this.step(1, true); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); this.step(-1, true); }
    });

    // Qualquer interação manual encerra o autoplay
    ["pointerdown", "wheel", "touchstart"].forEach((evt) =>
      this.track.addEventListener(evt, () => this.stopAutoplay(), { passive: true })
    );
  }

  requestUpdate() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.update(); this.ticking = false; });
  }

  /** Calcula a distância de cada slide ao centro e aplica as variáveis CSS. */
  update() {
    const trackRect = this.track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    const step = this.slides[0].offsetWidth + parseFloat(getComputedStyle(this.track).columnGap || 0);

    let closest = 0;
    let min = Infinity;

    this.slides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const o = (r.left + r.width / 2 - center) / step;
      const ao = Math.min(Math.abs(o), 2);
      slide.style.setProperty("--o", Math.max(-2, Math.min(2, o)).toFixed(3));
      slide.style.setProperty("--ao", ao.toFixed(3));
      slide.style.zIndex = String(100 - Math.round(ao * 10));
      if (Math.abs(o) < min) { min = Math.abs(o); closest = i; }
    });

    if (closest !== this.index) this.setActive(closest);
  }

  setActive(i) {
    this.index = i;
    this.slides.forEach((s, n) => {
      const active = n === i;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-current", active ? "true" : "false");
      // Só o card em foco é alcançável pelo Tab
      s.querySelectorAll("a, button").forEach((el) => (el.tabIndex = active ? 0 : -1));
    });
    const logical = i % this.count;
    if (this.ui.current) this.ui.current.textContent = String(logical + 1).padStart(2, "0");
    if (this.ui.progress) this.ui.progress.style.setProperty("--p", (logical + 1) / this.count);
  }

  goTo(i, user = false) {
    const n = this.slides.length;
    const target = this.loop ? Math.max(0, Math.min(n - 1, i)) : ((i % n) + n) % n; // sem loop: volta ao início
    this.track.scrollTo({ left: this.leftFor(target), behavior: this.reducedMotion ? "auto" : "smooth" });
    if (user) this.stopAutoplay();
  }

  step(dir, user = false) {
    this.goTo(this.index + dir, user);
  }

  /* ---------- Autoplay: pausa no hover/foco, fora da tela ou aba oculta ---------- */
  setupAutoplay(ms) {
    if (!ms || this.reducedMotion) return;
    this.autoplay = { ms, timer: null, stopped: false, visible: false, hover: false };

    const sync = () => {
      const a = this.autoplay;
      const shouldRun = !a.stopped && a.visible && !a.hover && !document.hidden;
      if (shouldRun && !a.timer) a.timer = setInterval(() => this.step(1), a.ms);
      if (!shouldRun && a.timer) { clearInterval(a.timer); a.timer = null; }
    };
    this.syncAutoplay = sync;

    new IntersectionObserver(([entry]) => { this.autoplay.visible = entry.isIntersecting; sync(); }, { threshold: 0.4 })
      .observe(this.root);
    this.root.addEventListener("mouseenter", () => { this.autoplay.hover = true; sync(); });
    this.root.addEventListener("mouseleave", () => { this.autoplay.hover = false; sync(); });
    this.root.addEventListener("focusin", () => this.stopAutoplay());
    document.addEventListener("visibilitychange", sync);
  }

  stopAutoplay() {
    if (!this.autoplay) return;
    this.autoplay.stopped = true;
    this.syncAutoplay();
  }
}

window.FocusCarousel = FocusCarousel;
