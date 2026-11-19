# Avaliações de clientes

A seção "Boas experiências merecem ser compartilhadas" da home lê `src/content/reviews.ts`. Não há painel: quem atualiza é o desenvolvedor, e o site muda no próximo deploy. Visitantes não escrevem nem alteram avaliações.

## Campos

| Campo | Uso |
| --- | --- |
| `id` | Único. |
| `customerName` | Como o cliente autorizou aparecer (ex.: "Mariana S."). |
| `customerPhoto` | Opcional. Só com `authorized: true`, senão o build falha. Sem foto, aparecem as iniciais. |
| `reviewText` | Texto original, de 10 a 1200 caracteres. No cartão pode ser cortado; "Ler avaliação completa" mostra tudo. |
| `rating` | Opcional, inteiro de 1 a 5. Só se a pessoa deu a nota. |
| `source` | Opcional: `{ label: "Google", url: "https://..." }`. Só se for verificável. |
| `isFeatured` | O cartão grande do centro. Se nenhum estiver marcado, vale o primeiro da ordem. |
| `isPublished` | `false` esconde do site sem apagar. |
| `displayOrder` | Ordem de exibição. |
| `createdAt`, `updatedAt` | `AAAA-MM-DD`. |
| `status` | `verified` para avaliação real. `draft` é exemplo e só aparece na versão de apresentação, com selo. |

A home mostra no máximo 6 avaliações publicadas: o destaque e as 5 seguintes da ordem. Em produção, sem nenhuma avaliação `verified` publicada, a seção não aparece.

## Pré-visualização

Rode `npm run dev` (mostra também os exemplos) ou `SHOW_DRAFT_CONTENT=true npm run build && npm run start`.

## Fotos

Coloque a foto em `src/assets/photos/clientes/`, importe no `reviews.ts` e use `customerPhoto: { src: foto, alt: "Foto de Mariana", authorized: true }`. Use só com autorização por escrito do cliente.

## Para virar painel

`selectHomeReviews` em `src/lib/reviews.ts` é a única regra de seleção. Um painel futuro só precisa entregar a mesma lista (de uma API ou banco) no lugar do arquivo.
