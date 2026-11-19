# JDS Cafeteria

Site institucional com cardápio digital e página para cada produto. Na versão de apresentação existe um fluxo de compra demonstrativo (carrinho, checkout e acompanhamento), sem pagamento real e sem envio de pedido. Detalhes em `docs/COMPRA_DEMONSTRATIVA.md`.

O que já é real e o que ainda é exemplo está em [PENDENCIAS_COMERCIAIS.md](./PENDENCIAS_COMERCIAIS.md).

## Tecnologias

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, páginas estáticas) |
| Interface | React 19, TypeScript em modo strict |
| Estilo | Tailwind CSS 4 com tokens em `src/app/globals.css` |
| Fonte | Inter, servida pelo próprio site via `next/font` |
| Validação | Zod, para checar todo o conteúdo no build |
| Imagens | `next/image` (AVIF e WebP automáticos) |

Sem banco de dados, sem biblioteca de animação, sem pacote de ícones e sem serviços de terceiros. As dependências de produção são quatro: `next`, `react`, `react-dom` e `zod`.

## Estrutura

```
src/
  app/                  rotas
    page.tsx            início
    cardapio/           cardápio e /cardapio/[slug] (página do produto)
    nossa-historia/
    experiencia/
    produtos/           produtos e novidades
    contato/
    sitemap.ts, robots.ts, error.tsx, not-found.tsx
  content/              tudo que a cafeteria pode querer mudar
    business.ts         nome, logo, descrição, endereço, horários, contatos, redes, avisos
    menu.ts             categorias e produtos
    home.ts             textos da página inicial
    story.ts            história, capítulos e jeito de receber
    highlights.ts       destaques da página Produtos
    gallery.ts          fotos da galeria
    photos.ts           registro de fotos (arquivo, texto alternativo, legenda, enquadramento)
  assets/photos/        arquivos das fotos
  components/           peças da interface
  lib/                  validação, leitura do conteúdo, horários, formatação, SEO
public/og.jpg           imagem de compartilhamento
```

Nenhum componente tem preço, telefone, endereço ou horário escrito dentro dele. Tudo sai de `src/content/`.

## Instalação e execução

Precisa de Node 20.9 ou mais novo (o arquivo `.nvmrc` indica a 22).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em http://localhost:3000.

| comando | o que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run typecheck` | gera os tipos das rotas e roda o TypeScript |
| `npm run lint` | ESLint com a configuração oficial do Next |
| `npm run build` | build de produção |
| `npm run start` | serve o build localmente |
| `npm run check` | typecheck, lint e build, nessa ordem |

### Variáveis de ambiente

| variável | uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | domínio final, com https. Usado em canonical, sitemap, Open Graph e dados estruturados. Se estiver com formato errado, o build para com uma mensagem clara |
| `SHOW_DRAFT_CONTENT` | `true` mostra o conteúdo de exemplo, sempre identificado. Em `npm run dev` já vem ligado se a variável não existir |

O Google só é liberado (robots e meta robots) quando `NEXT_PUBLIC_SITE_URL` está preenchida e `SHOW_DRAFT_CONTENT` não é `true`. A versão de demonstração nunca é indexada.

## Como o conteúdo funciona

Cada item de conteúdo tem um status:

- `verified`: confirmado pela JDS. Aparece sempre.
- `draft`: exemplo. Só aparece com `SHOW_DRAFT_CONTENT=true` e sempre marcado como exemplo.
- `pending` (só na história): bloco esperando conteúdo. Na demonstração vira um cartão "A preencher". Em produção some.

Todo o conteúdo é validado com Zod quando o site sobe e no build (`src/lib/content.ts`). Id repetido, categoria inexistente, horário mal escrito, link sem https ou telefone em formato errado fazem o build parar apontando o campo.

As páginas leem o conteúdo só por funções como `getMenu()`, `getProduct()` e `getBusiness()`. Para trocar os arquivos por um CMS no futuro, basta mudar o que essas funções leem.

## Nome, logo e textos

Em `src/content/business.ts`:

```ts
name: "JDS Cafeteria",
shortName: "JDS",
tagline: "Café, pausa e encontro",
description: "Texto curto usado no rodapé e no Google.",
logo: undefined,
```

Títulos, descrições do Google, textos das páginas e a mensagem do WhatsApp usam `name` e `shortName`. Trocar aqui muda o site inteiro. Só os textos alternativos das fotos citam a JDS por escrito, porque descrevem o letreiro e a xícara.

Sem logo, o site mostra o nome em texto. Para usar o logo oficial, coloque o arquivo em `src/assets/brand/`, importe e preencha:

```ts
import logo from "@/assets/brand/logo.png";

