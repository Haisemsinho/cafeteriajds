# Fotos da casa

Fotos reais enviadas em 24/11/2026, substituindo as fotos ilustrativas de ambiente. Fotos de produto continuam ilustrativas (com selo e crédito) até chegarem fotos reais dos itens.

Originais em `src/assets/photos/casa/` (1600 x 738 ou 738 x 1600). O `next/image` gera WebP e AVIF em vários tamanhos; o hero carrega com prioridade, o resto com lazy loading. Entradas com texto alternativo e ponto de foco em `casa`, dentro de `src/content/photos.ts`.

## Onde cada foto aparece

| Arquivo | Chave | Uso |
| --- | --- | --- |
| salao-balcao.jpg | `casa.salaoBalcao` | Hero do início no computador e tablet; Nossa história, fotos da casa |
| balcao-bolo.jpg | `casa.balcaoBolo` | Hero do início no celular; topo da Experiência |
| parede-letreiro.jpg | `casa.paredeLetreiro` | Início, apresentação; topo da Nossa história; Experiência, detalhes |
| salao-luzes.jpg | `casa.salao` | Início, chamada da história; Experiência, detalhes |
| estante-letreiro.jpg | `casa.estante` | Início, chamada da história; Experiência, "O salão" |
| mesas-janela.jpg | `casa.mesas` | Início, convite; topo do Cardápio; Experiência, "As mesas" |
| maquina-espresso.jpg | `casa.maquina` | Início, chamada da história; Nossa história; Experiência, detalhes |
| fachada-toldo.jpg | `casa.fachada` | Experiência, "A fachada"; Nossa história, fotos da casa |

A xícara antiga (`photos.xicara`) continua no cartão do início e na galeria. As fotos antigas de baixa resolução ficam no repositório, sem uso nas telas trocadas.

## Descartadas

Repetições da máquina de espresso, fotos com porta-retratos em destaque, reflexo forte no vidro, fotos tremidas, quase iguais a outra já escolhida, e a fachada vista da rua com clientes pelo vidro.

## Antes de publicar

- Confirmar com a JDS a autorização de uso de todas as fotos.
- Funcionária aparece de lado na borda direita de `salao-luzes.jpg` e `salao-balcao.jpg`. No hero ela fica fora do corte, mas a galeria abre a foto inteira (`salao-luzes`). Precisa de consentimento ou troca.
- Pessoa no fundo, atrás do vidro, em `fachada-toldo.jpg` (pouco visível).
- Porta-retratos com fotos pessoais na estante: `salao-luzes`, `salao-balcao`, `estante-letreiro`, `mesas-janela`, `balcao-bolo`. Aparecem pequenos, mas são fotos de família. Confirmar se podem aparecer.
- Decoração de Natal em `maquina-espresso.jpg` e `salao-luzes.jpg`: a foto fica datada depois de dezembro.
- 1600 px de largura: em telas acima de 1600 px o hero fica levemente ampliado. Fotos em resolução maior resolvem.
