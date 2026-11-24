import type { Photo } from "@/types/content";
import fachada from "@/assets/photos/fachada.jpg";
import fachadaLetreiro from "@/assets/photos/fachada-letreiro.jpg";
import fachadaVaranda from "@/assets/photos/fachada-varanda.jpg";
import interior from "@/assets/photos/interior.jpg";
import prateleiras from "@/assets/photos/prateleiras.jpg";
import balcao from "@/assets/photos/balcao.jpg";
import diaDoCafe from "@/assets/photos/dia-do-cafe.jpg";
import xicara from "@/assets/photos/xicara.jpg";

export const photos = {
  fachada: {
    src: fachada,
    alt: "Fachada da Cafeteria JDS com ripas de madeira, letreiro e portas de vidro",
    caption: "A fachada de ripas",
    position: "50% 18%",
  },
  letreiro: {
    src: fachadaLetreiro,
    alt: "Letreiro da Cafeteria JDS sobre as ripas verticais de madeira da fachada",
    caption: "Letreiro e ripas",
  },
  varanda: {
    src: fachadaVaranda,
    alt: "Mesa alta e banquetas de madeira na varanda de entrada, com o Instagram da casa no vidro",
    caption: "A varanda de entrada",
  },
  interior: {
    src: interior,
    alt: "Interior com prateleiras de madeira, parede de tijolo aparente, plantas e cesta de biscoitos no balcão",
    caption: "Salão e prateleiras",
  },
  prateleiras: {
    src: prateleiras,
    alt: "Prateleiras de madeira clara com objetos e produtos, ao lado da parede de tijolo",
    caption: "Madeira e tijolo",
    position: "50% 30%",
  },
  balcao: {
    src: balcao,
    alt: "Cesta artesanal com biscoitos sobre o balcão de granito, com uma pequena árvore decorada ao fundo",
    caption: "Detalhes do balcão",
  },
  diaDoCafe: {
    src: diaDoCafe,
    alt: "Peça de comunicação da JDS para o Dia Internacional do Café, com xícara personalizada e grãos sobre a mesa",
    caption: "Dia Internacional do Café",
  },
  xicara: {
    src: xicara,
    alt: "Xícara branca com o logo da JDS sobre o pires, cercada de grãos de café",
    caption: "A xícara da casa",
    position: "60% 40%",
  },
} satisfies Record<string, Photo>;
