# JDS Cafeteria

Site institucional e cardápio digital da JDS Cafeteria.

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4 e Zod. Sem banco de dados, sem pagamento, sem pedido online.

## Rodando

Precisa de Node 20.9 ou mais novo.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em http://localhost:3000.

| comando | o que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run start` | serve o build |
| `npm run typecheck` | gera os tipos de rota e roda o tsc |
| `npm run lint` | eslint com a config do next |
| `npm run check` | typecheck, lint e build em sequência |

### Variáveis de ambiente

| variável | uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | domínio final, sem barra no fim. Usado em canonical, sitemap, open graph e dados estruturados |
| `SHOW_DRAFT_CONTENT` | `true` mostra o conteúdo de demonstração (com selo). Em `npm run dev` ele já vem ligado se a variável não existir |

O site só libera indexação (robots e meta robots) quando `NEXT_PUBLIC_SITE_URL` está preenchida **e** `SHOW_DRAFT_CONTENT` não é `true`. Versão de apresentação nunca vai pro Google.

## Como o conteúdo funciona

Tudo que é texto comercial mora em `src/content/`. Nenhum componente tem produto, preço ou horário escrito dentro dele.

```
src/content/
  business.ts     nome, endereço, horários, contato, redes, avisos
  menu.ts         categorias e produtos
  highlights.ts   destaques da página Produtos
  gallery.ts      fotos da galeria
  story.ts        textos da Nossa História
  photos.ts       registro das fotos (import + alt + legenda)
