# Sincronize — Tecnologia em Tempo Real

Site institucional da Sincronize, uma startup de soluções Web para a gestão de ONGs e instituições filantrópicas. O site apresenta a plataforma, aproxima doadores das instituições parceiras e divulga o Leilão Social.

Projeto desenvolvido por estudantes do Curso Técnico em Informática das Lourdinas (TECINFO) para o DLEI — Desafio Lourdinas de Empreendedorismo.

Tecnologias: HTML5, CSS3 e JavaScript, sem frameworks e sem etapa de build.

A **Sincronize** é uma empresa focada em ajudar instituições de caridade, ONGs, paróquias e projetos sociais
em duas frentes:

- **Gerar renda.** A Sincronize cria canais de arrecadação para que as instituições recebam recursos
  e consigam se desenvolver.
- **Organizar a gestão.** A plataforma de gerenciamento reúne atividades, projetos, doações, pessoas
  e resultados em um só lugar, em tempo real.

Este repositório contém o **site institucional** da Sincronize.

## Como a Sincronize ajuda as instituições

### Geração de renda

| Iniciativa             | Como funciona |
|------------------------|---------------|
| **Doe direto**         | Vitrine das instituições parceiras: o visitante escolhe uma causa e fala direto com a instituição. |
| **Leilão Social**      | As instituições leiloam itens especiais recebidos em doação, com lances em tempo real. |
| **Brechó Solidário**   | Cada brechó pertence a uma instituição. As peças doadas a ela são vendidas online e todo o valor vai para uma campanha específica, com meta e progresso visíveis. |
| **Patrocinadores**     | Empresas apoiam a rede em cotas master, ouro e apoio, e ajudam a manter as iniciativas sem custo para as instituições. |

### Organização e gestão

A plataforma de gerenciamento da Sincronize simplifica a rotina das instituições:

- gestão de projetos e atividades;
- controle de doações financeiras e materiais;
- cadastro de pessoas, assistidos e voluntários;
- relatórios de impacto e indicadores em tempo real;
- conformidade com a LGPD.

## Sobre este site

Site estático (HTML + CSS + JS puro), sem build e sem dependências de CDN além das fontes do Google.
Abra o `index.html` direto no navegador ou sirva a pasta com qualquer servidor estático.

Quase todo o conteúdo (instituições, leilões, brechós, patrocinadores e mensagens de WhatsApp) fica em
`js/data.js`. Na maioria das alterações não é preciso mexer no HTML.

## Estrutura

```
index.html            → marcação das seções (header, hero, parceiros, leilão, brechó, patrocinadores, soluções, sobre, footer)
css/
  tokens.css          → cores, fontes, espaçamentos, sombras e curvas de animação (identidade visual)
  base.css            → reset, tipografia global, .container e animações de entrada (data-reveal)
  components.css      → botões, pílulas, cabeçalho de seção, carrossel, redes sociais
  sections.css        → estilos específicos de cada seção, na mesma ordem do HTML
js/
  data.js             → CONTEÚDO: WhatsApp, instituições, categorias, leilões, brechós, patrocinadores e mensagens
  render.js           → gera os cards a partir de data.js
  carousel.js         → componente FocusCarousel (reutilizável)
  main.js             → menu mobile, header, scroll-spy, animações, contadores, cronômetros
assets/images/        → imagens otimizadas em WebP
```

## Tarefas comuns

| Quero…                                   | Onde mexer |
|------------------------------------------|------------|
| Adicionar/remover uma instituição        | `js/data.js` → `instituicoes` (o contador "21 instituições" atualiza sozinho) |
| Colocar a logo de uma instituição        | Salve uma imagem quadrada em `assets/images/` e preencha `logo:` no item |
| Criar uma nova categoria de instituição  | `js/data.js` → `categorias` + cor em `css/sections.css` (`[data-cat="..."]`) |
| Editar leilões                           | `js/data.js` → `leiloes` |
| Criar/editar um Brechó Solidário         | `js/data.js` → `brechos` (cada brechó aponta para uma instituição pelo `nome` exato de `instituicoes`; peças em `itens`, meta e valor arrecadado em `meta`/`arrecadado`) |
| Adicionar/remover patrocinador           | `js/data.js` → `patrocinadores` (`cota`: master, ouro ou apoio; `logo` opcional; `fundoEscuro: true` para logos brancas) |
| Novo tipo de peça do brechó              | `js/data.js` → `tiposBrecho` + cor em `css/sections.css` (`.thrift-item[data-tipo="..."]`) |
| Trocar o número do WhatsApp              | `js/data.js` → `whatsapp` (e o `href` de fallback dos links `data-wa` no HTML) |
| Mudar cores, fontes ou espaçamentos      | `css/tokens.css` |
| Usar um ícone novo                       | `<svg class="icon"><use href="#i-NOME"/></svg>` — o ícone precisa existir no bloco `<symbol>` no topo do `index.html` (ícones do [Lucide](https://lucide.dev)) |
| Animar um elemento ao rolar              | Adicione `data-reveal` (ou `data-reveal="left|right|zoom"`); num grupo, coloque `data-stagger` no pai para efeito cascata |

## Carrossel (FocusCarousel)

Qualquer bloco com `data-carousel` vira um carrossel com foco no card central:

- `data-loop` → loop infinito (os slides são clonados nas pontas)
- `data-autoplay="5000"` → avança sozinho; pausa no hover, fora da tela e para de vez quando o usuário interage
- Setas: qualquer elemento com `data-prev` / `data-next` dentro do bloco
- Indicadores opcionais: `data-current`, `data-total`, `data-progress`

O JS apenas escreve `--o` (posição relativa ao centro) e `--ao` (distância absoluta) em cada slide.
Escala, opacidade, rotação 3D e desfoque dos cards laterais são definidos em `css/components.css`
(`.carousel__slide`) — ajuste os multiplicadores ali para deixar o efeito mais ou menos intenso.

## Acessibilidade e desempenho

- Respeita `prefers-reduced-motion` (desliga animações e autoplay)
- Navegação por teclado no carrossel (setas ← →) e somente o card em foco recebe Tab
- Imagens em WebP (de ~1,5 MB para ~230 KB no total das fotos)
- Sem JavaScript, o conteúdo estático continua visível (as animações só escondem elementos quando o JS está ativo)

Arquivos não usados pela página (mantidos como originais da marca): `logo-horizontal.png`, `logo-vertical.png`,
`logo-microgames.png`, `logo-casa-sao-domingos.png`.
