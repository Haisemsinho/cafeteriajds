import type { Photo } from "@/types/content";
import janela from "@/assets/photos/ilustrativas/ambiente-janela.jpg";
import lattes from "@/assets/photos/ilustrativas/ambiente-lattes.jpg";
import brinde from "@/assets/photos/ilustrativas/ambiente-brinde.jpg";
import espresso from "@/assets/photos/ilustrativas/espresso.jpg";
import espressoDuplo from "@/assets/photos/ilustrativas/espresso-duplo.jpg";
import cafeCoado from "@/assets/photos/ilustrativas/cafe-coado.jpg";
import cappuccino from "@/assets/photos/ilustrativas/cappuccino.jpg";
import latte from "@/assets/photos/ilustrativas/latte.jpg";
import mocha from "@/assets/photos/ilustrativas/mocha.jpg";
import cafeGelado from "@/assets/photos/ilustrativas/cafe-gelado.jpg";
import latteGelado from "@/assets/photos/ilustrativas/latte-gelado.jpg";
import chocolateQuente from "@/assets/photos/ilustrativas/chocolate-quente.jpg";
import paoDeQueijo from "@/assets/photos/ilustrativas/pao-de-queijo.jpg";
import croissant from "@/assets/photos/ilustrativas/croissant.jpg";
import bolo from "@/assets/photos/ilustrativas/bolo-do-dia.jpg";
import brownie from "@/assets/photos/ilustrativas/brownie.jpg";
import biscoitos from "@/assets/photos/ilustrativas/biscoitos-da-cesta.jpg";

const unsplash = (id: string, author?: string) => ({
  author,
  license: "Licença Unsplash",
  url: id.startsWith("photo-") ? `https://images.unsplash.com/${id}` : `https://unsplash.com/photos/${id}`,
});

const demo = (
  src: Photo["src"],
  alt: string,
  credit: Photo["credit"],
  position?: string,
  positionMobile?: string,
): Photo => ({
  src,
  alt,
  credit,
  position,
  positionMobile,
  illustrative: true,
});

export const ambience = {
  janela: demo(
    janela,
    "Mesa redonda de madeira junto a uma janela ampla, com prensa francesa, xícaras e plantas",
    unsplash("photo-1445116572660-236099ec97a0"),
    "50% 62%",
    "38% 60%",
  ),
  lattes: demo(
    lattes,
    "Três xícaras de cappuccino com desenho no leite sobre mesa de madeira, entre plantas",
    unsplash("photo-1509042239860-f550ce710b93"),
    "50% 55%",
  ),
  brinde: demo(
    brinde,
    "Mãos brindando com xícaras de café com leite sobre uma mesa de madeira",
    unsplash("6VhPY27jdps", "Nathan Dumlao"),
    "50% 45%",
    "62% 50%",
  ),
};

export const productPhotos: Record<string, Photo> = {
  espresso: demo(
    espresso,
    "Espresso em xícara de vidro sobre mesa de madeira",
    unsplash("69YqZOU6-Jo", "Binit Sharma"),
    "50% 45%",
  ),
  "espresso-duplo": demo(
    espressoDuplo,
    "Máquina de espresso extraindo café em xícara branca",
    unsplash("A_90G6Ta56A", "Jakub Żerdzicki"),
    "70% 55%",
  ),
  "cafe-coado": demo(
    cafeCoado,
    "Água quente sendo despejada sobre o filtro de papel com café moído",
    unsplash("YWHK_pePhVw", "Patrick Fore"),
    "45% 55%",
  ),
  cappuccino: demo(
    cappuccino,
    "Cappuccino visto de cima sobre tábua redonda de madeira",
    unsplash("tA90pRfL2gM", "Nathan Dumlao"),
    "50% 50%",
  ),
  latte: demo(
    latte,
    "Xícara branca de café com leite com desenho de folha",
    unsplash("tZKwLRO904E", "Drew Coffman"),
    "45% 50%",
  ),
  mocha: demo(
    mocha,
    "Xícara de mocha com chocolate escorrendo pela borda, sobre mesa de madeira",
    unsplash("RtHw0PWCLhw", "Giancarlo Duarte"),
    "50% 45%",
  ),
  "cafe-gelado": demo(
    cafeGelado,
    "Café gelado com gelo em copo de vidro sobre porta-copos de madeira",
    unsplash("3cOehyE_WyY", "Esra Afşar"),
    "50% 50%",
  ),
  "latte-gelado": demo(
    latteGelado,
    "Latte gelado em copo alto de vidro sobre o balcão",
    unsplash("y2Dfk2Kt89o", "pariwat pannium"),
    "50% 72%",
  ),
  "chocolate-quente": demo(
    chocolateQuente,
    "Caneca de chocolate quente vista de perto, com canela ao fundo",
    unsplash("zKjidZxijiM", "Rachael Gorjestani"),
    "45% 50%",
  ),
  "pao-de-queijo": demo(
    paoDeQueijo,
    "Pães de queijo em tigela de barro, com queijo e uma xícara de café com leite",
    {
      author: "Jonathan Wilkins",
      license: "CC BY-SA 3.0",
      url: "https://commons.wikimedia.org/wiki/File:P%C3%A3o_de_Queijo_-_cheese_bread.jpg",
    },
    "30% 65%",
  ),
  croissant: demo(
    croissant,
    "Croissants dourados com açúcar de confeiteiro lado a lado",
    unsplash("5msGxboneMA", "Sergio Arze"),
    "45% 55%",
  ),
  "bolo-do-dia": demo(
    bolo,
    "Fatia de torta com morango no prato, com xícara de café ao fundo",
    unsplash("67mrKcuR4v8", "Kouji Tsuru"),
    "50% 68%",
  ),
  brownie: demo(brownie, "Pedaço de brownie sobre pano escuro", unsplash("WPRuXYLNY68", "Toa Heftiba"), "50% 60%"),
  "biscoitos-da-cesta": demo(
    biscoitos,
    "Cookies com gotas de chocolate em pratos brancos",
    unsplash("wNjgWrEXAL0", "Julissa Capdevilla"),
    "50% 40%",
  ),
};
