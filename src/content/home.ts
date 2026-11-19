import { business } from "./business";

export const home = {
  hero: {
    title: `Bem-vindo à ${business.name}`,
    titleLines: ["Bem-vindo à", business.name],
    subtitle: "Seu lugar para apreciar um bom café e viver bons momentos.",
    primary: { label: "Explorar cardápio", href: "/cardapio" },
    secondary: { label: "Conheça nosso espaço", href: "/experiencia" },
  },
  intro: {
    title: "Um café para tomar com calma",
    paragraphs: [
      `Madeira, tijolo aparente, plantas e muita luz natural. A ${business.shortName} é um lugar para fazer uma pausa no dia, encontrar os amigos ou simplesmente aproveitar um bom café.`,
      "Da fachada de ripas ao balcão, cada canto foi pensado para receber bem quem chega.",
    ],
    link: { label: "Conheça nossa história", href: "/nossa-historia" },
  },
  featured: {
    title: "Nossos destaques",
    subtitle: "Sabores especiais para acompanhar seus melhores momentos.",
    demoNotice: `Produtos, imagens e preços demonstrativos. O cardápio oficial será publicado pela ${business.shortName}.`,
    cta: { label: "Ver todos os produtos", href: "/cardapio" },
  },
  story: {
    title: "Cada lugar tem uma história",
    fallback: `A da ${business.shortName} começa na fachada de ripas e continua em cada mesa. Conheça um pouco mais da casa.`,
    cta: { label: "Conheça nosso espaço", href: "/experiencia" },
  },
  reviews: {
    title: "Boas experiências merecem ser compartilhadas.",
    intro: `Um pouco do carinho de quem já viveu bons momentos na ${business.shortName}.`,
    demoNotice: `Avaliações de exemplo, só para testar o layout. Serão trocadas pelos depoimentos reais enviados pela ${business.shortName}.`,
  },
  visit: {
    title: "Venha nos visitar",
    fallback: `Seu próximo café tem endereço. Acompanhe as novidades da ${business.shortName} enquanto isso.`,
  },
};
