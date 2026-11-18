# Auditoria de performance

Data: 17/11/2026. Base: tag `v6-entrega`.

## Resumo

O site é 100% estático: sem API, sem banco, sem `fetch`, sem script de terceiros, sem fila. Todo o conteúdo vem de `src/content/` e é validado com Zod no build (o Zod não vai para o navegador). Por isso a maior parte da infraestrutura do briefing (Redis, filas, índices, pool de conexões, OpenTelemetry, balanceamento) não se aplica e não foi instalada.

O que foi feito:

1. Erro de hidratação do React (#418) em toda página de produto inexistente, por exemplo `/cardapio/nome-errado`. Corrigido.
2. Busca do cardápio: autocomplete acessível com produtos reais e debounce de 300 ms na escrita da URL.
3. Duas falhas de acessibilidade: contraste AA no contador "Minha seleção" e ordem de títulos no estado vazio.

## Como foi medido

- Build de produção (`next build` e `next start`) na máquina local, Windows 10, Chrome 157.
- Modo demonstração (`SHOW_DRAFT_CONTENT=true`) para as páginas terem conteúdo. Modo produção (`NEXT_PUBLIC_SITE_URL` https, sem exemplos) para SEO e 404.
- Lighthouse 12, perfil mobile padrão (4G lento simulado e CPU 4x).
- Script Playwright próprio (fora do repositório): bytes transferidos, requisições, compressão, `Cache-Control`, LCP e CLS por `PerformanceObserver`, em 1440 px e em 390 px com 4G lento (1,6 Mbps, 150 ms) e CPU 4x.
- 42 testes de interação Playwright (fora do repositório).
- Tudo é teste local simulado. Nenhum teste em aparelho físico, em rede real ou com usuários reais.

## Métricas antes e depois

Lighthouse mobile, modo demonstração. O "antes" é uma execução. O "depois" mostra o intervalo de 3 execuções, para dar ideia da variação.

| Página | Métrica | Antes | Depois |
|---|---|---|---|
| `/` | Performance | 93 | 92 a 96 |
| `/` | LCP | 3,0 s | 2,8 a 2,9 s |
| `/` | TBT | 120 ms | 40 a 180 ms |
| `/` | CLS | 0 | 0 |
| `/cardapio` | Performance | 97 | 95 a 97 |
| `/cardapio` | Acessibilidade | 96 | 100 |
| `/cardapio` | LCP | 2,6 s | 2,7 a 2,8 s |
| `/cardapio/cappuccino` | Performance | 97 | 97 |
| `/cardapio/cappuccino` | LCP | 2,5 s | 2,5 s |
| Todas | Boas práticas | 100 | 100 |

Leitura honesta: a performance não mudou além da variação normal do Lighthouse. O site já estava rápido. As mudanças foram de correção, acessibilidade e funcionalidade, não de peso.

Modo produção, depois das mudanças: `/` com Performance 95, Acessibilidade 100, Boas práticas 100 e SEO 100. `/cardapio` com 97, 98, 100 e 100 na primeira medição. O 98 vinha da ordem de títulos no estado vazio. Depois da correção, nova medição: 97, 100, 100 e 100. No modo demonstração o SEO dá 66 a 69 de propósito: o `noindex` bloqueia o Google enquanto houver conteúdo de exemplo.

Transferência por página (Playwright, cache desligado, 390 px):

| Página | JS antes | JS depois | Total antes | Total depois | Requisições |
|---|---|---|---|---|---|
| `/` | 161,1 KB | 162,0 KB | 298,5 KB | 299,5 KB | 30 |
| `/cardapio` | 161,1 KB | 162,0 KB | 248,2 KB | 249,3 KB | 17 |
| `/cardapio/cappuccino` | 164,4 KB | 165,3 KB | 255,9 KB | 256,9 KB | 21 |
| `/experiencia` | 152,8 KB | 152,8 KB | 275,3 KB | 275,3 KB | 28 |
| `/contato` | 156,9 KB | 156,9 KB | 237,5 KB | 237,6 KB | 17 |

O autocomplete custa cerca de 0,9 KB de JS comprimido. CLS medido em 0 em todas as páginas, nas duas larguras. Nenhuma rolagem horizontal. Nenhum erro de console depois da correção.

Outros números: build entre 12 e 14 s. Dependências: 4 de produção e 8 de desenvolvimento, sem mudança.

## Tabela de decisões

| Otimização | Situação inicial | Decisão | Implementação | Evidência |
|---|---|---|---|---|
| Auditoria de arquitetura | Next 16 App Router, tudo estático, conteúdo local | Implementado | Relatório neste arquivo | Busca por `fetch`, `axios`, `next/script`, `<script`: só o JSON-LD |
| Erro de hidratação no 404 de produto | React #418 em toda `/cardapio/slug-inexistente` no build de produção | Implementado | `dynamicParams = true` em `cardapio/[slug]/page.tsx`. O slug desconhecido cai no `notFound()` e usa o `not-found.tsx` do produto | Antes: 2 erros de console. Depois: status 404, "Produto não encontrado", 0 erros nos modos demonstração e produção |
| Skeletons | `loading.tsx` já existia em `/cardapio` e `/cardapio/[slug]`, com classe `.skeleton` dentro de `prefers-reduced-motion` | Já atendido | Nada. As outras páginas são HTML estático e não ganham tela de carregamento artificial | CLS 0 medido |
| Estados vazio e de erro | `EmptyState` e `error.tsx` existiam | Implementado | Estado vazio dentro do autocomplete. Título do `EmptyState` passou de `h3` para `h2` (mesma classe visual) | Lighthouse `heading-order` falhava no cardápio vazio de produção |
| Requisições duplicadas | Nenhum `fetch` no projeto | Não aplicável | Nada | Lista de requisições. Os pedidos `?_rsc=` são o prefetch de rotas do Next (árvore e segmento) e são arquivos estáticos |
| Deduplicação, AbortController, revalidação | Sem chamadas de dados. `/contato` com `revalidate = 3600` por causa do selo de horário | Já atendido | Nada | `grep revalidate` |
| AVIF e WebP | `images.formats` com AVIF e WebP já configurado | Já atendido | Nada | Hero servido como `image/avif` com 16 KB |
| Imagens responsivas e lazy loading | `next/image` com `sizes`. Hero com `loading="eager"` e `fetchPriority="high"`, foto diferente no celular por `<picture>` | Já atendido | Nada | Lighthouse: hero com prioridade High, começa junto com o CSS. Fotos abaixo da dobra com prioridade Low |
| Qualidade das fotos | Originais com cerca de 335 px, ampliadas em telas grandes | Pendente de infraestrutura | Depende das fotos oficiais | Ver `PENDENCIAS_COMERCIAIS.md` |
| Debounce na busca | Filtro local barato com `useDeferredValue`, mas `history.replaceState` em cada tecla | Implementado | Texto em estado local, URL gravada 300 ms depois de parar de digitar. Grava na hora ao clicar num produto, ao limpar ou ao escolher sugestão | Digitar 10 letras: 0 chamadas durante a digitação (antes 10). O Safari limita `replaceState` e lança `SecurityError` quando passa do limite |
| Autocomplete | Não existia | Implementado | `components/menu/MenuSearch.tsx`: combobox ARIA, setas, Enter abre o produto, Esc fecha sem apagar, destaque ignorando acento, até 6 nomes reais do `menu.ts` | 42 testes passando |
| Paginação | 14 produtos locais | Não aplicável | Nada | Contagem em `menu.ts` |
| Virtualização | 14 produtos | Não aplicável | Nada | Prejudicaria SEO e acessibilidade sem ganho |
| CDN | Sem hospedagem definida | Pendente de infraestrutura | Nada | Vercel e Netlify já incluem CDN. Não configurar uma segunda |
| Cache de assets versionados | `/_next/static` com `public, max-age=31536000, immutable` | Já atendido | Nada | Cabeçalhos medidos |
| Cache de HTML | Páginas estáticas com `s-maxage=31536000`, que é o padrão do Next | Já atendido | Nada | Na Vercel cada deploy invalida o cache. Em outra hospedagem, conferir a invalidação no deploy |
| Filas | Nenhuma tarefa lenta: sem upload, e-mail ou integração | Não aplicável | Nada | O formulário de contato só monta um link do WhatsApp, sem servidor |
| N+1, índices, pool de conexões | Sem banco | Não aplicável | Nada | Nenhum driver ou ORM no `package.json` |
| Compressão HTTP | `next start` entrega gzip em HTML, CSS e JS | Pendente de infraestrutura | Nada | Brotli fica com o provedor (a Vercel já faz). Não ligar compressão no Next e no CDN ao mesmo tempo |
| Redis | Conteúdo compilado no build | Não aplicável | Nada | Não há consulta para guardar em cache. Redis só traria custo e manutenção |
| Dependências | `next`, `react`, `react-dom`, `zod` + 8 de desenvolvimento | Já atendido | Nada removido | Todas usadas. `npm audit --omit=dev`: 0 vulnerabilidades. As 14 "high" estão em ferramentas de lint (`picomatch`) |
| Timeouts e retry | Sem chamadas externas | Não aplicável | Nada | |
| Atualização otimista | O coração já atualiza na hora pelo `useSyncExternalStore` e grava no `localStorage`, com memória de reserva se o storage falhar | Já atendido | Nada | Teste "coração salva no localStorage" |
| Paralelismo | Sem requisições | Não aplicável | Nada | |
| OpenTelemetry | Sem backend | Não aplicável | Nada | Ver RUM |
| Proximidade servidor e banco | Sem banco | Não aplicável | Nada | Ao hospedar, escolher região perto de São Paulo (`gru1` na Vercel) |
| SSG, ISR, SSR | 10 rotas estáticas, produtos por `generateStaticParams`, `/contato` com ISR de 1 h | Já atendido | Nada | Saída do `next build` |
| Componentes cliente isolados | Páginas são Server Components. Cliente só em busca, opções do produto, galeria, menu, horários e formulário | Já atendido | Nada | `grep "use client"` |
| Scripts de terceiros | Nenhum | Já atendido | Nada | |
| Code splitting | Divisão por rota do Next. Galeria e lightbox só nas páginas que usam | Já atendido | Nada | cerca de 153 KB são React e Next (piso do framework). O maior chunk do projeto tem 7 KB (SVGs das ilustrações) |
| Re-renderizações | Filtro com `useMemo` e `useDeferredValue`, lista com `key` por id | Já atendido | Nenhum `memo` extra | Com 14 itens não há custo mensurável. TBT de 30 a 70 ms no cardápio |
| Fontes | Só a Inter, `next/font`, subset latin, `display: swap`, WOFF2 variável de 48 KB auto-hospedado | Já atendido | Nada | CLS 0. Limitar pesos numa fonte variável geraria vários arquivos e aumentaria o total |
| RUM | Inexistente | Pendente de infraestrutura | Nada | Depende da hospedagem. Opção sem dependência: Vercel Speed Insights. Nenhum dado real coletado até agora |
| Testes em celular e rede lenta | | Implementado (simulado) | Playwright 390 px com 4G lento e CPU 4x. Lighthouse mobile. Rolagem horizontal checada em 320 px | Seções acima. Sem aparelho físico |
| Safari, Firefox, leitor de tela real | | Pendente de medição | | Só o Chrome foi usado |

## Pontos de atenção que não foram mexidos

- **LCP mobile simulado de 2,5 a 2,9 s**, um pouco acima da meta de 2,5 s. Na home, o LCP é a foto do hero (16 KB em AVIF, prioridade alta), e o tempo vem da banda do 4G simulado, dividida com a fonte (48 KB) e o JS do framework. Nas páginas internas, o LCP é texto, que é repintado quando a Inter carrega. Trocar para `display: "optional"` melhoraria o número, mas em conexão lenta o visitante veria a fonte do sistema, o que muda o visual aprovado. Fica como decisão do dono.
- **`themeColor` `#f7f2ea`** (creme) com header preto: no Chrome do Android a barra do navegador fica creme. É uma questão visual, não de performance. Ajusto se for pedido.
- **`dynamicParams = true`**: um slug inexistente agora gera um 404 renderizado no servidor, em vez do 404 estático. O custo é desprezível, porque não há dado para buscar.
- **`AGENTS.md`**: o `next dev` cria esse arquivo na raiz. Não foi para o git.

## Pendências para produção

1. Hospedagem com CDN e Brotli (Vercel Pro recomendada), região perto de São Paulo.
2. Ligar o RUM da hospedagem depois da autorização, e só então falar em números reais de usuários.
3. Fotos oficiais em alta resolução. O pipeline do `next/image` já gera AVIF e WebP nos tamanhos certos.
4. Remedir com Lighthouse e PageSpeed Insights na URL publicada.
5. Testar Safari (iPhone), Firefox e leitor de tela (NVDA ou VoiceOver).
