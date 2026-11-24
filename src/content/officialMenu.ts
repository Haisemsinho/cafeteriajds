import { importTranscript } from "@/lib/menuImport";
import { productPhotos } from "./illustrative";
import transcript from "./import/cardapio-centro-conferido-2026-11-23.json";

export const officialMenuSource = {
  file: "src/content/import/cardapio-centro-conferido-2026-11-23.json",
  date: transcript.sourceDate,
  branch: transcript.branch,
};

const imported = importTranscript(transcript, {
  cafes: ["bebida", "cafe"],
  "drinks-quentes": ["bebida", "bebida-quente"],
  bebidas: ["bebida"],
  sobremesas: ["sobremesa", "doce"],
  "bebidas-geladas": ["bebida", "bebida-gelada"],
  bolos: ["bolo", "doce"],
  salgados: ["salgado"],
});

const photoBySlug: Record<string, string> = {
  "cafe-expresso": "espresso",
  "hario-v60-300ml": "cafe-coado",
  "hario-v60-500ml": "cafe-coado",
  "prensa-francesa-300ml": "prensa-francesa",
  "prensa-francesa-500ml": "prensa-francesa",
  "expresso-com-borda": "espresso-duplo",
  "cappuccino-tradicional": "cappuccino",
  "cappuccino-cremoso": "latte",
  "mocha-pacoca": "mocha",
  "mocha-tradicional": "mocha",
  "chocolate-quente": "chocolate-quente",
  "coffee-nutella": "mocha",
  suco: "suco",
  "agua-mineral": "agua-mineral",
  "agua-com-gas": "agua-com-gas",
  h2o: "refrigerante-limao",
  "refrigerante-lata": "refrigerante",
  "long-neck": "long-neck",
  "soda-italiana": "soda-italiana",
  "petit-gateau": "petit-gateau",
  "petit-gateau-na-taca": "petit-gateau",
  brownie: "brownie",
  "taca-sensacao": "taca-sensacao",
  "delicia-biscoff": "delicia-biscoff",
  "acai-jds": "acai",
  affogato: "affogato",
  "coffee-neve": "latte-gelado",
  "coffee-oreo": "coffee-oreo",
  "ice-jds": "ice-jds",
  "milk-shake": "milk-shake",
  vitamina: "vitamina",
  "bolo-fatia": "bolo-do-dia",
  broa: "broa",
  cativantt: "cativantt",
  "misto-quente": "misto-quente",
  "empada-coquetel": "empada",
  "tortinha-de-frango-com-catupiry": "tortinha-de-frango",
  "salgado-assado-presunto-e-mussarela": "salgado-assado",
  croissant: "croissant",
  "pao-de-queijo-coquetel-com-5-und": "pao-de-queijo",
  "quiche-de-alho-poro": "quiche",
  "pao-com-ovo-tradicional": "pao-com-ovo",
  "pao-com-queijo-minas": "queijo-minas",
  "cuscuz-mineirinho": "cuscuz",
  "mineirinho-gourmet": "mineirinho-gourmet",
};

export const officialCategories = imported.categories;
export const officialProducts = imported.products.map((p) => {
  const key = photoBySlug[p.slug];
  const image = key ? productPhotos[key] : undefined;
  return image ? { ...p, image } : p;
});
