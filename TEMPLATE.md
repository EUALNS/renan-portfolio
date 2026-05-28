# Template — Portfolio Renan Camargo

Guia passo a passo para reconstruir este site (ou replicá-lo com outro conteúdo).
Stack: **HTML + Tailwind (CDN) + React 18 via Babel (sem build step)**.

---

## 1. Estrutura de arquivos

```
/
├─ index.html                  ← shell HTML + fonts + Tailwind + scripts
├─ components.jsx              ← primitivos (FadeIn, Magnet, AnimatedText, Botões)
├─ interactive-mesh.jsx        ← canvas interativo do hero (rede de partículas)
├─ app.jsx                     ← composição das seções e dados de conteúdo
├─ Renan Portfolio - Memoji.html  (backup: capa com memoji)
├─ Renan Portfolio - Spark.html   (backup: capa com símbolo orgânico)
├─ app-memoji.jsx / app-spark.jsx  (apps das versões alternativas)
├─ claude-spark.jsx            (símbolo orgânico animado opcional)
└─ img/                        ← todas as imagens dos projetos
```

---

## 2. Shell HTML (`index.html`)

1. `<head>`:
   - Pré-conecta Google Fonts e carrega **Kanit** (300–900) e **JetBrains Mono**.
   - Carrega **Tailwind via CDN**.
   - Carrega React 18.3.1, ReactDOM 18.3.1 e Babel standalone 7.29 (com `integrity` pinada — exige versões EXATAS).
   - Define variáveis CSS globais:
     - `body` em `#0C0C0C`, texto `#D7E2EA`, font-family `Kanit`.
     - `.hero-heading` → texto com `background-clip:text` em gradiente vertical `#646973 → #BBCCD7` para o efeito de cromo escovado.
     - `.contact-pill` → botão CTA com gradient OKLCH azul-aço + shadow externo frio + inner highlight.
     - `.ghost-pill` → variante outline-only com hover em opacidade.
     - `.font-mono-tag` → JetBrains Mono para tags `// label`.
3. `<body>`:
   - `<div id="root"></div>` para o React montar.
   - Carrega scripts via `<script type="text/babel" src="...">` na ordem:
     1. `components.jsx`
     2. `interactive-mesh.jsx`
     3. `app.jsx`

---

## 3. Primitivos (`components.jsx`)

- **`FadeIn`** — wrapper baseado em `IntersectionObserver`. Entra com `opacity + translate(x,y)` para 0 sem JS de scroll contínuo.
- **`Magnet`** — wrapper que segue o mouse. Modos:
  - `fullViewport` — ativa no viewport inteiro.
  - `sweep` — offset proporcional à largura do viewport (`sweepRatio` X e Y).
  - `smoothing` — lerp em `requestAnimationFrame` (~0.08 = movimento contínuo desacelerado).
- **`ContactButton`** — pill com classe `.contact-pill`.
- **`LiveProjectButton`** — pill ghost com label "Case Study".
- **`AnimatedText`** — texto char-por-char com opacidade interpolada pelo scroll (efeito "reveal palavra a palavra").

---

## 4. Hero — fundo interativo (`interactive-mesh.jsx`)

Canvas 2D em tela cheia atrás do conteúdo.

1. **Init** — DPR-aware. Cria N partículas com 2 camadas (`depth: 0` distante, `depth: 1` próxima). Cada uma tem velocidade pequena, fase aleatória, raio entre 0.7–3px.
2. **Loop (requestAnimationFrame):**
   - Atualiza drift orgânico (sin/cos com fase própria → estilo Perlin barato).
   - Repulsão do mouse (mais forte na camada próxima).
   - Amortecimento + clamp de velocidade.
   - Wrap nas bordas.
3. **Render por camada:**
   - Vinheta radial seguindo o mouse (azul-aço suave).
   - Linhas entre partículas próximas (mesma camada) com alpha = (1 − d/maxDist).
   - Linhas do mouse até partículas em raio 220px.
   - Partículas com glow ao redor (camada próxima ganha halo extra).
4. **Densidade:** `Math.max(140, area/8500 * density)` — controlável via prop.

---

## 5. Composição (`app.jsx`)

### 5.1 Arrays de conteúdo no topo

```js
const MARQUEE_IMAGES = [...]; // imgs do banner em movimento
const SERVICES = [
  { n: '01', name, desc },    // 5 itens
  ...
];
const PROJECTS = [
  {
    n, category, name, desc, href,
    img2, img3,               // imagens esquerda / direita
    pos2, pos3,               // objectPosition opcional
    fit2, fit3,               // 'contain' p/ logos
  },
  ...
];
```

### 5.2 Ordem das seções dentro de `<App />`

