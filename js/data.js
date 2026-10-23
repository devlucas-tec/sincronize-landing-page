/* ==========================================================================
   DADOS DO SITE — edite aqui para adicionar/remover instituições e leilões.
   Não é preciso mexer no HTML: os cards são gerados automaticamente.
   ========================================================================== */
window.SITE = {
  /** Número do WhatsApp usado em todos os botões (somente dígitos, com DDI). */
  whatsapp: "5583993228124",

  /**
   * Categorias das instituições — definem cor, ícone e rótulo do card.
   * A cor de cada categoria fica em css/sections.css (.inst-card[data-cat="..."]).
   */
  categorias: {
    paroquia:    { rotulo: "Paróquia",       icone: "church" },
    acolhimento: { rotulo: "Acolhimento",    icone: "house" },
    social:      { rotulo: "Projeto social", icone: "hand-heart" },
    saude:       { rotulo: "Saúde",          icone: "heart-pulse" },
  },

  /**
   * Instituições parceiras (carrossel "Doe direto").
   * - categoria: uma das chaves acima
   * - logo (opcional): imagem quadrada; sem logo, o card mostra as iniciais
   */
  instituicoes: [
    { nome: "Casa São Domingos Sávio", categoria: "acolhimento", logo: "assets/images/avatar-casa-sao-domingos.webp",
      descricao: "Apoio a crianças e adolescentes, com acolhimento, educação e oportunidades." },
    { nome: "Paróquia São João Paulo II", categoria: "paroquia",
      descricao: "Consulte a instituição sobre campanhas e formas de contribuição." },
    { nome: "Casa da Criança Doutor João Moura", categoria: "acolhimento",
      descricao: "Saiba como apoiar as ações da instituição." },
    { nome: "Centro de Apoio e Socialização Pedacinho do Céu", categoria: "social",
      descricao: "Conheça as necessidades e formas de ajudar." },
    { nome: "Fraternidade Irmãos de Francisco", categoria: "social",
      descricao: "Descubra como contribuir com o trabalho da instituição." },
    { nome: "Fazenda do Sol", categoria: "social",
      descricao: "Consulte campanhas e necessidades atuais." },
    { nome: "Projeto de Vida Anavim (Comunidade Remidos)", categoria: "social",
      descricao: "Conheça as possibilidades de doação." },
    { nome: "Hospital da FAP", categoria: "saude",
      descricao: "Consulte os canais oficiais para conhecer as formas de apoio." },
    { nome: "Paróquia Nossa Senhora do Perpétuo Socorro", categoria: "paroquia",
      descricao: "Consulte a paróquia sobre campanhas e doações." },
    { nome: "Casa do Menino", categoria: "acolhimento",
      descricao: "Conheça as necessidades atuais." },
    { nome: "ONG Mulheres de Fé", categoria: "social",
      descricao: "Consulte a organização sobre como contribuir." },
    { nome: "ONG Abrasocial", categoria: "social",
      descricao: "Consulte os canais oficiais para doar." },
    { nome: "ONG IPCCAN", categoria: "social",
      descricao: "Conheça as formas de apoiar." },
    { nome: "Lar da Sagrada Face", categoria: "acolhimento",
      descricao: "Consulte campanhas e necessidades." },
    { nome: "Legião da Boa Vontade", categoria: "social",
      descricao: "Consulte os canais oficiais para contribuir." },
    { nome: "Casa de Apoio ISMI", categoria: "acolhimento",
      descricao: "Consulte as formas de doação." },
    { nome: "Paróquia São Francisco", categoria: "paroquia",
      descricao: "Consulte a paróquia sobre campanhas." },
    { nome: "Paróquia São Cristóvão", categoria: "paroquia",
      descricao: "Consulte a paróquia sobre doações." },
    { nome: "Santuário da Divina Misericórdia", categoria: "paroquia",
      descricao: "Conheça as ações e campanhas." },
    { nome: "Paróquia Santo Antônio", categoria: "paroquia",
      descricao: "Consulte as formas de contribuição." },
    { nome: "Paróquia São Judas Tadeu", categoria: "paroquia",
      descricao: "Conheça as necessidades atuais." },
  ],

  /**
   * Leilões demonstrativos.
   * - aoVivo: true mostra o selo "AO VIVO"; caso contrário, mostra a contagem regressiva
   * - terminaEmSegundos: tempo restante (a partir do carregamento da página)
   */
  leiloes: [
    { titulo: "Camisa Oficial Autografada", imagem: "assets/images/leilao-camisa.webp",
      alt: "Camisetas dobradas sobre mesa de madeira", beneficia: "Instituto Criança Feliz",
      lanceAtual: 1500, lances: 12, aoVivo: true },
    { titulo: "Violão Clássico", imagem: "assets/images/leilao-violao.webp",
      alt: "Violão clássico de madeira", beneficia: "Casa São Domingos Sávio",
      lanceAtual: 2300, lances: 18, terminaEmSegundos: 2 * 3600 + 15 * 60 },
    { titulo: "Obra de Arte Exclusiva", imagem: "assets/images/leilao-arte.webp",
      alt: "Obra de arte colorida emoldurada", beneficia: "Associação Esperança",
      lanceAtual: 1200, lances: 9, terminaEmSegundos: 1 * 3600 + 40 * 60 },
  ],

  /**
   * Tipos de peça do Brechó Solidário — definem ícone e cor da capa do item.
   * A cor fica em css/sections.css (.thrift-item[data-tipo="..."]).
   */
  tiposBrecho: {
    roupa:     { rotulo: "Roupa",      icone: "shirt" },
    calcado:   { rotulo: "Calçado",    icone: "footprints" },
    livro:     { rotulo: "Livro",      icone: "book-open" },
    casa:      { rotulo: "Casa",       icone: "lamp" },
    brinquedo: { rotulo: "Brinquedo",  icone: "puzzle" },
  },

  /**
   * Brechós Solidários — cada brechó pertence a UMA instituição:
   * as peças foram doadas para ela e todo o valor das vendas é revertido a ela.
   * - instituicao: precisa ter o mesmo nome usado em `instituicoes` (para puxar logo e categoria)
   * - meta / arrecadado: alimentam a barra de progresso da campanha (em R$)
   * - itens: peças à venda (tipo = uma das chaves de `tiposBrecho`)
   */
  brechos: [
    { instituicao: "Casa São Domingos Sávio",
      campanha: "Material escolar para 2027",
      destino: "A renda compra mochilas, cadernos e uniformes para as crianças atendidas.",
      meta: 6000, arrecadado: 4180, pecasVendidas: 96,
      itens: [
        { titulo: "Jaqueta jeans infantil", tipo: "roupa", detalhe: "Tam. 8", estado: "Seminova", preco: 45 },
        { titulo: "Tênis esportivo", tipo: "calcado", detalhe: "Nº 36", estado: "Ótimo estado", preco: 60 },
        { titulo: "Coleção de gibis (10 un.)", tipo: "livro", detalhe: "Kit", estado: "Bom estado", preco: 30 },
        { titulo: "Quebra-cabeça 500 peças", tipo: "brinquedo", detalhe: "Completo", estado: "Seminovo", preco: 25 },
      ] },
    { instituicao: "Lar da Sagrada Face",
      campanha: "Reforma da cozinha",
      destino: "Cada peça vendida ajuda a reformar a cozinha que prepara as refeições dos acolhidos.",
      meta: 10000, arrecadado: 3650, pecasVendidas: 58,
      itens: [
        { titulo: "Luminária de mesa vintage", tipo: "casa", detalhe: "Bivolt", estado: "Funcionando", preco: 80 },
        { titulo: "Vestido midi floral", tipo: "roupa", detalhe: "Tam. M", estado: "Seminovo", preco: 55 },
        { titulo: "Romances clássicos (5 un.)", tipo: "livro", detalhe: "Kit", estado: "Bom estado", preco: 40 },
        { titulo: "Sapato social couro", tipo: "calcado", detalhe: "Nº 41", estado: "Ótimo estado", preco: 70 },
      ] },
    { instituicao: "Casa do Menino",
      campanha: "Oficina de música",
      destino: "O valor arrecadado compra instrumentos e mantém as aulas de música dos meninos.",
      meta: 4000, arrecadado: 3320, pecasVendidas: 71,
      itens: [
        { titulo: "Camisa de time retrô", tipo: "roupa", detalhe: "Tam. G", estado: "Seminova", preco: 65 },
        { titulo: "Carrinho de controle remoto", tipo: "brinquedo", detalhe: "Com pilhas", estado: "Funcionando", preco: 50 },
        { titulo: "Jogo de xícaras de porcelana", tipo: "casa", detalhe: "6 peças", estado: "Sem defeitos", preco: 35 },
        { titulo: "Chuteira society", tipo: "calcado", detalhe: "Nº 38", estado: "Bom estado", preco: 40 },
      ] },
  ],

  /**
   * Patrocinadores — empresas que apoiam a rede Sincronize.
   * - cota: "master" (card grande com descrição) | "ouro" | "apoio" (grade de logos)
   * - logo (opcional): imagem em assets/images/; sem logo, o card mostra o nome com `icone` e `cor`
   * - fundoEscuro: true para logos claras/brancas (ex.: Microgames)
   * - descricao (opcional nas cotas ouro/apoio): frase curta exibida abaixo da logo
   * Os patrocinadores sem logo são FICTÍCIOS, apenas para demonstração.
   */
  cotasPatrocinio: {
    master: "Patrocinador master",
    ouro:   "Patrocinador ouro",
    apoio:  "Apoiador",
  },
  patrocinadores: [
    { nome: "Lourdinas", cota: "master", logo: "assets/images/sponsor-lourdinas.png",
      descricao: "Educação e valores caminhando juntos: apoia os brechós e as campanhas de material escolar da rede." },
    { nome: "Microgames", cota: "master", logo: "assets/images/sponsor-microgames.png", fundoEscuro: true,
      descricao: "Tecnologia e diversão a serviço da comunidade: apoia os leilões sociais e as oficinas para jovens." },
    { nome: "Simplifica Tecnologia", cota: "ouro", logo: "assets/images/sponsor-simplifica.png",
      descricao: "Soluções que simplificam a gestão da sua empresa, em mais de 50 segmentos." },
    { nome: "Double L 3D", cota: "ouro", logo: "assets/images/sponsor-double-l-3d.png",
      descricao: "Impressão 3D e peças personalizadas, por Laura e Lucas. Duas mentes, infinitas criações!" },
    { nome: "Vida+ Farmácias", cota: "ouro", icone: "heart-pulse", cor: "#17915a" },
    { nome: "Mercadinho Boa Vizinhança", cota: "apoio", icone: "shopping-bag", cor: "#e66d00" },
    { nome: "Ótica Visão Clara", cota: "apoio", icone: "sparkles", cor: "#9333ea" },
    { nome: "Lar Doce Imóveis", cota: "apoio", icone: "house", cor: "#a16207" },
    { nome: "Livraria Página Aberta", cota: "apoio", icone: "book-open", cor: "#12a5a0" },
  ],

  /** Mensagens pré-preenchidas do WhatsApp */
  mensagens: {
    doar: (nome) => `Olá! Quero saber como doar para ${nome}`,
    leilao: "Olá! Tenho interesse na plataforma de Leilão Social.",
    contato: "Olá! Quero conhecer a plataforma Sincronize.",
    comprarBrecho: (item, inst) => `Olá! Quero comprar "${item}" no Brechó Solidário da ${inst}.`,
    doarBrecho: (inst) => `Olá! Quero doar peças para o Brechó Solidário da ${inst}.`,
    brecho: "Olá! Quero criar um Brechó Solidário para a minha instituição na Sincronize.",
    patrocinio: "Olá! Minha empresa quer ser patrocinadora da Sincronize.",
  },
};
