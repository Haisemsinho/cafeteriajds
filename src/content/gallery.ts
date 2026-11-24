import type { GalleryImage } from "@/types/content";
import { casa, photos } from "./photos";

export const gallery: GalleryImage[] = [
  { id: "salao", area: "salao", status: "verified", ...casa.salao },
  { id: "maquina", area: "balcao", status: "verified", ...casa.maquina },
  { id: "letreiro-parede", area: "detalhes", status: "verified", ...casa.paredeLetreiro },
  { id: "fachada", area: "fachada", status: "verified", ...photos.fachada },
  { id: "interior", area: "salao", status: "verified", ...photos.interior },
  { id: "xicara", area: "cafe", status: "verified", ...photos.xicara },
  { id: "letreiro", area: "fachada", status: "verified", ...photos.letreiro },
  { id: "dia-do-cafe", area: "comunicacao", status: "verified", ...photos.diaDoCafe },
  { id: "varanda", area: "fachada", status: "verified", ...photos.varanda },
  { id: "balcao", area: "balcao", status: "verified", ...photos.balcao },
  { id: "prateleiras", area: "detalhes", status: "verified", ...photos.prateleiras },
];
