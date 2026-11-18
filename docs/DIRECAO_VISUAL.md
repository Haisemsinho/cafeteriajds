# Direção visual e movimento

Branch `redesign-cinematico`. Data: 18/11/2026. A versão aprovada antes (v4, v5, v6) continua na tag `v6-entrega` e no `master`.

## O que mudou

A arquitetura, as rotas, os dados, a busca com autocomplete, os filtros, o coração, a página de produto e o modelo de conteúdo não mudaram. Mudou a camada visual:

- Tipografia de display serifada (Instrument Serif) em títulos. A Inter continua no corpo e na interface.
- Hero de tela cheia na home, com o header transparente sobre a foto e sólido depois de rolar.
- Introdução assimétrica com duas fotos sobrepostas, destaques com cards de foto dominante, história em faixa escura com colagem de fotos reais, galeria com zoom e convite final com foto de fundo.
- Cardápio com faixa fotográfica no topo e cards novos. Página de produto com foto maior, crédito visível e recomendações em sequência.
- Páginas institucionais no mesmo padrão. Ambientes da página Experiência no formato vertical das fotos reais.
- Rodapé com a tagline em destaque.

## Fotografia: o que é real e o que é ilustrativo

Regra: foto ilustrativa só aparece no modo demonstração (`SHOW_DRAFT_CONTENT=true`), sempre com o selo "Foto ilustrativa" e com crédito. Em produção, `getScenes()` volta para as fotos reais da JDS, e `getMenu()` remove qualquer foto marcada como `illustrative`, mesmo em produto `verified`. Isso foi conferido no build de produção: nenhuma página tem selo, crédito ou arquivo ilustrativo.

As fotos reais da JDS continuam onde a resolução aguenta: colagem da história, xícara da casa na introdução, galeria, Nossa História e Experiência.

### Fotos ilustrativas e licenças

Arquivos em `src/assets/photos/ilustrativas/`, recomprimidos (JPEG progressivo, sem metadados). Cadastro em `src/content/illustrative.ts`.

| Arquivo | Uso | Autor | Licença | Origem |
|---|---|---|---|---|
| ambiente-janela.jpg | Hero da home | não identificado | Licença Unsplash | images.unsplash.com/photo-1445116572660-236099ec97a0 (veio no src.zip de referência) |
| ambiente-lattes.jpg | Introdução e topo do cardápio | não identificado | Licença Unsplash | images.unsplash.com/photo-1509042239860-f550ce710b93 (veio no src.zip de referência) |
| ambiente-brinde.jpg | Convite final | Nathan Dumlao | Licença Unsplash | unsplash.com/photos/6VhPY27jdps |
| espresso.jpg | Espresso | Binit Sharma | Licença Unsplash | unsplash.com/photos/69YqZOU6-Jo |
| espresso-duplo.jpg | Espresso duplo | Jakub Żerdzicki | Licença Unsplash | unsplash.com/photos/A_90G6Ta56A |
| cafe-coado.jpg | Café coado | Patrick Fore | Licença Unsplash | unsplash.com/photos/YWHK_pePhVw |
| cappuccino.jpg | Cappuccino | Nathan Dumlao | Licença Unsplash | unsplash.com/photos/tA90pRfL2gM |
| latte.jpg | Latte | Drew Coffman | Licença Unsplash | unsplash.com/photos/tZKwLRO904E |
| mocha.jpg | Mocha | Giancarlo Duarte | Licença Unsplash | unsplash.com/photos/RtHw0PWCLhw |
| cafe-gelado.jpg | Café gelado | Esra Afşar | Licença Unsplash | unsplash.com/photos/3cOehyE_WyY |
| latte-gelado.jpg | Latte gelado | pariwat pannium | Licença Unsplash | unsplash.com/photos/y2Dfk2Kt89o |
| chocolate-quente.jpg | Chocolate quente | Rachael Gorjestani | Licença Unsplash | unsplash.com/photos/zKjidZxijiM |
| croissant.jpg | Croissant | Sergio Arze | Licença Unsplash | unsplash.com/photos/5msGxboneMA |
| bolo-do-dia.jpg | Bolo do dia | Kouji Tsuru | Licença Unsplash | unsplash.com/photos/67mrKcuR4v8 |
| brownie.jpg | Brownie | Toa Heftiba | Licença Unsplash | unsplash.com/photos/WPRuXYLNY68 |
| biscoitos-da-cesta.jpg | Biscoitos da cesta | Julissa Capdevilla | Licença Unsplash | unsplash.com/photos/wNjgWrEXAL0 |
| pao-de-queijo.jpg | Pão de queijo | Jonathan Wilkins | CC BY-SA 3.0 | commons.wikimedia.org/wiki/File:Pão_de_Queijo_-_cheese_bread.jpg |

