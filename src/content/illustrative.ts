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
import prensaFrancesa from "@/assets/photos/ilustrativas/prensa-francesa.jpg";
import suco from "@/assets/photos/ilustrativas/suco.jpg";
import aguaMineral from "@/assets/photos/ilustrativas/agua-mineral.jpg";
import aguaComGas from "@/assets/photos/ilustrativas/agua-com-gas.jpg";
import refrigeranteLimao from "@/assets/photos/ilustrativas/refrigerante-limao.jpg";
import refrigerante from "@/assets/photos/ilustrativas/refrigerante.jpg";
import longNeck from "@/assets/photos/ilustrativas/long-neck.jpg";
import sodaItaliana from "@/assets/photos/ilustrativas/soda-italiana.jpg";
import petitGateau from "@/assets/photos/ilustrativas/petit-gateau.jpg";
import tacaSensacao from "@/assets/photos/ilustrativas/taca-sensacao.jpg";
import deliciaBiscoff from "@/assets/photos/ilustrativas/delicia-biscoff.jpg";
import acai from "@/assets/photos/ilustrativas/acai.jpg";
import affogato from "@/assets/photos/ilustrativas/affogato.jpg";
import coffeeOreo from "@/assets/photos/ilustrativas/coffee-oreo.jpg";
import iceJds from "@/assets/photos/ilustrativas/ice-jds.jpg";
import milkShake from "@/assets/photos/ilustrativas/milk-shake.jpg";
import vitamina from "@/assets/photos/ilustrativas/vitamina.jpg";
import broa from "@/assets/photos/ilustrativas/broa.jpg";
import cativantt from "@/assets/photos/ilustrativas/cativantt.jpg";
import mistoQuente from "@/assets/photos/ilustrativas/misto-quente.jpg";
import empada from "@/assets/photos/ilustrativas/empada.jpg";
import tortinhaDeFrango from "@/assets/photos/ilustrativas/tortinha-de-frango.jpg";
import salgadoAssado from "@/assets/photos/ilustrativas/salgado-assado.jpg";
import quiche from "@/assets/photos/ilustrativas/quiche.jpg";
import paoComOvo from "@/assets/photos/ilustrativas/pao-com-ovo.jpg";
import queijoMinas from "@/assets/photos/ilustrativas/queijo-minas.jpg";
import cuscuz from "@/assets/photos/ilustrativas/cuscuz.jpg";
import mineirinhoGourmet from "@/assets/photos/ilustrativas/mineirinho-gourmet.jpg";

const unsplash = (id: string, author?: string) => ({
  author,
  license: "Licença Unsplash",
  url: id.startsWith("photo-") ? `https://images.unsplash.com/${id}` : `https://unsplash.com/photos/${id}`,
});

