---
name: JDS Cafeteria
description: Site institucional com cardápio digital de uma cafeteria real de São João do Manhuaçu
colors:
  caramelo-tostado: "#b97735"
  caramelo-profundo: "#9c5f22"
  caramelo-escuro: "#7e4b19"
  caramelo-claro: "#e3b07a"
  torra-escura: "#14110f"
  torra-media: "#1e1815"
  grao-espresso: "#24201d"
  nogueira: "#573628"
  vinho-da-xicara: "#7b2d26"
  porcelana-morna: "#fcfaf7"
  papel: "#ffffff"
  creme-suave: "#f6f2ec"
  aveia: "#efe8df"
  creme: "#e9e2da"
  areia: "#d6cec6"
  mocha: "#6b625b"
  latte: "#a39a92"
typography:
  display:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(3rem, 1.9rem + 5.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.8rem + 3.6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  section-title:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  section-title-lg:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  card-title-feature:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  card-title:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  card-title-sm:
    fontFamily: "Instrument Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  price-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "32px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "40px"
  container: "1280px"
  section-mobile: "96px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.caramelo-profundo}"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.caramelo-escuro}"
  button-dark:
    backgroundColor: "{colors.torra-escura}"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-dark-hover:
    backgroundColor: "{colors.nogueira}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.grao-espresso}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.grao-espresso}"
    textColor: "{colors.papel}"
  card-action:
    backgroundColor: "{colors.torra-escura}"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  card-action-hover:
    backgroundColor: "{colors.caramelo-profundo}"
  card-product:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.lg}"
    padding: "8px"
  input-search:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.grao-espresso}"
    rounded: "{rounded.pill}"
    padding: "0 56px 0 52px"
    height: "56px"
  chip-filter:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.mocha}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip-filter-active:
    backgroundColor: "{colors.caramelo-profundo}"
    textColor: "{colors.papel}"
  category-item:
    backgroundColor: "transparent"
    textColor: "{colors.mocha}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "44px"
  category-item-active:
    backgroundColor: "{colors.torra-escura}"
    textColor: "{colors.papel}"
  nav-header:
    backgroundColor: "{colors.torra-escura}"
    textColor: "{colors.papel}"
    height: "72px"
  photo-badge:
    backgroundColor: "rgb(20 17 15 / 0.7)"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: JDS Cafeteria

## Overview

**Creative North Star: "Pausa Bem Servida"**

O site se comporta como uma mesa bem posta: a fotografia chega primeiro, o texto acompanha em voz baixa e nada se move sem motivo. A sensação é de calma editorial, com títulos serifados grandes e respirados sobre fundos mornos, e o caramelo usado como o toque de açúcar que aponta para a ação. O escuro de torra emoldura a página (header, rodapé, faixas de história e convite) e cria o ritmo claro e escuro entre as seções.

A densidade é baixa nas páginas de apresentação e média no cardápio, onde a tarefa é achar um item rápido: busca larga, categorias à mão e cards de mesmo formato. O movimento é parcimonioso: uma entrada coreografada no topo da home, poucos momentos ligados à rolagem e respostas curtas ao toque. A JDS real é a referência: madeira avermelhada, tijolo, plantas e a xícara própria. Quando falta foto real, entra foto de banco sempre identificada.

Rejeitado pelo cliente: objetos 3D, cenas WebGL, inclinação de cards no hover, revelação de cada seção ao rolar, rótulos acima dos títulos e numeração decorativa de seções.

**Key Characteristics:**
- Fotografia lidera; o texto acompanha.
- Serifa de display em títulos, Inter no corpo e na interface.
- Caramelo raro e funcional, escuro de torra como moldura.
- Formas macias: pílulas e cantos generosos.
- Movimento só onde explica ou responde.

## Colors

Paleta de cafeteria: neutros mornos de porcelana e creme, escuro de torra como moldura e um único acento caramelo.

