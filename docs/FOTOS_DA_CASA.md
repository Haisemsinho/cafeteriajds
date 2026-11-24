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

## Autorização

Em 24/11/2026 a JDS autorizou o uso de todas as fotos enviadas, incluindo a funcionária, a pessoa atrás do vidro da fachada e os porta-retratos da estante. Publicação liberada pelo responsável no mesmo dia.

## Observações

- Decoração de Natal em `maquina-espresso.jpg` e `salao-luzes.jpg`: trocar depois de dezembro.
- 1600 px de largura: em telas acima de 1600 px o hero fica levemente ampliado. Fotos em resolução maior resolvem.
