import type { StoryBlock } from "@/types/content";

export const storyIntro = {
  status: "draft" as const,
  paragraphs: [
    "Toda casa tem um começo, e o da JDS ainda vai ganhar suas palavras aqui. Enquanto isso, o espaço já conta bastante coisa sozinho.",
    "A madeira das ripas, o tijolo aparente, as plantas e a luz que atravessa o vidro falam de um lugar pensado para receber.",
  ],
};

export const storyBlocks: StoryBlock[] = [
  {
    id: "origem",
    kind: "origem",
    title: "Como tudo começou",
    body: [],
    hint: "De onde veio a ideia da cafeteria e o que motivou a abertura.",
    status: "pending",
  },
  {
    id: "fundadores",
    kind: "fundadores",
    title: "Quem está por trás da JDS",
    body: [],
    hint: "Nome, foto e algumas linhas sobre quem cuida da casa.",
    status: "pending",
  },
  {
    id: "inauguracao",
    kind: "inauguracao",
    title: "A abertura",
    body: [],
    hint: "Ano de inauguração e o que marcou os primeiros dias.",
    status: "pending",
  },
  {
    id: "valores",
    kind: "valores",
    title: "O que importa pra gente",
    body: [],
    hint: "Três ou quatro valores da marca, nas palavras de quem faz a JDS.",
    status: "pending",
  },
  {
    id: "acervo",
    kind: "acervo",
    title: "Fotos de antes",
    body: [],
    hint: "Fotografias da obra, da inauguração ou dos primeiros clientes.",
    status: "pending",
  },
];

export const philosophy = {
  status: "draft" as const,
  title: "Receber bem é parte do café",
  points: [
    { title: "Sem pressa", text: "Cada xícara servida com o tempo que ela pede." },
    { title: "Perto de quem chega", text: "Atendimento próximo, de quem conhece o cliente pelo nome." },
    { title: "Feito à mão", text: "Detalhes artesanais, do balcão à decoração." },
  ],
};
