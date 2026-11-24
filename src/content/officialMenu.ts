import { importTranscript } from "@/lib/menuImport";
import transcript from "./import/cardapio-centro-conferido-2026-11-23.json";

export const officialMenuSource = {
  file: "src/content/import/cardapio-centro-conferido-2026-11-23.json",
  date: transcript.sourceDate,
  branch: transcript.branch,
};

export const { categories: officialCategories, products: officialProducts } = importTranscript(transcript, {
  cafes: ["bebida", "cafe"],
  "drinks-quentes": ["bebida", "bebida-quente"],
  bebidas: ["bebida"],
  sobremesas: ["sobremesa", "doce"],
  "bebidas-geladas": ["bebida", "bebida-gelada"],
  bolos: ["bolo", "doce"],
  salgados: ["salgado"],
});
