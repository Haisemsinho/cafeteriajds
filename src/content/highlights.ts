import type { Highlight } from "@/types/content";
import { photos } from "./photos";

export const highlights: Highlight[] = [
  {
    id: "h-cappuccino",
    kind: "destaque",
    title: "Cappuccino da casa",
    description: "Exemplo de destaque ligado a um item do cardápio. O botão leva direto para o detalhe dele.",
    productSlug: "cappuccino",
    order: 1,
    status: "draft",
  },
  {
    id: "h-gelado",
    kind: "novidade",
    title: "Café gelado",
    description: "Exemplo de novidade. Quando entrar algo novo no cardápio, é só cadastrar aqui.",
    productSlug: "cafe-gelado",
    order: 2,
    status: "draft",
  },
  {
    id: "h-biscoitos",
    kind: "embalado",
    title: "Biscoitos para levar",
    description: "Exemplo de produto embalado, para quando a casa confirmar o que vende nas prateleiras.",
    image: photos.balcao,
    order: 3,
    status: "draft",
  },
  {
    id: "h-presente",
    kind: "presente",
    title: "Presentes e encomendas",
    description: "Exemplo de bloco para kits e presentes. Os detalhes de como encomendar entram aqui depois de confirmados.",
    image: photos.prateleiras,
    order: 4,
    status: "draft",
  },
];
