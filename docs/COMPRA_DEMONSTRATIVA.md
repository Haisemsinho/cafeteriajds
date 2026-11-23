# Compra demonstrativa

Protótipo funcional de pedido, aprovado em 18/11/2026 para apresentar à dona da JDS. Nenhum pagamento é feito, nenhum pedido chega à cafeteria e nenhum dado sai do aparelho.

## Quando aparece

Só com `SHOW_DRAFT_CONTENT=true` (versão de apresentação). Em produção, o carrinho some do header e `/carrinho`, `/finalizar` e `/minhas-compras` mostram "Pedidos pelo site ainda não estão disponíveis".

## Fluxo

1. Unidade: seletor Centro | BR 116 no cardápio, no produto, no carrinho e na etapa 1. Fica na URL (`?unidade=centro` ou `?unidade=br116`) e lembrada no aparelho.
2. Produto (`/cardapio/[slug]`): tamanho, temperatura, intensidade, dose, leite, adoçamento (e quanto adoçar), adicionais, observação de até 140 caracteres e quantidade. O preço muda na hora, com o cálculo detalhado.
3. "Adicionar ao carrinho": valida as opções obrigatórias e a unidade, mostra um aviso com "Ver carrinho" e as opções "Ver carrinho" e "Continuar comprando". As escolhas ficam para o próximo item.
4. Carrinho: gaveta lateral no desktop e `/carrinho` no celular. Quantidade, editar (abre o produto com `?editar=`), remover com "Desfazer". Itens com personalizações diferentes ficam separados.
5. `/finalizar?etapa=`: embalagem e presente, endereço e destinatário, revisão com "Editar" em cada bloco, pagamento simulado (Pix ou cartão, sem nenhum campo de cartão). O botão voltar do navegador anda entre as etapas sem perder o que foi digitado.
6. Confirmação em `/finalizar/confirmado?pedido=DEMO-0000`, em verde, deixando claro que a cafeteria não recebeu o pedido.
7. `/minhas-compras`: pedidos da sessão, linha do tempo com 5 estados, "Repetir pedido" e uma área de testes separada para avançar o status.

## Arquivos

| Parte | Arquivo |
| --- | --- |
| Opções de personalização e quais produtos recebem cada uma | `src/content/customization.ts` |
| Unidades, entrega de exemplo e embalagens | `src/content/units.ts` |
| Regras de preço (funções puras) | `src/lib/order/pricing.ts` |
| Validação e máscaras do checkout | `src/lib/order/checkout.ts` |
| Catálogo para o cliente (servidor) | `src/lib/order/catalog.ts` |
| Carrinho, rascunho do checkout e pedidos | `src/lib/order/store.ts` |
| Estados do pedido | `src/lib/order/status.ts` |
| Componentes | `src/components/order/` |
| Testes das regras | `tests/pricing.test.ts` (`npm run test:unit`) |

## Onde os dados ficam

- Carrinho e unidade: `localStorage` do aparelho.
- Rascunho do checkout (endereço, telefone): `sessionStorage`, apagado ao simular o pagamento.
- Pedidos: `sessionStorage`, só com o primeiro nome de quem recebe e bairro/cidade. Somem ao fechar a aba.

## Tudo que é exemplo

Preços, adicionais, embalagens, taxas de entrega (R$ 5,00 Centro, R$ 8,00 BR 116), área atendida (só São João do Manhuaçu), tempos e estados do pedido. Nenhum foi confirmado pela JDS.

## Para virar produção

- Cardápio real por unidade, com preços e quais personalizações cada bebida aceita (`units` e `customizationProfiles`).
- Backend de pedidos: trocar `saveOrder`, `advanceOrder` e `useOrders` por chamadas a uma API, com status vindo da operação.
- Gateway de pagamento (Pix e cartão em página segura do provedor, nunca campos de cartão no site), conciliação e estorno.
- Área de entrega real (por bairro ou CEP), taxas e horários por unidade, e se haverá retirada no balcão.
- Consulta de CEP, conta do cliente (opcional), LGPD (política de privacidade, consentimento, retenção), emissão fiscal e painel para a equipe receber os pedidos.

## Regressão: duas falhas conhecidas (investigadas em 23/11/2026)

A suíte extra de regressão tinha duas falhas desde a entrada da compra demonstrativa (commit `a56c356`):

1. **"Primeiro card mais alto que antes"** (841px contra o limite de 806px): causa real. O seletor de unidade entrou entre o topo do cardápio e a busca e empurrou os produtos para baixo, desfazendo parte de uma correção da crítica de design. Corrigido: o seletor do cardápio ficou compacto (sem a linha de endereço), com menos espaço acima.
2. **"Produto sem WhatsApp mostra Como visitar"**: teste desatualizado. Na versão de apresentação, o configurador de compra substitui os botões "Como visitar" e "Ver outros produtos" de propósito. Fora da versão de apresentação, o produto continua com "Como visitar". O teste passou a verificar "Adicionar ao carrinho" na apresentação.