Observações:

- A Licença Unsplash permite uso comercial e não exige crédito. Mesmo assim o site mostra o crédito.
- A foto do pão de queijo é CC BY-SA 3.0: o crédito com autor e licença é obrigatório e aparece embaixo da foto na página do produto. Se for usar fora do site (redes sociais, impressos), manter o crédito.
- Os autores vieram das páginas do Unsplash encontradas na busca. Vale conferir antes de qualquer uso fora do site.
- Fotos com marca de concorrente, letreiros legíveis de outras casas ou marca d'água foram descartadas na triagem (por exemplo, a placa "COFFEE" e a fachada com letreiro do src.zip, e uma foto de pão de queijo com marca no canto).
- Nenhuma foto ilustrativa é apresentada como sendo da JDS.

## Enquadramento

Cada foto tem `position` (ponto focal no computador) e, quando precisa, `positionMobile`. O componente aplica com `object-(--focus)` e `md:object-(--focus-md)`.

| Foto | Proporção usada | Ponto focal | Observação |
|---|---|---|---|
| ambiente-janela (hero) | tela cheia, 100svh | 50% 62% no computador, 38% 60% no celular | Mesa e xícaras ficam na metade de baixo, texto à esquerda sobre o degradê |
| ambiente-lattes | 4/5 na introdução, faixa larga no cardápio | 50% 55% | Xícaras no centro, plantas nas bordas |
| ambiente-brinde | faixa de fundo | 50% 45%, 62% 50% no celular | Mãos e xícaras no centro do título |
| fotos de produto | 5/4 nos cards, 4/5 na página | por foto, em `illustrative.ts` | Produto centralizado, sem cortar a xícara |
| fotos reais (fachada, varanda, prateleiras) | formato vertical nativo | padrão | Exibidas pequenas porque a fonte tem de 200 a 335 px |
| xícara real | 4/3, cerca de 330 px | 60% 40% | Perto do tamanho nativo (386 px) |

A foto `fachada.jpg` (marca "b2" e uma cliente) saiu da colagem da home e foi trocada por `interior.jpg`.

## Sistema de movimento

Tokens em `src/app/globals.css` (`:root`):

| Token | Valor | Uso |
|---|---|---|
| `--dur-micro` | 160ms | toque em botões (`press`) |
| `--dur-quick` | 280ms | cor, fundo de modal |
| `--dur-base` | 480ms | hover de card, transição de página, menu |
| `--dur-slow` | 800ms | zoom de foto, entrada de seção |
| `--dur-hero` | 1100ms | textos do hero |
| `--dur-photo` | 2200ms | foto do hero e cortina |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | entradas |
| `--ease-in-out` | cubic-bezier(0.76, 0, 0.24, 1) | reservado |
| `--ease-hover` | cubic-bezier(0.25, 0.6, 0.35, 1) | hover e cor |
| `--dist-sm`, `--dist-md`, `--dist-lg` | 0.5rem, 1.5rem, 3rem | distâncias de movimento |
| `--stagger` | 80ms | sequência de itens com tempo |
| `--hero-step` | 150ms | passo da sequência do hero |
| `--reveal-step` | 7% | sequência no reveal por rolagem |