```

Cada item tem um status:

- `verified`: dado confirmado pela JDS. Aparece sempre.
- `draft`: demonstração. Só aparece com `SHOW_DRAFT_CONTENT=true` e sempre com o selo "Demonstração".
- `pending` (só na história): bloco que ainda precisa de conteúdo. Em modo demonstração vira um cartão "A preencher". Em produção some.

Os arquivos são validados com Zod quando o site sobe ou faz build (`src/lib/content.ts`). Se tiver id repetido, categoria inexistente, horário mal escrito ou WhatsApp com formato errado, o build para e diz exatamente o campo.

A leitura passa toda por funções como `getMenu()`, `getBusiness()` e `getGallery()`. Quando entrar um CMS, é só trocar o que essas funções leem. As páginas não mudam.

## Editando o cardápio

Em `src/content/menu.ts`:

```ts
{
  id: "p-020",                 // fixo, nunca reaproveitar
  slug: "cafe-com-leite",      // vira o link /cardapio?item=cafe-com-leite
  name: "Café com leite",
  description: "Uma linha, no máximo duas.",
  categoryId: "cafes-tradicionais",
  illustration: "latte",       // desenho usado enquanto nao houver foto
  priceCents: 900,             // R$ 9,00. sem preço aparece "Preço a confirmar"
  variants: [
    { id: "p", label: "Pequeno", volume: "180 ml", priceCents: 900 },
    { id: "m", label: "Médio", volume: "300 ml", priceCents: 1200 },
  ],
  temperature: "hot",          // hot, iced ou both
  availability: "available",   // available, unavailable ou coming-soon
  availabilityNote: "Volta em breve",
  featured: true,              // entra na Seleção da casa da home
  tags: ["novidade"],          // destaque, novidade, sazonal, da-casa
  order: 4,
  dataStatus: "verified",
}
```

Coisas que vale saber:

- Categoria sem nenhum produto visível não aparece no site. Pode deixar todas cadastradas.
- `allergens` só deve ser preenchido com informação conferida pela cozinha: `{ contains: ["leite", "glúten"], checkedAt: "2026-11-20" }`. Sem isso, o detalhe do produto pede para o cliente falar com a equipe.
- Preço de item `draft` aparece com "preço de exemplo" do lado.
- Foto do produto: importe em `photos.ts` e use `image: photos.nomeDaFoto`.

## Página de cada produto

Cada item do cardápio tem uma página própria em `/cardapio/[slug]`, gerada a partir de `src/content/menu.ts`. Nada é duplicado: a página lê o mesmo item do cardápio.

- Slug que não existe cai na tela "Produto não encontrado", com link de volta ao cardápio.
- "Voltar ao cardápio" devolve a pessoa para a mesma categoria, busca e filtros que ela usava. Esse contexto fica na própria URL (`?categoria=`, `?busca=`, `?filtros=`).
- O seletor de tamanho só aparece quando o item tem `variants`, e o preço muda conforme a escolha. Quente e gelado só aparecem quando `temperature` é `"both"`.
- `volume` em cada variante (ex.: `"300 ml"`) aparece nas informações do produto.
- `images` aceita várias fotos e vira uma galeria com miniaturas.
- O botão "Consultar pelo WhatsApp" só aparece com `contact.whatsapp` preenchido e verificado. Ele abre a conversa com o nome do produto e a escolha já escritos, sem enviar nada.
- "Você também pode gostar" mostra até quatro itens: primeiro da mesma categoria, depois destaques, depois o resto disponível.
- Links antigos no formato `/cardapio?item=slug` redirecionam para a página nova.

## Horários e "Aberto agora"

Em `src/content/business.ts`:

```ts
hours: {
  status: "verified",
  timezone: "America/Sao_Paulo",
  week: {
    0: [],                                         // domingo fechado
    1: [{ opens: "07:30", closes: "19:00" }],
    2: [{ opens: "07:30", closes: "12:00" }, { opens: "14:00", closes: "19:00" }],
    3: [{ opens: "07:30", closes: "19:00" }],
    4: [{ opens: "07:30", closes: "19:00" }],
    5: [{ opens: "07:30", closes: "19:00" }],
    6: [{ opens: "08:00", closes: "13:00" }],
  },
  exceptions: [{ date: "2026-12-25", label: "Natal", periods: [] }],
},
```

O selo "Aberto agora / Fechado agora, abre amanhã às 7h30" só aparece com `status: "verified"`. Ele roda no navegador, respeita o fuso informado e as exceções, e atualiza sozinho a cada minuto.

Endereço, WhatsApp e telefone seguem a mesma ideia. WhatsApp e telefone vão só com números, com 55 e DDD (`5511999990000`). Com o WhatsApp preenchido aparecem o botão e o formulário que abre a conversa pronta.

## Trocando as fotos

As fotos atuais são capturas de 335 px de largura que vieram nas referências. Servem para apresentar, mas ficam borradas em tela grande. Antes de publicar:

1. Coloque os originais em `src/assets/photos/` com o mesmo nome (`fachada.jpg`, `interior.jpg` etc). Pode ser JPG grande, o Next gera AVIF/WebP e os tamanhos certos sozinho.
2. Se mudar o enquadramento, ajuste `position` em `src/content/photos.ts` (ex: `"50% 20%"`).
3. Revise o `alt` de cada foto no mesmo arquivo.
4. Troque `public/og.jpg` (1200 x 630) pela imagem de compartilhamento final.

Foto nova é só importar em `photos.ts` e usar onde quiser.

O logo hoje é tipográfico (`src/components/layout/Logo.tsx`). Quando tiver o SVG oficial, troque o conteúdo desse componente e o `src/app/icon.svg`.

## Estrutura

```
src/
  app/                rotas, layout, sitemap, robots, ícone
  components/
    layout/           header, footer, hero das páginas, json-ld
    home/             seções da home
    menu/             cardápio (card, modal, navegação)
    gallery/          galeria com lightbox
    business/         horários
    forms/            formulário de WhatsApp
    ui/               botões, tags, títulos, feedback, foto
  content/            dados editáveis
  hooks/              seleção salva e estado na url
  lib/                schemas, leitura do conteúdo, horários, formatação
  types/              tipos derivados dos schemas
