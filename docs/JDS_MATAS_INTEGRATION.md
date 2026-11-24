# JDS Gestão Comercial: integração com o Matas ERP (M0)

Auditoria feita em 23/11/2026, somente leitura. Nada foi alterado no Matas ERP.

Painel: **JDS Gestão Comercial**. Base comercial: núcleo do Matas ERP. Fora do escopo: todo o módulo agrícola (`coffee`).

## Andamento

| Checkpoint | Situação |
| --- | --- |
| M0 | Concluído (este documento) |
| P13 do Matas | Commitado como estava (`5a38443`), autorizado pelo responsável, depois de `npm run check` 80 + 37 |
| M1 | Código na branch `jds-gestao` do Matas (`9b35f3f`): migração 0009 (papéis `cashier`, `attendant`, `stockkeeper` e cargo), permissões `fs.*`, membros com cargo. `npm run check` 83 + 40. Teste de banco escrito, **não executado** (aguarda A1). Migração não aplicada em nenhum banco |
| M2 a M9 | Não iniciados |

Decisões de 23/11/2026: o painel reaproveita a SPA do Matas com tema e nome JDS Gestão Comercial; papéis novos no núcleo; hospedagem decidida depois, tudo local até lá; o site continua com pedido demonstrativo.

Para continuar com testes de banco: rodar a etapa A1 do Matas (`docs/matas/11-ambientes.md`), que exige a senha do `postgres` digitada no PowerShell.

## 1. Onde está cada código

| Projeto | Caminho | Estado |
| --- | --- | --- |
| Site JDS | `Downloads/jds-cafeteria/jds-cafeteria` | Next.js 16 estático na Vercel, sem servidor próprio nem banco |
| Matas ERP (fonte real) | `Documents/GitHub/matas-erp` | Último commit `b9295a5` (11/11/2026, auditoria P12). Há trabalho de P13 **não commitado** (migração 0008, limite de login, separação de ambientes) |
| Matas ERP (cópia antiga) | `Downloads/matas-erp-m0/nexora` | Instantâneo de 09/11: só interface web com dados fictícios, sem API e sem banco. Não usar como base |

Aviso: como o repositório do Matas tem alterações em andamento de outra frente (P13), nenhuma implementação deve começar lá antes de esse trabalho ser commitado.

## 2. Diagnóstico real do Matas ERP

O plano original falava em React, TypeScript, NestJS, PostgreSQL e arquitetura modular. Conferido no código:

| Item | Real | Observação |
| --- | --- | --- |
| API | NestJS + Fastify, rotas `/v1` | `apps/api` |
| Banco | PostgreSQL 18 local, migrações SQL próprias (0001 a 0008) | Testado só no 18.3; PG 16 pendente |
| Web | React SPA | Toolchain provisória (esbuild, roteador mínimo, ADR-012), não Vite |
| Contratos | Zod em `packages/schemas` | Decimais trafegam como texto (`"8.90"`) |
| Dinheiro | `packages/domain/decimal.ts`, bigint com 6 casas, arredondamento half-even | No banco: `numeric(20,2)` |
| Multiempresa | `tenant_id` em toda tabela, RLS forçado, `SET LOCAL app.tenant_id` por transação | Testes de isolamento T-ISO-01..11 |
| Unidades | `operating_units` (tipos `farm`, `warehouse`, `office`, `store`) + `unit_access` por usuário | Filtro de unidade validado no servidor (`unitFilter`) |
| Autenticação | Sessão por cookie `HttpOnly`, `SameSite=Lax`, token com hash no banco | `Secure` exigido se exposto |
| CSRF | Origem conhecida + cabeçalho `x-requested-with: matas` | Testado (T-AUTH-07) |
| Autorização | Nega por padrão: rota precisa de `@Public`, `@SessionOnly` ou `@RequirePermission` | Papéis: `owner`, `manager`, `operator`, `viewer` |
| Módulos | `tenant_modules` (`coffee`, `foodservice`) + `ModuleGuard` | `foodservice` só existe como nome: **sem tabelas, rotas ou telas** |
| Auditoria | `audit_log` só de inclusão (sem UPDATE/DELETE para o app) | |
| Idempotência | `request_id` único por empresa nas operações | Vendas, transferências, despesas |
| Estoque | Razão só de inclusão, saldo nunca negativo sob concorrência | **Só para lotes de café** (`coffee_stock_movements`) |
| Vendas | Com estorno e trilha | **Só café** (`coffee_sales`, por kg/saca/t) |
| Despesas | Tabela genérica `expenses` (unidade, data, categoria, valor, natureza, realizada/estimada, anulação auditada) | Única tabela comercial genérica pronta |
| Pessoas | `parties` (cliente/fornecedor) | |
| Backup | `pg_dump` cifrado, restauração só em banco de ensaio | Ensaio com banco real pendente (B1) |
| Situação | **NO-GO para dados reais** (`docs/matas/prontidao-piloto.md`) | Bloqueadores: B1 backup real, B2 HTTPS, B3 revisão jurídica, B4 regras do cliente |