Animações:

- **Entrada do hero:** a foto aparece por baixo de uma cortina escura que se dissolve, com zoom de 1.12 para 1. Depois sobem o selo, a primeira linha do título, o nome, o subtítulo e os botões, em passos de 150 ms. O header entra por último.
- **Reveal por rolagem:** atributo `data-reveal` (subir e aparecer), `data-reveal="image"` (máscara e zoom na foto) e `data-parallax` (deslocamento de 6%). É feito só com CSS (`animation-timeline: view()`), sem JavaScript. O item fica totalmente visível quando entra inteiro na tela. Navegador sem suporte (Firefox hoje) mostra tudo estático.
- **Sequência de cards:** `stagger(i)` em `src/lib/cn.ts`.
- **Hover:** elevação de 4 px (`lift`), zoom de 6% na foto (`zoom-frame`), seta do botão desliza, sublinhado caramelo cresce no menu.
- **Menu mobile:** painel desliza da direita e os itens entram em cascata (`@starting-style`).
- **Transição de página:** `src/app/template.tsx` aplica `page-enter` (aparecer e subir 0.5rem) a cada navegação.
- Tudo dentro de `prefers-reduced-motion: no-preference`. Com movimento reduzido o site fica estático e completo.
- Só `transform`, `translate`, `scale`, `opacity` e `clip-path`. Nenhuma animação contínua, nenhum carrossel automático, nenhuma biblioteca de animação.

Detalhe técnico importante: animações que começam em `opacity: 0` impediam o Chrome de registrar o LCP quando a foto carregava rápido (resultado `NO_LCP` no Lighthouse da produção). As entradas começam em `opacity: 0.001`, que é invisível e mantém a medição. A foto do hero não anima opacidade: a cortina por cima é que some.

## Medições (reais, nesta máquina)

Lighthouse 12 mobile (4G lento simulado, CPU 4x), Chrome 157.

| Página | Antes do redesign | Depois |
|---|---|---|
| `/` demonstração | Perf 92 a 96, LCP 2,8 a 2,9 s | Perf 92, LCP 3,3 a 3,4 s |
| `/cardapio` demonstração | Perf 95 a 97, LCP 2,7 a 2,8 s | Perf 91 a 92, LCP 3,4 s |
| `/cardapio/cappuccino` demonstração | Perf 97, LCP 2,5 s | Perf 93, LCP 3,2 s |
| `/` produção | Perf 95, SEO 100 | Perf 94, Acessibilidade 100, Boas práticas 100, SEO 100, LCP 3,1 s |
| `/cardapio` produção | Perf 97 | Perf 97, Acessibilidade 100, Boas práticas 100, SEO 100, LCP 2,7 s |

Acessibilidade 100 e CLS 0 em todas. LCP observado sem limitação: 108 a 332 ms.

O LCP simulado subiu cerca de 0,6 s na demonstração. O motivo é peso no caminho crítico: a fonte serifada (cerca de 15 KB) e fotos reais no lugar de desenhos SVG. O itálico da serifa foi removido para economizar mais 16 KB.

Peso por página no celular, cache desligado: home de 299 KB para cerca de 424 KB, cardápio de 249 KB para cerca de 437 KB (fotos dos 14 produtos, todas em AVIF e com lazy loading abaixo da dobra). JavaScript praticamente igual (de 162 KB para 162,5 KB): o movimento é todo em CSS.

## Testes executados

- `npm run typecheck` e `npm run lint` sem erros.
- Builds de demonstração e de produção sem erros.
- 42 testes de interação Playwright (busca, autocomplete, debounce, URL, voltar ao cardápio, coração, filtros, link antigo, preço por tamanho, 404, menu mobile, 320 px, console). 42 passando.
- Auditoria de 9 páginas em 320, 375, 390, 430, 768, 1024 e 1440 px: nenhuma rolagem horizontal, nenhum erro de console. Os únicos alvos menores que 24 px são os rádios de tamanho escondidos, cujo alvo real é o rótulo inteiro.
- Capturas de tela em 1440 px e 390 px de todas as páginas, revisadas e corrigidas (selo sobre foto real, colagem, foto repetida no topo do cardápio, fotos reais ampliadas demais na Experiência).
- Quadros da entrada do hero em 150, 500, 900 e 1800 ms e do menu mobile.
- Tudo simulado em Chrome no Windows. Sem aparelho físico, Safari, Firefox ou leitor de tela.

