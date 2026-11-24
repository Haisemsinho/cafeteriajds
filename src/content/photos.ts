import type { Photo } from "@/types/content";
import fachada from "@/assets/photos/fachada.jpg";
import fachadaLetreiro from "@/assets/photos/fachada-letreiro.jpg";
import fachadaVaranda from "@/assets/photos/fachada-varanda.jpg";
import interior from "@/assets/photos/interior.jpg";
import prateleiras from "@/assets/photos/prateleiras.jpg";
import balcao from "@/assets/photos/balcao.jpg";
import diaDoCafe from "@/assets/photos/dia-do-cafe.jpg";
import xicara from "@/assets/photos/xicara.jpg";
import salaoLuzes from "@/assets/photos/casa/salao-luzes.jpg";
import salaoBalcao from "@/assets/photos/casa/salao-balcao.jpg";
import paredeLetreiro from "@/assets/photos/casa/parede-letreiro.jpg";
import balcaoBolo from "@/assets/photos/casa/balcao-bolo.jpg";
import fachadaToldo from "@/assets/photos/casa/fachada-toldo.jpg";
import estanteLetreiro from "@/assets/photos/casa/estante-letreiro.jpg";
import mesasJanela from "@/assets/photos/casa/mesas-janela.jpg";
import maquinaEspresso from "@/assets/photos/casa/maquina-espresso.jpg";

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

export const casa = {
  salao: {
    src: salaoLuzes,
    alt: "Salão da Cafeteria JDS com estante de madeira, quadro, parede de tijolo e luminárias acesas sobre o balcão",
    caption: "O salão",
    position: "22% 55%",
    positionMobile: "30% 50%",
  },
  salaoBalcao: {
    src: salaoBalcao,
    alt: "Estante de madeira com cafés da casa, quadro e luminárias pendentes junto à parede de tijolo",
    caption: "Estante e balcão",
    position: "30% 50%",
  },
  paredeLetreiro: {
    src: paredeLetreiro,
    alt: "Letreiro JDS Cafeteria em letras escuras sobre painel de madeira, com hera no alto",
    caption: "O letreiro do salão",
    position: "50% 46%",
    positionMobile: "50% 40%",
  },
  balcaoBolo: {
    src: balcaoBolo,
    alt: "Bolo sob cúpula no balcão de granito, com a estante JDS e o quadro ao fundo",
    caption: "O balcão",
    position: "45% 30%",
    positionMobile: "50% 45%",
  },
  fachada: {
    src: fachadaToldo,
    alt: "Fachada da Cafeteria JDS com ripas de madeira, letreiro branco e toldo preto",
    caption: "A fachada",
    position: "50% 42%",
    positionMobile: "50% 40%",
  },
  estante: {
    src: estanteLetreiro,
    alt: "Estante de madeira com o monograma JDS, prensa francesa e cafés da casa, ao lado do quadro e da hera",
    caption: "A estante da casa",
    position: "24% 50%",
  },
  mesas: {
    src: mesasJanela,
    alt: "Mesas de madeira junto à vitrine, com vista para a rua e a estante de cafés ao lado",
    caption: "Mesas junto à vitrine",
    position: "35% 55%",
    positionMobile: "40% 55%",
  },
  maquina: {
    src: maquinaEspresso,
    alt: "Máquina de espresso no balcão de granito, ao lado de doces embalados",
    caption: "A máquina de espresso",
    position: "50% 45%",
  },
} satisfies Record<string, Photo>;