Planejado mas **não implementado**: núcleo de itens/produtos genérico, estoque genérico, PDV, pedidos, caixa, funcionários com cargo, pagamentos.

## 3. Diagnóstico real do site JDS

| Item | Real |
| --- | --- |
| Produtos | Arquivo JSON conferido (`src/content/import/cardapio-centro-conferido-2026-11-23.json`), 46 itens, IDs estáveis `jds-001`...`jds-046`, preço em centavos (inteiro), só unidade Centro |
| Unidades | `centro` e `br116` em `src/content/units.ts` (endereço, entrega de exemplo) |
| Opções | Grupos de escolha (`sabor`, `borda`, tamanho, etc.) com acréscimo em centavos (`src/lib/order/pricing.ts`) |
| Carrinho | `localStorage` do navegador |
| Pedidos | **Demonstrativos**: `sessionStorage`, número `DEMO-0000`, status avançado à mão. Nenhum pedido chega à cafeteria |
| Pagamento | Simulado, sem dado de cartão |
| Recomendações | Motor puro (`src/lib/recommend/engine.ts`) e pares da casa (`src/content/pairings.ts`) |

## 4. Comparação dos modelos

| Conceito | JDS hoje | Matas hoje | Adaptação |
| --- | --- | --- | --- |
| Empresa | Implícita | `tenants` | Criar a empresa "Cafeteria JDS" como tenant com `foodservice` ativo e `coffee` inativo |
| Unidade | `centro`, `br116` (texto) | `operating_units` (uuid, tipo `store`) | Mapa `unitId -> operating_unit_id`; o site continua usando o código curto |
| Produto | ID `jds-001`, JSON | Não existe | Tabela nova `fs_products` com `external_ref = 'jds-001'` |
| Preço | Centavos inteiros, igual nas unidades | `numeric(20,2)` + texto canônico | API fala texto canônico; o site converte para centavos na borda |
| Preço por unidade | Não existe | Não existe | `fs_product_prices (product, unit, price, vigência)` |
| Opções | Grupos com acréscimo | Não existe | `fs_option_groups` e `fs_options` |
| Pedido | Navegador, demonstrativo | Não existe | `fs_orders`, `fs_order_items`, `fs_order_events` |
| Pagamento | Simulado | Não existe | `fs_payments`, separado do status do pedido |
| Estoque | Não existe | Só café | `fs_stock_movements` no mesmo padrão do razão do café |
| Despesas | Não existe | `expenses` genérica | Reaproveitar; falta status de pagamento (pago/a pagar) |
| Funcionários | Não existe | `users`, `memberships`, `unit_access` | Falta cargo e papéis de caixa, atendente e estoquista |
| Dinheiro | Inteiro em centavos | bigint 6 casas | Ambos exatos; regra única de conversão na API |

## 5. O que reaproveitar do Matas

Reaproveitar sem mudar: empresas e RLS, unidades e `unit_access`, sessão por cookie, CSRF, guards que negam por padrão, `ModuleGuard`, `audit_log`, padrão `request_id`, padrão de razão de estoque só de inclusão com saldo protegido, padrão de estorno, `packages/domain/decimal.ts`, validação Zod, tratamento de erros (500 genérico), backup cifrado, testes de isolamento, cabeçalhos de segurança, componentes e tokens de `packages/ui`.

Reaproveitar com ajuste:

- `expenses`: acrescentar status de pagamento e categorias da cafeteria. As categorias atuais já aceitam qualquer código `^[a-z_]{2,40}$`.
- Papéis: o núcleo tem `owner`, `manager`, `operator`, `viewer`. A JDS precisa de caixa, atendente e estoquista (ver seção 7).
- `operating_units.kind`: usar `store` para as duas unidades.

Não usar: tudo de `modules/coffee` (talhões, safras, colheitas, lotes, secagem, beneficiamento, vendas por saca, relatórios de produtividade). Fica intacto no Matas e oculto para a JDS por `tenant_modules`.

## 6. Arquitetura proposta

```
Site público (Next.js, Vercel)          JDS Gestão Comercial (SPA)
  cardápio, carrinho, pedido               painel, pedidos, PDV, estoque...
        |  HTTPS, rotas públicas              |  HTTPS, sessão por cookie
        v                                     v
                 API Matas (NestJS) /v1
                   módulo foodservice (genérico de cafeteria)
                   núcleo: empresas, unidades, usuários, auditoria, despesas
                        |
                 PostgreSQL (RLS por empresa)
```

- **Módulo `foodservice` no Matas:** regras genéricas de cafeteria (catálogo, preço por unidade, pedidos, PDV, caixa, estoque de produtos). Nada com o nome JDS no código do módulo.
- **JDS Gestão Comercial:** a interface do painel com a marca e as cores da JDS. Recomendação: reutilizar `apps/web` do Matas com tema por empresa e módulo `coffee` desligado, em vez de uma segunda SPA. Alternativa: app próprio `apps/jds-gestao` no mesmo monorepo, usando `packages/ui`.
- **Site JDS:** deixa de ler o JSON e passa a ler `GET /v1/public/menu` (no build, com revalidação) e a enviar pedidos para `POST /v1/public/orders`. Enquanto a API não estiver no ar, o site continua como está, com o JSON e a compra demonstrativa.
- **Pedidos demonstrativos:** continuam no navegador. Pedidos reais só existem na API. Para demonstração do painel, usar uma empresa `is_demo` separada (padrão do Matas), nunca misturada com a real.

## 7. Papéis e permissões

Permissões novas (prefixo do módulo): `fs.catalog.write`, `fs.orders.read`, `fs.orders.update`, `fs.orders.cancel`, `fs.pos.sell`, `fs.cash.operate`, `fs.stock.write`, `fs.stock.count`, `finance.read`, `finance.write`, `reports.consolidated`, `members.manage`.

| Papel JDS | Papel no núcleo | Escopo | Permissões principais |
| --- | --- | --- | --- |
| Administrador geral | `owner` | Todas as unidades | Todas |
| Gerente de unidade | `manager` | Unidades em `unit_access` | Catálogo, pedidos, PDV, caixa, estoque, despesas, relatórios da unidade |
| Operador de caixa | novo `cashier` | Unidades em `unit_access` | `fs.pos.sell`, `fs.cash.operate`, `fs.orders.read` |
| Atendente | novo `attendant` | Unidades em `unit_access` | `fs.orders.read`, `fs.orders.update` |
| Estoquista | novo `stockkeeper` | Unidades em `unit_access` | `fs.stock.write`, `fs.stock.count` |

Os três papéis novos são genéricos (servem a qualquer loja), então podem entrar no núcleo sem violar a regra "termos de um setor nunca entram no núcleo". Isso muda `memberships.role` e `ROLE_PERMISSIONS`: decisão do responsável pelo Matas. Toda permissão é checada no servidor; a tela só esconde o que o servidor já nega.

Cargo (texto livre, ex.: "Barista") fica em `memberships.job_title`, separado do papel.

## 8. Estrutura de banco proposta (módulo `foodservice`)

Todas com `tenant_id`, chave `(tenant_id, id)`, FKs compostas, RLS forçado e política por `app_tenant_id()`. Valores em `numeric(20,2)`. Quantidades de estoque em `numeric(20,3)` (unidade de medida do produto).

