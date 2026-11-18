# Briefing aprovado: cardápio por unidade

Aprovado em 18/11/2026. Ainda não implementado.

## Público e objetivo

Cliente que chega pelo Instagram ou pelo Google, sem unidade definida, quase sempre no celular. Precisa ver o que pode pedir na unidade aonde vai, com o horário e o contato dela, e saber como chegar ou chamar. Ninguém pode ver item, preço ou horário de uma unidade achando que é da outra.

## Unidades (endereços confirmados pelo responsável do projeto)

- Centro: Avenida Jacob Dornelas Neto, São João do Manhuaçu, MG. Número ainda não informado.
- BR 116: Rodovia Santos Dumont, BR 116 (Rio-Bahia), Córrego Caratinga, área rural, São João do Manhuaçu, MG, CEP 36918-000.
- Cada unidade tem horário e WhatsApp ou telefone próprios, ainda não informados.

## Estrutura

- Seletor "Centro | BR 116" no topo do cardápio, acima da busca, com endereço curto e o selo aberto ou fechado quando o horário for verificado.
- Sem unidade escolhida, o cardápio aparece completo. Itens exclusivos levam etiqueta discreta ("só no Centro"). Se os preços diferirem, o card mostra "a partir de" e pede a escolha da unidade.
- Unidade na URL (`?unidade=centro` ou `?unidade=br116`), para links próprios no Instagram, e lembrada no aparelho.
- Busca, categorias, filtros e "Voltar ao cardápio" respeitam a unidade.
- Página do produto mostra a unidade. Item que não existe nela: "Disponível só na unidade X", com botão para trocar. WhatsApp usa o número da unidade.
- Contato e home: duas fichas de unidade com endereço, horário, WhatsApp ou telefone e "Como chegar".

## Dados

- `business.ts`: lista de unidades com id, nome, endereço, horário, contato e status de verificação.
- Produto: lista opcional de unidades em que existe, e preço e disponibilidade opcionais por unidade. Sem a informação, vale para as duas.

## Estados

Sem unidade escolhida, unidade escolhida, item exclusivo da outra, busca vazia nesta unidade com resultados na outra ("Nada no Centro, 2 itens na BR 116"), horário não confirmado (sem selo), unidade sem WhatsApp (só "Como chegar").

## Fora do escopo

Geolocalização ou "unidade mais próxima", páginas separadas por unidade, mudança no visual aprovado. Na demonstração todos os itens valem para as duas unidades: não inventar divisão.

## Em aberto

Nomes oficiais das unidades, número na Av. Jacob Dornelas Neto, horários e contatos de cada uma, se os preços mudam entre unidades.