const commons = (url: string, author: string, license: string) => ({ author, license, url });

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
  "prensa-francesa": demo(
    prensaFrancesa,
    "Prensa francesa de vidro com café, sobre bancada de granito",
    commons(
      "https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_05.jpg",
      "Infrogmation",
      "CC BY-SA 2.0",
    ),
  ),
  suco: demo(
    suco,
    "Copo alto de suco de maracujá com melancia sobre a mesa",
    commons(
      "https://commons.wikimedia.org/wiki/File:Cocktail_of_passion_fruit_juice_and_watermelon_juice_in_a_glass.jpg",
      "B722N",
      "CC BY-SA 4.0",
    ),
  ),
  "agua-mineral": demo(
    aguaMineral,
    "Água mineral sendo servida da garrafa no copo",
    commons(
      "https://commons.wikimedia.org/wiki/File:Person_pours_water_from_a_bottle_into_a_glass_in_a_kitchen.jpg",
      "Shixart1985",
      "CC BY 2.0",
    ),
  ),
  "agua-com-gas": demo(
    aguaComGas,
    "Copo de água com gás e gelo, com folhas de hortelã",
    commons(
      "https://commons.wikimedia.org/wiki/File:Sparkling_Water_with_Mint_in_Glass_Cup.jpg",
      "Tony Webster",
      "CC BY 2.0",
    ),
  ),
  "refrigerante-limao": demo(
    refrigeranteLimao,
    "Copo de bebida gaseificada de limão com gelo e hortelã",
    commons("https://commons.wikimedia.org/wiki/File:Basil_lemonade_(3609257528).jpg", "dana robinson", "CC BY-SA 2.0"),
  ),
  refrigerante: demo(
    refrigerante,
    "Copo de refrigerante de cola com gelo e rodelas de limão",
    commons("https://commons.wikimedia.org/wiki/File:Glass_cola.jpg", "pic_p_ter", "Public domain"),
  ),
  "long-neck": demo(
    longNeck,
    "Garrafa long neck de cerveja sobre mesa de madeira",
    commons(
      "https://commons.wikimedia.org/wiki/File:Beer_bottle_on_a_picnic_table_at_the_beach.jpg",
      "Donald Riesbeck Jr",
      "Public domain",
    ),
  ),
  "soda-italiana": demo(
    sodaItaliana,
    "Copo de soda italiana vermelha com gelo",
    commons("https://commons.wikimedia.org/wiki/File:Strawberry_Italian_soda.jpg", "Jeff Nelson", "CC BY-SA 2.0"),
  ),
  "petit-gateau": demo(
    petitGateau,
    "Petit gâteau com bolas de sorvete e calda de chocolate",
    commons("https://commons.wikimedia.org/wiki/File:Petit_g%C3%A2teau.jpg", "Juliana Annunciato", "CC0"),
  ),
  "taca-sensacao": demo(
    tacaSensacao,
    "Taça de sorvete com morangos, chantilly e biscoito wafer",
    commons("https://commons.wikimedia.org/wiki/File:Strawberry_Sundae_02.jpg", "Kritzolina", "CC BY-SA 4.0"),
  ),
  "delicia-biscoff": demo(
    deliciaBiscoff,
    "Sobremesa de caramelo com bola de sorvete de baunilha",
    commons(
      "https://commons.wikimedia.org/wiki/File:Dessert_-_Hell%27s_Kitchen,_Las_Vegas.jpg",
      "Prayitno",
      "CC BY 2.0",
    ),
  ),
  acai: demo(
    acai,
    "Copo de açaí com rodelas de banana por cima",
    commons(
      "https://commons.wikimedia.org/wiki/File:Acai_bowl_-_A%C3%A7a%C3%AD_na_tigela.jpg",
      "chahayes",
      "CC BY 2.0",
    ),
  ),
  affogato: demo(
    affogato,
    "Affogato: bola de sorvete em xícara com café expresso",
    commons(
      "https://commons.wikimedia.org/wiki/File:Vinoteca,_Smithfield,_London_(4485849609).jpg",
      "Ewan Munro",
      "CC BY-SA 2.0",
    ),
  ),
  "coffee-oreo": demo(
    coffeeOreo,
    "Bebida gelada cremosa com biscoito de chocolate triturado e chantilly",
    commons(
      "https://commons.wikimedia.org/wiki/File:Oreo_milkshake_-_Creperie_Doux_Sourire_2025-05-03.jpg",
      "Andy Li",
      "CC0",
    ),
  ),
  "ice-jds": demo(
    iceJds,
    "Bebida gelada de café coberta com chantilly e raspas de chocolate",
    commons(
      "https://commons.wikimedia.org/wiki/File:Dessert_with_whip_cream_and_chocolate.jpg",
      "Aerous",
      "CC BY-SA 4.0",
    ),
  ),
  "milk-shake": demo(
    milkShake,
    "Milk-shake de morango com chantilly em taça de vidro",
    commons("https://commons.wikimedia.org/wiki/File:Strawberry_milk_shake_in_cola_glass.jpg", "Punker1999", "CC0"),
  ),
  vitamina: demo(
    vitamina,
    "Copo de vitamina de morango com um morango na borda",
    commons(
      "https://commons.wikimedia.org/wiki/File:Cookies_and_a_strawberry_smoothie_(7342791200).jpg",
      "Sonia Belviso",
      "CC BY 2.0",
    ),
  ),
  broa: demo(
    broa,
    "Broa de milho redonda com a casca rachada",
    commons(
      "https://commons.wikimedia.org/wiki/File:Broa_de_milho_(Portugal),_Brona_de_millo_(Galicia).jpg",
      "María Alabau",
      "CC BY-SA 4.0",
    ),
  ),
  cativantt: demo(
    cativantt,
    "Fatia de bolo de chocolate com sorvete de creme e calda de chocolate",
    commons(
      "https://commons.wikimedia.org/wiki/File:Flourless_Chocolate_Cake_with_Bourbon_Vanilla_Ice_Cream.jpg",
      "Tammy Green",
      "CC BY-SA 2.0",
    ),
  ),
  "misto-quente": demo(
    mistoQuente,
    "Sanduíche quente de pão de forma tostado, cortado ao meio",
    commons(
      "https://commons.wikimedia.org/wiki/File:Australia_Dairy_Company_-_Ham_and_Egg_Sandwich.jpg",
      "City Foodsters",
      "CC BY 2.0",
    ),
  ),
  empada: demo(
    empada,
    "Empadas douradas em forminhas de papel",
    commons("https://commons.wikimedia.org/wiki/File:Empada_de_camar%C3%A3o.jpg", "ComidasDoBrasil", "CC BY-SA 4.0"),
  ),
  "tortinha-de-frango": demo(
    tortinhaDeFrango,
    "Tortinhas de massa folhada com recheio de frango, uma delas cortada",
    commons(
      "https://commons.wikimedia.org/wiki/File:2017-10-20_Empadas_de_Frango_(Chicken_Pie),_Albufeira.JPG",
      "Kolforn",
      "CC BY-SA 4.0",
    ),
  ),
  "salgado-assado": demo(
    salgadoAssado,
    "Salgado assado de massa dourada, fechado em triângulo",
    commons("https://commons.wikimedia.org/wiki/File:Sfiha.jpg", "Carioca", "CC BY-SA 3.0"),
  ),
  quiche: demo(
    quiche,
    "Fatias de quiche gratinada em prato amarelo",
    commons(
      "https://commons.wikimedia.org/wiki/File:Quiche_with_Potatoes,_Leek,_Bacon_%26_Wine_(4876357842).jpg",
      "Katrin Gilger",
      "CC BY-SA 2.0",
    ),
  ),
  "pao-com-ovo": demo(
    paoComOvo,
    "Pão francês com ovo mexido, ao lado de uma xícara de café",
    commons(
      "https://commons.wikimedia.org/wiki/File:P%C3%A3o_com_ovo_e_caf%C3%A9.jpg",
      "Projeto Transite",
      "CC BY-SA 2.0",
    ),
  ),
  "queijo-minas": demo(
    queijoMinas,
    "Queijo minas frescal inteiro sobre prato de vidro",
    commons("https://commons.wikimedia.org/wiki/File:Queijo_Minas_Frescal.JPG", "Hellkt", "Public domain"),
  ),
  cuscuz: demo(
    cuscuz,
    "Cuscuz de milho recém tirado da cuscuzeira",
    commons("https://commons.wikimedia.org/wiki/File:Cuscuz_nordestino.jpg", "André Koehne", "CC BY-SA 4.0"),
  ),
  "mineirinho-gourmet": demo(
    mineirinhoGourmet,
    "Pão de queijo grande com manteiga ao lado",
    commons("https://commons.wikimedia.org/wiki/File:P%C3%A3o_de_queijo_2.jpg", "Melsj", "CC BY-SA 4.0"),
  ),
};
