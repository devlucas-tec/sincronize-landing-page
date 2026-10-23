/* ==========================================================================
   RENDER — transforma os dados de js/data.js em HTML.
   Cada função recebe um item e devolve o markup do card.
   ========================================================================== */
(function () {
  const { SITE } = window;

  const escapeHTML = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const icon = (name, extra = "") => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const waLink = (message) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

  const brl = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /** "Paróquia São João Paulo II" → "SJ" (ignora palavras genéricas) */
  const STOPWORDS = /^(de|da|do|das|dos|e|ong|casa|paróquia|centro|projeto|lar)$/i;
  const initials = (name) => {
    const words = name.replace(/[()]/g, "").split(/\s+/).filter((w) => !STOPWORDS.test(w));
    const pick = words.length ? words : name.split(/\s+/);
    return pick.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  };

  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- Card de instituição ---------- */
  function institutionCard(inst, index) {
    const cat = SITE.categorias[inst.categoria] || SITE.categorias.social;
    const avatar = inst.logo
      ? `<img src="${inst.logo}" alt="" width="76" height="76" loading="lazy" />`
      : `<span aria-hidden="true">${initials(inst.nome)}</span>`;

    return `
      <article class="carousel__slide inst-card" data-cat="${inst.categoria}" aria-label="${escapeHTML(inst.nome)}">
        <div class="inst-card__frame">
          <div class="inst-card__cover">
            <span class="inst-card__tag">${icon(cat.icone)}${cat.rotulo}</span>
            <span class="inst-card__index">${pad(index + 1)}</span>
            ${icon(cat.icone)}
          </div>
          <div class="inst-card__avatar">${avatar}</div>
          <div class="inst-card__body">
            <h3>${escapeHTML(inst.nome)}</h3>
            <p>${escapeHTML(inst.descricao)}</p>
          </div>
          <div class="inst-card__cta">
            <a class="btn btn--block" href="${waLink(SITE.mensagens.doar(inst.nome))}" target="_blank" rel="noopener noreferrer">
              Quero doar ${icon("arrow-up-right", "icon--diag")}
            </a>
          </div>
        </div>
      </article>`;
  }

  /* ---------- Card de leilão ---------- */
  function auctionCard(item) {
    const badge = item.aoVivo
      ? `<span class="pill pill--live"><span class="dot-pulse"></span>AO VIVO</span>`
      : `<span class="pill pill--timer">${icon("clock-3")}Termina em <span data-countdown="${item.terminaEmSegundos}">--:--:--</span></span>`;

    return `
      <article class="auction-card" data-reveal>
        <div class="auction-card__media">
          <img src="${item.imagem}" alt="${escapeHTML(item.alt)}" loading="lazy" width="900" height="600" />
          ${badge}
        </div>
        <div class="auction-card__body">
          <h3>${escapeHTML(item.titulo)}</h3>
          <p class="auction-card__benef">${icon("building-2")}Beneficia: ${escapeHTML(item.beneficia)}</p>
          <div class="auction-card__line"></div>
          <div class="auction-card__stats">
            <dl><dt>Lance atual</dt><dd class="auction-card__price">${brl(item.lanceAtual)}</dd></dl>
            <dl><dt>Lances feitos</dt><dd class="auction-card__bids">${item.lances}</dd></dl>
          </div>
          <a class="btn btn--primary btn--block" href="${waLink(SITE.mensagens.leilao)}" target="_blank" rel="noopener noreferrer">
            ${icon("gavel")}Dar lance ${icon("arrow-right", "icon--move")}
          </a>
        </div>
      </article>`;
  }

  /* ---------- Brechó Solidário: abas (uma por instituição) + vitrine ---------- */
  const findInstitution = (nome) => SITE.instituicoes.find((i) => i.nome === nome) || { nome, categoria: "social" };

  const instAvatar = (inst) =>
    inst.logo
      ? `<img src="${inst.logo}" alt="" width="48" height="48" loading="lazy" />`
      : `<span aria-hidden="true">${initials(inst.nome)}</span>`;

  const percent = (b) => Math.min(100, Math.round((b.arrecadado / b.meta) * 100));

  function thriftTab(b, index) {
    const inst = findInstitution(b.instituicao);
    const selected = index === 0;
    return `
      <button class="thrift-tab" type="button" role="tab" id="brecho-tab-${index}" aria-controls="brecho-painel-${index}"
        aria-selected="${selected}" tabindex="${selected ? 0 : -1}" data-cat="${inst.categoria}">
        <span class="thrift-tab__avatar">${instAvatar(inst)}</span>
        <span class="thrift-tab__text">
          <strong>${escapeHTML(inst.nome)}</strong>
          <small>${b.itens.length} peças · ${percent(b)}% da meta</small>
        </span>
      </button>`;
  }

  function thriftItem(item, b) {
    const tipo = SITE.tiposBrecho[item.tipo] || SITE.tiposBrecho.roupa;
    return `
      <article class="thrift-item" data-tipo="${item.tipo}" data-reveal>
        <div class="thrift-item__cover">
          <span class="thrift-item__tag">${tipo.rotulo}</span>
          ${icon(tipo.icone)}
        </div>
        <div class="thrift-item__body">
          <h4>${escapeHTML(item.titulo)}</h4>
          <p>${escapeHTML(item.detalhe)} · ${escapeHTML(item.estado)}</p>
          <div class="thrift-item__foot">
            <strong>${brl(item.preco)}</strong>
            <a class="btn btn--sm btn--primary" href="${waLink(SITE.mensagens.comprarBrecho(item.titulo, b.instituicao))}"
              target="_blank" rel="noopener noreferrer" aria-label="Comprar ${escapeHTML(item.titulo)}">
              ${icon("shopping-bag")}Comprar
            </a>
          </div>
        </div>
      </article>`;
  }

  function thriftPanel(b, index) {
    const inst = findInstitution(b.instituicao);
    const pct = percent(b);
    return `
      <div class="thrift-panel" role="tabpanel" id="brecho-painel-${index}" aria-labelledby="brecho-tab-${index}" ${index === 0 ? "" : "hidden"}>
        <aside class="thrift-campaign" data-cat="${inst.categoria}">
          <div class="thrift-campaign__head">
            <span class="thrift-tab__avatar">${instAvatar(inst)}</span>
            <div>
              <small>Brechó da instituição</small>
              <h3>${escapeHTML(inst.nome)}</h3>
            </div>
          </div>
          <p class="thrift-campaign__goal">${icon("target")}Campanha: <strong>${escapeHTML(b.campanha)}</strong></p>
          <p class="thrift-campaign__dest">${escapeHTML(b.destino)}</p>

          <div class="thrift-progress">
            <div class="thrift-progress__nums">
              <strong>${brl(b.arrecadado)}</strong>
              <span>de ${brl(b.meta)}</span>
            </div>
            <div class="thrift-progress__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"
              aria-label="Meta da campanha: ${pct}% arrecadado">
              <span style="--p: ${pct}%"></span>
            </div>
            <div class="thrift-progress__meta">
              <span>${pct}% da meta</span>
              <span>${b.pecasVendidas} peças vendidas</span>
            </div>
          </div>

          <a class="btn btn--outline btn--block" href="${waLink(SITE.mensagens.doarBrecho(inst.nome))}" target="_blank" rel="noopener noreferrer">
            ${icon("package")}Doar peças para este brechó
          </a>
        </aside>

        <div class="thrift-grid" data-stagger>
          ${b.itens.map((item) => thriftItem(item, b)).join("")}
        </div>
      </div>`;
  }

  /* ---------- Patrocinadores ---------- */
  function sponsorLogo(p) {
    if (p.logo) return `<img src="${p.logo}" alt="${escapeHTML(p.nome)}" loading="lazy" />`;
    // Patrocinador sem logo: marca tipográfica com ícone
    return `<span class="sponsor-wordmark" style="--c: ${p.cor || "var(--navy-800)"}">${icon(p.icone || "building-2")}${escapeHTML(p.nome)}</span>`;
  }

  function sponsorMaster(p) {
    return `
      <article class="sponsor-master" data-reveal>
        <div class="sponsor-master__logo${p.fundoEscuro ? " is-dark" : ""}">${sponsorLogo(p)}</div>
        <div class="sponsor-master__body">
          <span class="sponsor-tier sponsor-tier--master">${icon("sparkles")}${SITE.cotasPatrocinio.master}</span>
          <h3>${escapeHTML(p.nome)}</h3>
          <p>${escapeHTML(p.descricao)}</p>
        </div>
      </article>`;
  }

  function sponsorTile(p) {
    return `
      <li class="sponsor-tile" data-cota="${p.cota}" data-reveal>
        <div class="sponsor-tile__logo${p.fundoEscuro ? " is-dark" : ""}">${sponsorLogo(p)}</div>
        <span class="sponsor-tier">${SITE.cotasPatrocinio[p.cota]}</span>
      </li>`;
  }

  /* ---------- Pilha de avatares do hero ---------- */
  function avatarStack(list, max = 4) {
    const colors = { paroquia: "#1f82b8", acolhimento: "#23a868", social: "#ff8a1f", saude: "#12a5a0" };
    return list
      .slice(1, max + 1)
      .map((i) => `<span style="--accent:${colors[i.categoria]}">${initials(i.nome)}</span>`)
      .join("");
  }

  /* ---------- Montagem ---------- */
  const renderers = {
    instituicoes: () => SITE.instituicoes.map(institutionCard).join(""),
    leiloes: () => SITE.leiloes.map(auctionCard).join(""),
    brechoAbas: () => SITE.brechos.map(thriftTab).join(""),
    brechoPaineis: () => SITE.brechos.map(thriftPanel).join(""),
    patrocinadoresMaster: () => SITE.patrocinadores.filter((p) => p.cota === "master").map(sponsorMaster).join(""),
    patrocinadoresGrade: () => SITE.patrocinadores.filter((p) => p.cota !== "master").map(sponsorTile).join(""),
  };

  document.querySelectorAll("[data-render]").forEach((el) => {
    const fn = renderers[el.dataset.render];
    if (fn) el.innerHTML = fn();
  });

  document.querySelectorAll("[data-avatar-stack]").forEach((el) => (el.innerHTML = avatarStack(SITE.instituicoes)));
  document.querySelectorAll("[data-count-institutions]").forEach((el) => (el.textContent = SITE.instituicoes.length));

  // Links de WhatsApp declarados no HTML: data-wa="contato" | "leilao"
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const msg = SITE.mensagens[a.dataset.wa];
    if (typeof msg === "string") a.href = waLink(msg);
  });

  window.SiteUtils = { waLink, brl, pad };
})();
