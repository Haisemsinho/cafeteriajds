import { business } from "./business";

export const home = {
  hero: {
    eyebrow: business.tagline,
    title: `Bem-vindo à ${business.name}`,
    titleLines: ["Bem-vindo à", business.name],
    subtitle: "Seu lugar para apreciar um bom café e viver bons momentos.",
    scrollHint: "Role para descobrir",
    primary: { label: "Explorar cardápio", href: "/cardapio" },
    secondary: { label: "Conheça nosso espaço", href: "/experiencia" },
  },
  intro: {
    eyebrow: `Sobre a ${business.shortName}`,
    title: "Um café para tomar com calma",
    paragraphs: [
      `Madeira, tijolo aparente, plantas e muita luz natural. A ${business.shortName} é um lugar para fazer uma pausa no dia, encontrar os amigos ou simplesmente aproveitar um bom café.`,
      "Da fachada de ripas ao balcão, cada canto foi pensado para receber bem quem chega.",
    ],
    link: { label: "Conheça nossa história", href: "/nossa-historia" },
  },
  featured: {
    eyebrow: "Do nosso cardápio",
    title: "Nossos Destaques",
    subtitle: "Sabores especiais para acompanhar seus melhores momentos.",
    demoNotice: `Produtos, imagens e preços demonstrativos. O cardápio oficial será publicado pela ${business.shortName}.`,
    cta: { label: "Ver todos os produtos", href: "/cardapio" },
  },
  story: {
    eyebrow: "Nossa história",
    title: "Cada lugar tem uma história",
    fallback: `A da ${business.shortName} começa na fachada de ripas e continua em cada mesa. Conheça um pouco mais da casa.`,
    cta: { label: "Conhecer a cafeteria", href: "/experiencia" },
  },
  gallery: {
    eyebrow: "Galeria",
    title: `Por dentro da ${business.shortName}`,
    intro: "Um pouco da casa. Toque em uma foto para ampliar.",
  },
  visit: {
    eyebrow: "Sua próxima pausa",
    title: "Venha nos visitar",
    fallback: `Seu próximo café tem endereço. Acompanhe as novidades da ${business.shortName} enquanto isso.`,
  },
};