logo: { src: logo, alt: "JDS Cafeteria" },
```

Os textos da página inicial ficam em `src/content/home.ts`. A história fica em `src/content/story.ts`, incluindo o topo e a descrição da página Nossa História. Os textos curtos das outras páginas ficam no próprio arquivo da página, em `src/app/`.

## Editando o cardápio

Categorias e produtos ficam em `src/content/menu.ts`. Um produto completo:

```ts
{
  id: "p-020",                 // fixo, nunca reaproveitar
  slug: "cafe-com-leite",      // vira /cardapio/cafe-com-leite
  name: "Café com leite",
  description: "Uma ou duas linhas.",
  categoryId: "cafes-tradicionais",
  image: photos.cafeComLeite,  // foto real do produto (opcional)
  images: [photos.a, photos.b],// várias fotos viram galeria (opcional)
  illustration: "latte",       // desenho usado enquanto nao houver foto
  priceCents: 900,             // R$ 9,00
  variants: [
    { id: "p", label: "Pequeno", volume: "180 ml", priceCents: 900 },
    { id: "m", label: "Médio", volume: "300 ml", priceCents: 1200 },
  ],
  temperature: "both",         // hot, iced ou both (both mostra quente e gelado)
  ingredients: ["café", "leite integral"],
  allergens: { contains: ["leite"], checkedAt: "2026-11-20" },
  availability: "available",   // available, unavailable ou coming-soon
  availabilityNote: "Volta em breve",
  featured: true,              // entra nos destaques da home
  tags: ["novidade"],          // destaque, novidade, sazonal, da-casa
  order: 4,
  dataStatus: "verified",
}
```

Regras que valem a pena saber:

- Categoria sem produto visível não aparece no site.
- Só cadastre `ingredients` e `allergens` com informação conferida pela cozinha. Sem isso, a página do produto orienta o cliente a falar com a equipe.
- Seletor de tamanho só aparece quando existe `variants`. Quente e gelado só aparecem com `temperature: "both"`.
- Produto `draft` mostra "preço de exemplo" ao lado do valor.

### Atualizando preços

Os preços ficam em centavos (`priceCents: 1250` é R$ 12,50), no produto ou em cada tamanho. O site mostra o menor valor como "a partir de" quando os tamanhos têm preços diferentes. Depois de editar, rode `npm run build` (ou faça o deploy) para publicar.

## Página do produto

Cada item tem uma página em `/cardapio/[slug]`, gerada no build a partir do mesmo cadastro.

- "Voltar ao cardápio" devolve a pessoa à mesma categoria, busca e filtros.
- O preço muda com o tamanho escolhido.
- "Consultar pelo WhatsApp" só aparece com número oficial configurado e abre a conversa com o produto e a escolha escritos, sem enviar nada.
- "Você também pode gostar" mostra até quatro itens: mesma categoria, depois destaques, depois o resto.
- Endereço inexistente mostra "Produto não encontrado". Links antigos `/cardapio?item=slug` redirecionam.
- Produtos verificados ganham dados estruturados `MenuItem` para o Google. Produtos de exemplo não.

## Trocando as fotos

As fotos atuais têm 335 px de largura. Funcionam na demonstração, mas ficam borradas em telas grandes.

1. Coloque os originais em `src/assets/photos/` com o mesmo nome do arquivo atual. Pode ser JPG grande: o Next gera os tamanhos e formatos certos.
2. Ajuste o enquadramento em `src/content/photos.ts` (`position: "50% 30%"`) se precisar.
3. Revise o texto alternativo (`alt`) de cada foto no mesmo arquivo.
4. Para o hero, `heroPhotos` em `photos.ts` define a foto do celular e a do computador. O ideal no computador é uma foto horizontal do salão em alta resolução.
5. Troque `public/og.jpg` (1200 x 630), a imagem que aparece ao compartilhar o link.

Foto de produto vai no próprio item do cardápio (`image` ou `images`) e substitui a ilustração.

## Configurando contatos

Em `src/content/business.ts`:

```ts
address: {
  status: "verified",
  street: "Rua Exemplo",
  number: "123",
  district: "Centro",
  city: "Cidade",
  state: "MG",
  postalCode: "00000-000",
  mapsUrl: "https://maps.app.goo.gl/...",
},
hours: {
  status: "verified",
  timezone: "America/Sao_Paulo",
  week: {
    0: [],
    1: [{ opens: "07:30", closes: "19:00" }],
    2: [{ opens: "07:30", closes: "12:00" }, { opens: "14:00", closes: "19:00" }],
    3: [{ opens: "07:30", closes: "19:00" }],
    4: [{ opens: "07:30", closes: "19:00" }],
    5: [{ opens: "07:30", closes: "19:00" }],
    6: [{ opens: "08:00", closes: "13:00" }],
  },
  exceptions: [{ date: "2026-12-25", label: "Natal", periods: [] }],
},
contact: {
  status: "verified",
  whatsapp: "5531999999999",
  phone: "553133333333",
},
```

- WhatsApp e telefone vão só com números, com 55 e DDD.
- Com endereço, aparecem o botão "Como chegar", o endereço no rodapé e os dados no Google.
- Com horários verificados, aparece o selo "Aberto agora / Fechado agora", que respeita o fuso e as exceções.
- Com WhatsApp, aparecem o botão no rodapé, o formulário do contato e "Consultar pelo WhatsApp" nos produtos.
- O Instagram fica em `social`.
- Avisos temporários (feriado, horário especial) ficam em `announcements`, com data de início e fim.

## Deploy

O site é quase todo estático e funciona em qualquer hospedagem compatível com Next.js. O caminho mais simples é a Vercel.

1. Rode `npm run check` e corrija o que aparecer.
2. Suba o projeto para um repositório Git privado.
3. Na hospedagem, configure `NEXT_PUBLIC_SITE_URL` com o domínio final e **não** defina `SHOW_DRAFT_CONTENT`.
4. Aponte o domínio para a hospedagem.
5. Depois de publicado: rode o Lighthouse no celular, cadastre o domínio no Google Search Console, envie o `sitemap.xml` e confira se o endereço bate com o Perfil da Empresa no Google.

Para uma prévia de apresentação, faça um deploy separado com `SHOW_DRAFT_CONTENT=true`. Ele sai com `noindex`. Não publique nenhuma das duas versões sem autorização da JDS.

O `next.config.ts` já envia cabeçalhos de segurança (sem iframe de terceiros, `nosniff`, HSTS, política de referência e permissões).

## Verificação

Este projeto foi montado num ambiente sem acesso ao npm. Por isso `npm install`, `npm run lint` e `npm run build` **não foram executados** aqui. Rode `npm run check` antes de qualquer publicação.

O que foi verificado no lugar:

- TypeScript strict em todo o `src`, com declarações mínimas de React e Next, sem erros.
- CSS compilado com o Tailwind 4 de verdade. Todas as classes usadas geram CSS.
- Páginas renderizadas com React 19 e hidratadas no Chrome, sem erro de hidratação nem de console.
- 117 testes de interação no Chrome (Playwright) e mais 17 testes de hero, rodapé, teclado e segurança, todos passando.
- Auditoria automática de 9 páginas em 320, 375, 390, 430, 768, 1024 e 1440 px:
  - nenhuma rolagem horizontal;
  - nenhum texto abaixo do contraste AA;
  - nenhum alvo de toque menor que 24 px;
  - nenhum erro de console.
- Contraste do texto do hero medido sobre a foto, no pior ponto: 5,7:1.

Ficou sem verificar: build real do Next, ESLint, otimização de imagem do `next/image`, Lighthouse e Core Web Vitals reais, Safari e Firefox, leitor de tela real.

## Versões

O projeto tem histórico Git com marcos de design: `v3-limpo`, `v4-comercial`, `v5-produto` e `v6-entrega`. Para ver uma versão antiga, use `git checkout <nome>`.