```

## Direção de arte

Visual comercial: header escuro, fundos claros, fotografia grande e chamadas evidentes.

- Cores: header e rodapé `#171717`, fundo `#FFFFFF`, fundo secundário `#F7F5F2`, texto `#24201D`, marrom `#573628` e caramelo `#B97735`. Nos textos e botões o caramelo usa uma versão mais escura (`#9C5F22`) para passar no contraste AA.
- Tipografia: Inter em tudo. Escala em `globals.css` (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lede`).
- Hero: foto em largura total, overlay preto e conteúdo centralizado. As fotos ficam em `heroPhotos`, dentro de `src/content/photos.ts`: hoje a fachada no celular e a xícara no desktop. Para trocar por uma foto horizontal do salão em alta resolução, basta importar o arquivo e apontar `heroPhotos.desktop` para ela.
- Home organizada em conversões: hero (cardápio), destaques (todos os produtos), história (conhecer a cafeteria) e convite final (visitar ou contato).
- Movimento: entrada do título, subtítulo e botões, zoom lento na foto do hero e leve elevação dos cards no hover. Com `prefers-reduced-motion`, nada se move.

### Versões

O projeto tem histórico git. O design anterior está marcado como `v3-limpo` (`git checkout v3-limpo` para ver).

### Imagens dos produtos

Ainda não existem fotos dos produtos. Para não usar foto falsa, cada item tem uma ilustração própria (`components/menu/ProductIllustration.tsx`), marcada com o selo "Ilustração". O campo `illustration` no cardápio escolhe o desenho. Quando entrar a foto real, preencha `image` no item e ela substitui a ilustração no card e no detalhe.

## Decisões

- **Sem Motion, Lenis e Lucide.** O movimento ficou restrito ao que ajuda: hover discreto e abertura e fechamento de modais com `@starting-style`. Com `prefers-reduced-motion` tudo para. Ícones são SVG próprios (`components/ui/Icon.tsx`).
- **Modais com `<dialog>` nativo.** Foco preso, Escape e fundo inerte vêm do navegador.
- **Seleção de itens** fica no `localStorage` do aparelho. Não é carrinho e não envia nada.
- **Estado do cardápio na URL** (`?categoria=` e `?item=`), então dá pra mandar o link de um item direto.
- **Sem formulário com backend.** O formulário de contato só monta a mensagem e abre o WhatsApp.

## Verificação

Rodado nesta entrega, num ambiente sem acesso ao npm. Por isso `npm install`, `next build` e `eslint` **não foram executados**. Rode `npm run check` antes de publicar.

O que foi feito no lugar:

- Checagem de tipos de todo o `src` com `tsc --strict --noUncheckedIndexedAccess --noUnusedLocals`, usando declarações mínimas de React e Next no lugar dos pacotes. Sem erros.
- CSS compilado com o Tailwind 4.3 de verdade a partir do `globals.css`. Todas as classes usadas geram CSS.
- Páginas renderizadas com React 19 (`renderToString`) e hidratadas no Chrome, com `next/link`, `next/image` e `next/font` substituídos por versões simples. Sem erro de hidratação nem de console.
- Inspeção visual por captura de tela em 320, 375, 390, 430, 768, 1024, 1440 e 1920 px, com as capturas analisadas e os problemas corrigidos.
- 117 testes automatizados no Chrome (Playwright), todos passando:
  - cardápio: busca com e sem acento, estado vazio, categorias, busca e filtros na URL, item indisponível, seleção salva sobrevivendo a reload;
  - página de produto: abertura pelo card, volta ao cardápio com a busca, preço mudando com o tamanho, quente e gelado, WhatsApp só com número oficial e com a mensagem certa, relacionados, navegação entre produtos, slug inexistente e link antigo `?item=`;
  - menu mobile: abre, `aria-expanded`, Escape, navegação;
  - galeria: abre, setas do teclado, botões, volta circular, Escape;
  - formulário: erros no blur e no envio, foco no primeiro erro, link `wa.me` com assunto e mensagem;
  - horários: lógica de aberto/fechado testada à parte com almoço, feriado, fim de semana e virada de fuso;
  - modo produção sem dados: nenhum selo de demonstração, nenhum aviso de configuração, estados vazios no lugar;
  - skip link, troca do header ao rolar, `prefers-reduced-motion`, um `h1` por página, hierarquia de títulos, `alt` em todas as imagens, botões com nome acessível, links internos válidos;
  - sem rolagem horizontal em 320, 375, 390, 430, 768, 1024, 1440 e 1920 px.

Ficou sem verificar aqui: build real do Next 16, ESLint, otimização de imagem do `next/image`, carregamento da Inter pelo Google Fonts (as capturas usaram a Inter instalada localmente, então a tipografia das capturas é a mesma do site), Lighthouse e Core Web Vitals, Safari e Firefox, leitor de tela real.

## Publicação

1. Rodar `npm run check` e corrigir o que aparecer.
2. Trocar as fotos pelos originais.
3. Preencher pelo menos endereço, horários e WhatsApp em `business.ts` com `status: "verified"`.
4. Trocar os produtos de demonstração pelos reais (ou deixar o cardápio vazio até ter os dados).
5. Na Vercel: importar o repositório, definir `NEXT_PUBLIC_SITE_URL` e **não** definir `SHOW_DRAFT_CONTENT`.
6. Depois de publicar: Lighthouse no celular, cadastrar o domínio no Google Search Console e mandar o `sitemap.xml`, e conferir se o endereço bate com o Perfil da Empresa no Google.

Para uma prévia de apresentação, faça um deploy separado com `SHOW_DRAFT_CONTENT=true`. Ele sai com `noindex`.

Lista do que falta da JDS: [PENDENCIAS.md](./PENDENCIAS.md).
