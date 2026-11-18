import type { GalleryImage } from "@/types/content";
import { photos } from "./photos";

export const gallery: GalleryImage[] = [
  { id: "fachada", area: "fachada", status: "verified", ...photos.fachada },
  { id: "interior", area: "salao", status: "verified", ...photos.interior },
  { id: "xicara", area: "cafe", status: "verified", ...photos.xicara },
  { id: "letreiro", area: "fachada", status: "verified", ...photos.letreiro },
  { id: "dia-do-cafe", area: "comunicacao", status: "verified", ...photos.diaDoCafe },
  { id: "varanda", area: "fachada", status: "verified", ...photos.varanda },
  { id: "balcao", area: "balcao", status: "verified", ...photos.balcao },
  { id: "prateleiras", area: "detalhes", status: "verified", ...photos.prateleiras },
];