1. **`<HeroSection />`** — full-viewport, fundo `<InteractiveMesh />`, conteúdo bottom-left (mono-tag → heading gigante → subheading → descrição → 2 CTAs → trust line). Cada elemento com `<FadeIn delay={...}>` escalonado.
2. **`<MarqueeSection />`** — duas fileiras de imagens em direções opostas, deslocadas em paralaxe pelo scroll (`offset` recalculado em `window.scroll`).
3. **`<AboutSection />`** — heading `About me`, 4 ícones decorativos SVG nos cantos (`DecoIsoCube`, `DecoNodeGraph`, `DecoColumn`, `DecoDiamondStack`), corpo de texto com reveal char-por-char (`<AnimatedText />`).
4. **`<ServicesSection />`** — fundo branco contrastante, lista numerada com border-top em cada item.
5. **`<ProjectsSection />`** com `<ProjectCard />` por projeto:
   - Cada card é `sticky h-screen` com inner `h-[calc(100vh-6rem)]` → empilha conforme scroll.
   - `top: calc(4rem + index*20px)` cria o efeito de baralho.
   - Scale animada via ref + `useScroll`-style listener (lerp manual).
   - Grid 12 colunas: img esquerda `col-span-5`, img direita `col-span-7`. Cada imagem aceita `fit` (`cover`/`contain`) e `pos` (objectPosition).
6. **`<ContactSection />`** — heading final em hero-heading, três `<ContactLine>` (email / WhatsApp / localização), divisor + links sociais.

### 5.3 Estilo visual do template

| Elemento | Tratamento |
|---|---|
| Heading principal | `font-black uppercase`, `tracking-tight`, `clamp(...)`, gradient em background-clip |
| Mono-tag | `JetBrains Mono`, uppercase, `tracking-[0.25–0.3em]`, opacidade ~55% |
| Sections | Bg `#0C0C0C` (default) ou `#FFFFFF` (Services, p/ contraste) |
| Cantos | `rounded-t-[40–60px]` entre seções escuras/claras |
| CTA primário | `.contact-pill` (gradiente OKLCH azul-aço) |
| CTA secundário | `.ghost-pill` (borda + hover em opacidade) |

---

## 6. Cores e tipografia

- **Fundo principal:** `#0C0C0C`
- **Texto principal:** `#D7E2EA`
- **Gradiente do heading:** `#646973 → #BBCCD7` (vertical)
- **CTA primário:** OKLCH `0.42 0.08 250 → 0.50 0.10 230 → 0.58 0.08 200`
- **Fonte display:** Kanit (Black 900 para headings, Medium 500 para títulos de seção, Light 300 para parágrafos)
- **Fonte mono:** JetBrains Mono Medium (tags `// label`)

---

## 7. Como adaptar para outro conteúdo

1. **Edite os 3 arrays no topo de `app.jsx`** (`MARQUEE_IMAGES`, `SERVICES`, `PROJECTS`). Não toque na estrutura JSX se quiser preservar a identidade visual.
2. **Substitua imagens** em `/img/` mantendo os mesmos nomes ou atualize os caminhos nos arrays.
3. **Foto do hero (versão Memoji)**: coloque PNG com fundo transparente em `img/memoji.png`. Para a versão Spark/Mesh, nenhuma foto é necessária.
4. **Textos do hero** estão no `<HeroSection />` em `app.jsx` (mono-tag → heading → subheading → descrição → CTAs → trust line).
5. **Contato** está em `<ContactSection />` — três `<ContactLine>` + bloco de redes (LinkedIn / WhatsApp / Email, todos com `href` direto).
6. **Para trocar a fonte**: troque o `link` do Google Fonts no `<head>` e altere `font-family` no `body`.
7. **Para trocar a paleta**: edite as variáveis CSS no `<style>` do `index.html` e os literais de cor nos componentes (procura por `#D7E2EA` e `#0C0C0C`).

---

## 8. Versões alternativas do hero

- **Memoji** — foto recortada com `Magnet sweep={true}` (segue o mouse pelo viewport inteiro).
- **Spark** — símbolo SVG orgânico inspirado no Claude (8 pétalas + núcleo glowing + halo de partículas + tilt 3D).
- **Mesh (atual)** — canvas com rede de partículas reagindo ao mouse.

Cada uma vive num `app-*.jsx` próprio + HTML dedicado. Para trocar a versão padrão, basta apontar `index.html` para o JSX desejado.

---

## 9. Performance / cuidados

- Imagens grandes (Lighthouse, Muxima) ficam em ~1280px → ~300KB cada.
- `loading="lazy"` foi removido das imagens dos `<ProjectCard>` porque entrava em conflito com `transform: scale()` em containers sticky (o navegador não detectava como "in-viewport" e o image ficava broken).
- `<canvas>` do mesh limita DPR a 2 para não estourar GPU em telas 4K.
- Tailwind via CDN: viável para um portfolio estático; para projeto maior, compile o Tailwind localmente para reduzir o JS shipped.

---

**Para reconstruir do zero:**
1. Crie `index.html` com fonts + Tailwind CDN + React/Babel pinados + `<div id="root">`.
2. Cole `components.jsx`, `interactive-mesh.jsx` e `app.jsx` (a partir deste projeto).
3. Edite os arrays de conteúdo.
4. Substitua imagens em `img/`.
5. Abra `index.html` no navegador. Pronto.
