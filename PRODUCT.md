# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Leitor principal hoje: o dono da Cafeteria JDS, avaliando o site como entrega de um projeto já contratado. Ele precisa ver a casa dele bem apresentada e entender o que ainda depende dos dados dele.
- Público depois da publicação oficial: clientes da cafeteria em São João do Manhuaçu (MG), que querem ver o cardápio e os preços, saber onde fica cada unidade e decidir ir até lá ou chamar no WhatsApp.

## Product Purpose

Site institucional com cardápio digital da Cafeteria JDS. Mostra a casa, o cardápio com busca e filtros, uma página por produto, a história, o ambiente e o contato. Não vende online.

Sucesso agora: o dono aprova o site e envia os dados oficiais (cardápio, preços, fotos, horários, contatos). Sucesso depois: clientes encontram a unidade certa, veem o cardápio dela e vão até a cafeteria.

## Positioning

É o site de uma cafeteria real e específica: fachada de ripas de madeira avermelhada, letreiro "Cafeteria JDS", tijolo aparente, prateleiras de madeira, plantas e a xícara própria com o logo. Duas unidades na mesma cidade, uma no centro e outra na beira da BR 116, cada uma com o próprio cardápio.

## Operating Context

- Projeto contratado. O dono ainda não enviou cardápio, preços, fotos em alta resolução, horários, WhatsApp, telefone nem a história.
- O site no ar (https://cafeteriajds.vercel.app) é a versão de apresentação: conteúdo de exemplo sempre identificado e bloqueio de indexação (`noindex`).
- Código em https://github.com/Haisemsinho/cafeteriajds, deploy na Vercel (conta haisemsinho).

## Capabilities and Constraints

- Next.js 16 (App Router, páginas estáticas), React 19, TypeScript estrito, Tailwind CSS 4, Zod 4. Todo o conteúdo fica em `src/content/` e é validado no build.
- Cardápio com busca, autocomplete, categorias, filtros, "minha seleção" no aparelho e página por produto com variações de tamanho. Consulta pelo WhatsApp só com número oficial.
- Compra demonstrativa (aprovada em 18/11/2026): unidade, personalização, carrinho, checkout em 4 etapas, pagamento simulado e "Minhas compras", só na versão de apresentação (`SHOW_DRAFT_CONTENT=true`). Nenhum pagamento real, nenhum pedido enviado à cafeteria. Em produção as rotas de compra ficam desligadas.
- Fora do escopo: pagamento real, envio de pedido à cafeteria, emissão fiscal e painel administrativo.
- Unidades (informadas pelo responsável do projeto em 18/11/2026):
  - Unidade da cidade: Avenida Jacob Dornelas Neto, São João do Manhuaçu, MG.
  - Unidade da rodovia: Rodovia Santos Dumont, BR 116 (Rio-Bahia), Córrego Caratinga, área rural, São João do Manhuaçu, MG, CEP 36918-000.
- Decisão em aberto: as duas unidades têm cardápios diferentes, e o site hoje modela uma unidade e um cardápio só. Falta definir como o visitante escolhe a unidade e como o conteúdo de cada uma fica organizado.
- Ainda não confirmados: horários de cada unidade, WhatsApp, telefone, número dos endereços e o cardápio de cada uma.

## Brand Commitments

- Nome: Cafeteria JDS (forma curta JDS). Instagram @cafeteriajds.
- Tagline em uso: "Café, pausa e encontro".
- Idioma: português do Brasil, tom acolhedor e direto.
- Regras do projeto: nunca apresentar dado inventado como oficial (produto, preço, endereço, horário, avaliação, história); conteúdo de exemplo sempre identificado; nunca usar travessão nos textos.
- Logo oficial ainda não enviado. Hoje o logo é tipográfico.

## Evidence on Hand

- Fotos reais da casa em `src/assets/photos/` (fachada, letreiro, varanda, interior, prateleiras, balcão, xícara com logo, peça do Dia do Café). Baixa resolução, cerca de 200 a 386 px de largura.
- Fotos ilustrativas de bancos de imagem em `src/assets/photos/ilustrativas/`, com créditos e licenças em `src/content/illustrative.ts` e `docs/DIRECAO_VISUAL.md`. Só aparecem na versão de apresentação, com selo.
- Não existem: depoimentos, avaliações, números de clientes, prêmios, história escrita da casa, preços oficiais. Não inventar.

## Product Principles

1. Verdade antes de efeito: o que não foi confirmado pelo dono aparece como exemplo ou não aparece.
2. A casa real lidera: a identidade vem da JDS de verdade, não de uma cafeteria genérica.
3. O cardápio é a ferramenta principal: achar um item, ver o preço e decidir ir precisa ser rápido no celular.
4. Cada unidade é um lugar: endereço, cardápio e informações não podem se misturar entre as duas.
5. Vitrine com demonstração de compra: a compra existe só como protótipo identificado; nada é cobrado nem enviado. O caminho real continua sendo a visita ou o WhatsApp até a JDS aprovar uma operação de pedidos.

## Accessibility & Inclusion

Padrão WCAG 2.2 AA: contraste mínimo, foco visível, navegação por teclado, alvos de toque de pelo menos 24 px (44 px nos controles principais) e respeito a `prefers-reduced-motion`.