## Pendências

- Aprovação visual do dono. Se aprovado, criar a tag `v7-cinematico` e levar para o `master`.
- Fotos oficiais em alta resolução (mínimo 2400 px de largura no hero). Com elas, o hero e o convite de produção podem usar fotos reais grandes.
- Conferir no Safari (iPhone) o reveal por rolagem, que depende de `animation-timeline`.
- Firefox mostra o site sem reveal por rolagem, o que é aceitável.
- O CLAUDE.md fora do repositório ainda diz que o design v4/v5 é o aprovado. Atualizar quando houver decisão.

## Revisão de 18/11/2026 (critique e polish)

Critique da home: 22/32 (dual-agent). Direção aprovada pelo cliente: fotografia lidera, sem 3D, sem WebGL, sem tilt.

Mudanças:

- Hero sem altura máxima: ocupa a tela inteira em qualquer resolução (antes parava em 992 px e deixava faixa vazia em telas altas).
- Header da home: a troca de transparente para sólido agora é CSS (`.header-overlay` com `animation-timeline: scroll()`). Funciona mesmo sem JavaScript. Navegador sem suporte mostra o header sólido.
- Véu do hero em camadas: degradê direcional atrás do texto, degradê vertical para o header e para a base, vinheta leve. A foto aparece mais.
- Transição hero para conteúdo: a xícara real da JDS atravessa a borda do hero e sobe um pouco com a rolagem.
- Destaques: 1 produto grande e 3 em linha, com "Ver todos os produtos" no topo.
- Rótulos acima dos títulos (eyebrows) e números de seção removidos do site todo.
- Créditos das fotos ilustrativas: uma seção no rodapé, gerada de `src/content/illustrative.ts`. O selo "Foto ilustrativa" continua sobre cada foto externa.
- `allowedDevOrigins` com o IP da rede local, para testar o servidor de desenvolvimento pelo IP.

Movimento (tokens novos, critério Emil Kowalski):

| Token | Valor | Uso |
|---|---|---|
| `--dur-press` | 140ms | pressionar botão (`scale(0.97)`) |
| `--dur-hover` | 200ms | cor e borda |
| `--dur-ui` | 260ms | card subindo, itens do menu |
| `--dur-photo-hover` | 450ms | zoom de foto no hover |
| `--dur-sheet` | 420ms | menu mobile e modais, curva de gaveta |
| `--dur-hero` | 900ms | linhas do título do hero |
| `--dur-photo` | 1600ms | cortina e zoom da foto do hero |
| `--ease-out` | cubic-bezier(0.23, 1, 0.32, 1) | entradas |
| `--ease-drawer` | cubic-bezier(0.32, 0.72, 0, 1) | menu mobile |
| `--lift`, `--zoom`, `--press` | -2px, 1.03, 0.97 | hover e toque |

- Hover só em dispositivo com mouse (`hover: hover` e `pointer: fine`).
- Movimento ligado à rolagem só em três momentos: a saída do hero (a foto aproxima, o texto sobe), a xícara que atravessa a borda (`data-moment="rise"`) e a foto do convite que se abre (`data-moment="unveil"`). Todos os `data-reveal` de seção foram retirados.
- Com movimento reduzido nada se move e nada fica escondido.

Verificação: `npm run check` sem erros, 42 testes de interação passando, nenhuma rolagem horizontal em 9 páginas e 7 larguras. Os links de crédito no rodapé ficam dentro de texto corrido, que é a exceção da regra de alvo mínimo.