| Tabela | Campos principais | Regras |
| --- | --- | --- |
| `fs_categories` | nome, ordem, papéis (bebida, doce...) | |
| `fs_products` | `external_ref` (`jds-001`), nome, descrição, categoria, `tracks_stock`, `online_purchasable`, `age_restricted`, status | `external_ref` único por empresa |
| `fs_product_units` | produto, unidade, disponível, ordem | Produto existe por unidade |
| `fs_product_prices` | produto, unidade, preço, `valid_from`, `valid_to` | Preço vigente único por produto e unidade |
| `fs_option_groups`, `fs_options` | grupo (obrigatório, mínimo, máximo), opção, acréscimo | |
| `fs_product_pairings` | produto, produto sugerido, unidade opcional, prioridade, ativo | Recomendações da casa |
| `fs_orders` | `request_id`, unidade, canal (`online`, `pos`), cliente (nome, telefone), entrega (jsonb), subtotal, taxas, total, `status`, `payment_status`, observações | `UNIQUE (tenant_id, request_id)`; total recalculado no servidor |
| `fs_order_items` | pedido, produto, nome e preço congelados, opções escolhidas (jsonb), quantidade, total da linha | Só inclusão |
| `fs_order_events` | pedido, de, para, motivo, usuário, quando | Histórico, só inclusão |
| `fs_payments` | pedido, método, provedor, referência externa, valor, status, `idempotency_key` | Nunca dados de cartão |
| `fs_cash_sessions` | unidade, aberto por, valor inicial, fechado por, valor contado, diferença | Uma sessão aberta por unidade e caixa |
| `fs_stock_movements` | produto, unidade, quantidade (+/-), tipo (`entry`, `exit`, `adjust`, `count`, `sale`, `sale_reversal`), `source_id`, custo unitário opcional | `UNIQUE (tenant_id, source_id, kind)` impede baixa duplicada; saldo negativo recusado em transação com lock |
| `expenses` (núcleo) | + `payment_status` (`paid`, `pending`), `due_on` | Anulação continua auditada |

Status do pedido (preparo): `received`, `preparing`, `ready`, `out_for_delivery` (só entrega), `delivered`, `cancelled`. Transições válidas definidas no domínio e testadas.
Status de pagamento (separado): `pending`, `authorized`, `paid`, `failed`, `refunded`, `partially_refunded`.

Insumos e fichas técnicas ficam para depois, em tabelas próprias (`fs_ingredients`), sem misturar com o estoque de produtos.

## 9. Contratos de API (rascunho)

Valores monetários sempre como texto canônico (`"19.90"`). Toda mutação recebe `requestId` (uuid gerado no cliente).

Públicas (site):

- `GET /v1/public/menu?unit=centro`: categorias, produtos, preços e opções da unidade, só itens publicados.
- `POST /v1/public/orders`: `{ requestId, unit, items: [{ productRef, quantity, options, note }], customer, delivery, packaging, gift }`. O servidor recalcula tudo, recusa item indisponível, de outra unidade ou com restrição, e devolve `{ number, totals, status, paymentStatus }`. Limite de taxa por IP e, depois, desafio contra robôs.
- `GET /v1/public/orders/:number?token=`: acompanhamento com token secreto do pedido, sem login.

Painel (sessão + permissão):

- `GET /v1/fs/orders?unit&status&from&to` (`fs.orders.read`)
- `POST /v1/fs/orders/:id/status` `{ requestId, to, reason }` (`fs.orders.update`; cancelar exige `fs.orders.cancel`)
- `POST /v1/fs/pos/sales` `{ requestId, unit, cashSessionId, items, payments }` (`fs.pos.sell`)
- `POST /v1/fs/cash-sessions` e `POST /v1/fs/cash-sessions/:id/close` (`fs.cash.operate`)
- `GET /v1/fs/stock?unit` e `POST /v1/fs/stock/movements` (`fs.stock.write`)
- `GET/POST /v1/fs/catalog/...` (`fs.catalog.write`)
- `GET /v1/fs/reports/results?unit&from&to` (`finance.read`; todas as unidades exige `reports.consolidated`)
- `GET/POST /v1/expenses` (já existe no núcleo para café; generalizar a rota)

Erros: `400` validação (mensagem por campo), `401` sem sessão, `403` sem permissão ou unidade, `404` não encontrado (inclusive de outra empresa), `409` conflito (`requestId` reaproveitado com outro conteúdo, transição inválida, estoque insuficiente).

