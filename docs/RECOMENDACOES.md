# Recomendações no carrinho

Ao clicar em "Finalizar pedido" (página do carrinho ou gaveta lateral), o site pode mostrar "Que tal algo para acompanhar?" com um produto que combina com o pedido. O cliente adiciona, vê detalhes, pede outra sugestão (até 3) ou continua sem adicionar.

## Regras de experiência

- Aparece no máximo uma vez por checkout (marca na sessão, apagada quando um pedido é finalizado).
- Fechar (X, Esc ou clique fora) volta ao carrinho. O próximo clique em "Finalizar pedido" vai direto.
- "Continuar sem adicionar" sempre visível. Nada é adicionado sem clique.
- Sem contador, sem "últimas unidades", sem urgência.
- Preço mostrado é o cadastrado, pelo mesmo cálculo do carrinho (`unitPrice`). Item com variações mostra "a partir de".
- Item que exige escolha (sabor, borda, temperatura) mostra "Escolher opções" e abre a página do produto, em vez de adicionar sozinho.
- Sem sugestão possível, o clique segue direto para o checkout.

## Quando não aparece

Só existe com a compra ligada (`SHOW_DRAFT_CONTENT=true`). Em produção real o motor só aceita produtos `verified` com disponibilidade confirmada (`available`). Hoje nenhum produto cumpre isso, então não há recomendação fictícia em produção.

## Motor (`src/lib/recommend/engine.ts`)

Função pura, sem React e sem acesso a dados. Recebe o carrinho, os candidatos, a configuração e o contexto, e devolve sugestões ordenadas.

Um candidato só entra se:

1. não está no carrinho;
2. pode ser pedido pelo site (`orderBlock`: nem indisponível nem com restrição de idade);
3. tem preço;
4. tem status permitido e, em produção, disponibilidade confirmada;
5. existe na unidade escolhida.

Pontuação:

- **Par escolhido pela casa** (`productPairs`): 1000 + prioridade. Sempre acima das regras.
- **Regra por papel de categoria** (`pairingRules`): peso da regra. Ex.: café sugere bolo (34), doce (30), salgado (22); salgado sugere café (32); bebida gelada sugere sobremesa (30).
- Uma regra não sugere um papel que o carrinho já tem (com bolo no carrinho, não sugere outro doce), e nunca sugere segunda bebida.
- Escolha do cliente conta: Mocha pedido gelado vira "bebida gelada".
- Empate: destaque, depois ordem do cardápio. As 3 sugestões variam de categoria antes de repetir.

Os papéis vêm da categoria (`roles` em `menu.ts` e `officialMenu.ts`): bebida, cafe, bebida-quente, bebida-gelada, doce, sobremesa, bolo, salgado.

## Clima

As regras aceitam `weather: "calor" | "frio"`. Regra com clima só vale quando o contexto traz clima. Hoje o contexto nunca traz (não há integração meteorológica), então só valem as regras de carrinho e cardápio. Testado em `tests/recommend.test.ts`.

## Painel futuro: "recomendar juntos"

O painel só precisa gravar e ler registros neste formato (`ProductPair`), sem novo cadastro de produto:

| Campo | Uso |
| --- | --- |
| `productId` | Produto no carrinho (ID estável do cardápio, ex.: `jds-001`). |
| `pairedProductId` | Produto sugerido (mesmo cadastro). |
| `priority` | Maior aparece primeiro. |
| `unitId` | `null` vale para as duas unidades; `centro` ou `br116` restringe. |
| `active` | Desligar sem apagar. |

Hoje a lista fica em `src/content/pairings.ts`, vazia. Telas previstas: escolher um produto, ver as sugestões automáticas que ele gera, fixar até 3 acompanhamentos com ordem e unidade, ativar ou desativar. O painel também pode ajustar os pesos de `pairingRules`.

## Matas ERP (módulo `foodservice`)

Analisado em `Documents/GitHub/matas-erp` (somente leitura, nada alterado). O módulo `foodservice` está declarado (`packages/schemas/src/core.ts`, ADR 014), mas ainda não tem tabelas de produto, cardápio ou venda. As convenções do núcleo que o site já respeita ou prepara:

- **Empresa e unidade:** todo fato operacional tem `tenant_id` e `operating_unit_id`. No site, `unitId` (`centro`, `br116`) é o ponto de ligação: basta um mapa `unitId -> operating_unit_id`.
- **IDs:** o ERP usa `uuid`. Os IDs do cardápio (`jds-001`...) são estáveis e devem virar uma referência externa no produto do ERP (ex.: `external_ref`), sem trocar o ID do site.
- **Pares:** sugestão de tabela futura `foodservice_product_pairings (tenant_id, id uuid, product_id, paired_product_id, operating_unit_id null, priority, active)`, com RLS por `tenant_id` como as demais.
- **Idempotência:** vendas no ERP usam `request_id`. Quando o pedido do site for real, cada pedido envia um `request_id` gerado no navegador.
- **Separação:** o motor e o preço não dependem de banco. A troca do arquivo pela API do ERP fica em `getOrderConfig` (`src/lib/order/catalog.ts`).

## Testes

- `tests/recommend.test.ts`: regras, unidade, bloqueios, status, disponibilidade, par da casa, clima, variedade.
- Navegador (Playwright): sugestão aparece, aceitar, recusar, fechar com Esc, não repetir, carrinho completo sem sugestão, gaveta lateral, celular como gaveta inferior, acessibilidade do diálogo.