### Primary
- **Caramelo Tostado** (#b97735): acento de marca em detalhes decorativos, como o ponto final da frase do rodapé e o sublinhado do item ativo do menu.
- **Caramelo Profundo** (#9c5f22): o caramelo que trabalha. Botão principal, preços, filtros ativos e links de texto, porque tem contraste AA sobre branco.
- **Caramelo Escuro** (#7e4b19): hover do botão principal e dos links.
- **Caramelo Claro** (#e3b07a): caramelo sobre fundo escuro, como o nome da casa no hero e o item ativo do menu mobile.

### Secondary
- **Vinho da Xícara** (#7b2d26): a cor do logo na xícara real. Reservado para detalhes de marca. Hoje não aparece em nenhuma superfície.

### Neutral
- **Torra Escura** (#14110f): header, rodapé, botões escuros, categoria ativa e fundo do hero.
- **Torra Média** (#1e1815): fundo das faixas escuras de conteúdo (história e convite), com textura de pontos.
- **Grão Espresso** (#24201d): texto principal sobre fundos claros.
- **Nogueira** (#573628): hover do botão escuro.
- **Porcelana Morna** (#fcfaf7): fundo da página.
- **Papel** (#ffffff): cards, campos e chips.
- **Creme Suave** (#f6f2ec): faixas claras alternadas (destaques, galeria, topo de páginas internas).
- **Aveia** (#efe8df): fundo de imagem enquanto carrega.
- **Creme** (#e9e2da): moldura de foto.
- **Areia** (#d6cec6): texto secundário sobre escuro e alça da gaveta.
- **Mocha** (#6b625b): texto secundário sobre claro.
- **Latte** (#a39a92): texto terciário, contagens e créditos sobre escuro.

### Named Rules
**A Regra do Açúcar.** O caramelo é o açúcar da xícara: pouco e onde importa. Um botão principal por tela, preços e o estado ativo. Nunca como fundo de seção.

**A Regra da Moldura de Torra.** O escuro de torra emoldura a experiência (header, rodapé e as faixas de história e convite). As superfícies de tarefa, como cardápio e produto, ficam claras.

## Typography

**Display Font:** Instrument Serif (com Iowan Old Style, Palatino Linotype, Georgia)
**Body Font:** Inter (com ui-sans-serif, system-ui)

**Character:** Uma serifa condensada e elegante, sempre no peso 400, para os títulos com voz de revista, ao lado de uma sans neutra e muito legível para tudo que é interface e leitura.

### Hierarchy
- **Display** (400, clamp de 3rem a 6rem, 0.95): títulos do hero da home, da Experiência e do convite final. Cerca de 52px no celular.
- **Headline** (400, clamp de 2.75rem a 4.5rem, 1.0): título principal das seções e das páginas internas. 44px no celular.
- **Title** (400, clamp de 2.25rem a 3.5rem, 1.04): títulos de seção com intro. 36px no celular.
- **Section Title** (400, 2rem, e 2.5rem a partir de 640px): categorias do cardápio, ambientes da Experiência, título da gaveta.
- **Card Title Feature** (400, 2rem no celular e 2.75rem a partir de 640px): o card grande dos destaques. Nunca maior que o título da seção onde está.
- **Card Title** (400, 1.75rem, 1.05): nome do produto e dos ambientes, em serifa. **Card Title Small** (1.5rem) no card horizontal.
- **Price Large** (Inter 600, 2rem, algarismos tabulares): preço na página do produto.
- **Lede** (400, 1.125rem, 1.65): parágrafos de abertura, até cerca de 65 caracteres por linha.
- **Body** (400, 1rem, 1.6): texto corrido.
- **UI** (400 ou 600, 0.9375rem, 1.625): botões, links do menu, opções da busca e descrições curtas de cards e blocos.
- **Label** (600, 0.875rem): títulos da barra lateral, chips, cabeçalhos de colunas do rodapé.
- **Caption** (600, 0.75rem): selos de produto e notas como "preço de exemplo".
- **Micro** (500, 0.6875rem): selo "Foto ilustrativa", contadores e o "Cafeteria" do logo.

### Named Rules
**A Regra do Título que Fala Sozinho.** Nenhum rótulo pequeno em caixa alta acima de um título. O título carrega o peso dele.

**A Regra do Peso Único da Serifa.** A Instrument Serif é usada só no peso 400 e sem itálico, com `font-synthesis: none` para o navegador nunca inventar negrito ou itálico. Ênfase vem de tamanho ou da cor caramelo. Abaixo de 24px a serifa não aparece: títulos pequenos são Inter 600.

**A Regra da Palavra que Cabe.** Títulos em serifa usam `overflow-wrap: break-word` e hifenização, para nomes longos de produto nunca empurrarem a página para os lados.

## Layout

Container de até 1280px (80rem), centralizado, com respiro lateral de 20px no celular, 32px a partir de 640px e 40px a partir de 1280px. Toda a página respeita essas mesmas bordas, inclusive header e rodapé.

Seções respiram de 96px no celular a 128px no desktop. Composições editoriais usam grade de 12 colunas: texto em 5 colunas e imagem em 5 ou 6, com uma coluna de folga. O hero da home ocupa a altura total da tela e passa por baixo do header.

O cardápio no desktop usa uma barra lateral de 240px a 256px, fixa ao rolar abaixo do header, e o catálogo no restante, em 3 colunas a partir de 1280px e 2 colunas no tablet. No celular a barra lateral vira uma fita horizontal de categorias e os filtros vão para uma gaveta inferior.

Breakpoints: 416px (xs), 640px, 768px, 1024px e 1280px.

## Elevation & Depth

Profundidade vem de luz e sobreposição de fotografias, não de sombras pesadas. Superfícies ficam planas em repouso, com borda fina. A sombra aparece como resposta: no hover de cards e como base de peças que se sobrepõem, como a xícara que atravessa a borda do hero.

### Shadow Vocabulary
- **Repouso de card** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04)`): presença mínima em cards parados.
- **Card em hover** (`box-shadow: 0 24px 48px -28px rgb(36 24 16 / 0.42)`): acompanha a subida de 2px.
- **Peça sobreposta** (`box-shadow: 0 40px 80px -30px rgb(14 11 9 / 0.55)`): fotos emolduradas que atravessam outra seção.
- **Header rolado** (`box-shadow: 0 10px 30px -14px rgb(0 0 0 / 0.6)`): separa o header escuro do conteúdo.
- **Campo de busca** (`box-shadow: 0 10px 30px -22px rgb(36 24 16 / 0.5)`), com anel de foco caramelo (`0 0 0 4px rgb(185 119 53 / 0.14)`).

### Named Rules
**A Regra da Mesa Lisa.** Em repouso tudo fica plano. A sombra é uma resposta, não um enfeite.

**A Regra do Véu Localizado.** Texto sobre foto ganha degradê só atrás do texto (direcional e vertical), mais uma vinheta leve. Nunca um véu escuro uniforme sobre a foto inteira.

## Shapes

Forma macia e generosa. Botões, chips, busca e selos são pílulas completas. Cards usam cantos de 24px, com a foto interna inset em 8px e cantos de 18px. Fotos editoriais usam de 24px a 32px. Itens da barra lateral usam 12px. Fotos sempre recortam com `object-fit: cover` e ponto focal definido por foto, separado para celular e desktop.

## Components

### Buttons
Macios e firmes: pílula, resposta curta ao toque.
- **Shape:** pílula completa (9999px), altura de 48px.
- **Primary:** fundo Caramelo Profundo com texto branco, padding lateral de 28px. Hover para Caramelo Escuro com sombra levemente maior.
- **Dark:** fundo Torra Escura, hover para Nogueira.
- **Outline:** borda fina, fundo transparente, hover preenche com Grão Espresso e texto branco. Sobre escuro há a variante clara, com borda branca a 60% que preenche de branco no hover.
- **Press:** escala 0.97 em 140ms com ease-out forte. A seta do ícone desliza 4px no hover.

### Chips
- **Style:** pílula de 44px de altura, fundo Papel, borda fina, texto Mocha.
- **State:** ativo em Caramelo Profundo com texto branco e ícone de check. "Minha seleção" mostra coração e contagem.

### Cards / Containers
- **Corner Style:** 24px no card, 18px na foto interna.
- **Background:** Papel, sobre fundo Porcelana ou Creme Suave.
- **Shadow Strategy:** repouso mínimo; no hover sobe 2px, a sombra de hover entra e a foto aproxima 3% em 450ms.
- **Border:** linha fina a 10% de opacidade, que some no hover.
- **Internal Padding:** foto inset em 8px; texto com 20px a 24px.
- **Variantes:** padrão (foto 5:4), destaque grande (foto 4:3 que estica com a coluna) e horizontal (foto à esquerda, para listas curtas).

### Inputs / Fields
- **Style:** busca em pílula de 56px, fundo Papel, borda a 20%, ícone à esquerda e botão de limpar à direita.
- **Focus:** borda Caramelo Profundo e anel caramelo suave de 4px.
- **Autocomplete:** painel de cantos de 18px abaixo do campo, opção ativa em Creme Suave e o trecho buscado em destaque.

### Navigation
- **Header:** Torra Escura com 72px no desktop e 64px no celular. Na home ele começa transparente sobre o hero e fica sólido ao rolar, só com CSS. Links em Inter 15px, branco a 75%, e o ativo em branco com sublinhado caramelo que cresce da esquerda.
- **Mobile:** gaveta lateral escura com os itens em Instrument Serif 28px, entrando em cascata curta.
- **Categorias do cardápio:** lista vertical na barra lateral (ativo em Torra Escura) e fita horizontal no celular.

### Photo Badge
Selo pequeno em pílula escura translúcida com o texto "Foto ilustrativa", sobre toda foto de banco de imagens. Os créditos completos ficam numa seção do rodapé. Foto real da JDS nunca recebe esse selo.

## Do's and Don'ts

### Do:
- **Do** usar Caramelo Profundo (#9c5f22) para texto e botões sobre claro, e Caramelo Claro (#e3b07a) sobre escuro.
- **Do** deixar a fotografia liderar cada seção de apresentação, com foco definido por foto (`position` e `positionMobile`).
- **Do** usar os tokens de movimento: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, interface em até 260ms, gaveta em 420ms com `cubic-bezier(0.32, 0.72, 0, 1)`, toque com escala 0.97.
- **Do** restringir o hover a dispositivos com mouse (`hover: hover` e `pointer: fine`).
- **Do** manter o selo "Foto ilustrativa" visível sobre qualquer foto que não seja da JDS.
- **Do** exibir fotos reais em baixa resolução no tamanho em que ficam nítidas, em vez de esticá-las em tela cheia.

### Don't:
- **Don't** colocar rótulos pequenos em caixa alta acima de títulos, nem numerar seções (01, 02, 03).
- **Don't** usar objetos 3D, cenas WebGL ou inclinação de cards no hover.
- **Don't** revelar cada seção ao rolar. O movimento ligado à rolagem fica só na saída do hero, na peça que atravessa a borda e na foto do convite.
- **Don't** escurecer uma foto inteira com véu uniforme.
- **Don't** usar travessão em nenhum texto do site.
- **Don't** usar a Instrument Serif em negrito ou itálico.