## 10. Resultados financeiros

Regras para o domínio (`packages/domain`, com testes):

- Receita bruta = soma dos pedidos e vendas concluídos.
- Cancelamentos e devoluções = estornos do período.
- Receita líquida = bruta menos cancelamentos e devoluções.
- CMV = custo dos produtos vendidos, pelo custo registrado nas entradas de estoque. **Sem custo registrado, o CMV é "indisponível", não zero.**
- Margem bruta = receita líquida menos CMV.
- Despesas operacionais = despesas do período. **Compras de mercadoria para revenda entram no CMV pelo estoque, não como despesa**, para não contar duas vezes.
- Taxas de pagamento, quando registradas, entram como despesa operacional.
- Resultado operacional estimado = margem bruta menos despesas operacionais. Nunca chamado de lucro líquido (faltam tributos, provisões, pró-labore).

## 11. Plano de checkpoints

| # | Entrega | Depende de | Onde |
| --- | --- | --- | --- |
| M0 | Esta auditoria e plano | | Concluído |
| M1 | Empresa JDS, duas unidades `store`, papéis novos, `job_title`, permissões `fs.*`, módulo `foodservice` ativo e `coffee` inativo, testes de isolamento e de papel | P13 do Matas commitado; decisão dos papéis | Matas |
| M2 | Catálogo (`fs_products`, preços por unidade, opções, pares), importação do JSON conferido, `GET /v1/public/menu` | M1 | Matas + site |
| M3 | Pedidos (`fs_orders`, eventos, idempotência), painel de pedidos, `POST /v1/public/orders` atrás de chave de ambiente | M2 | Matas + site |
| M4 | Estoque de produtos por unidade, baixa na venda, contagem, alertas | M2 | Matas |
| M5 | Despesas com status de pagamento | M1 | Matas |
| M6 | Resultados e dashboard | M3, M4, M5 | Matas |
| M7 | Funcionários (convite, papel, unidades, ativar e inativar) | M1 | Matas |
| M8 | PDV e caixa | M3, M4 | Matas |
| M9 | Testes integrados, contrato de pagamento (sem transação real), revisão de segurança | M3 a M8 | Ambos |

## 12. Bloqueadores e decisões do responsável

1. **Trabalho P13 não commitado no Matas.** Precisa ser concluído e commitado antes de qualquer mudança no repositório.
2. **Onde a API roda com pedidos reais.** O site público na Vercel precisa falar com a API por HTTPS. O plano do Matas é piloto no computador do cliente (acesso remoto por Cloudflare Tunnel + domínio, cerca de R$ 40/ano) ou VPS paga. A regra de orçamento zero do Matas proíbe banco gratuito na nuvem com dados reais.
3. **NO-GO para dados reais no Matas**: B1 (ensaio de backup), B2 (HTTPS), B3 (revisão jurídica: LGPD, termos, papel de controlador), B4 (regras do cliente).
4. **Papéis novos no núcleo** (`cashier`, `attendant`, `stockkeeper`) ou permissões configuráveis por papel.
5. **Painel:** reaproveitar `apps/web` com tema JDS (recomendado) ou app próprio.
6. **Regra 4 do CLAUDE.md do site JDS** proíbe painel administrativo; precisa ser atualizada com esta decisão.
7. Estoque: quais produtos controlam estoque (latas, água, long neck) e quais não (preparados na hora).
8. Custo dos produtos para o CMV: sem ele, margem e resultado ficam "indisponíveis".

## 13. Riscos

- Duas frentes mexendo no Matas ao mesmo tempo (P13 e JDS): conflito de migrações. Mitigação: numerar migrações do `foodservice` só depois do commit do P13.
- Expor a API na internet aumenta a superfície de ataque: limite de taxa, desafio contra robôs, rotas públicas mínimas e só leitura, exceto a criação de pedido.
- Pedido online sem pagamento real pode gerar pedidos falsos: até haver pagamento, pedido online precisa de confirmação da unidade antes de ir para o preparo.
- Dados pessoais de clientes (nome, telefone, endereço): guardar só o necessário, prazo de retenção definido na revisão jurídica.
