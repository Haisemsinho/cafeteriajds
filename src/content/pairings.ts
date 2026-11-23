import type { ProductPair, RoleRule } from "@/lib/recommend/engine";

export const pairingRules: RoleRule[] = [
  { when: "cafe", suggest: "bolo", weight: 34 },
  { when: "cafe", suggest: "doce", weight: 30 },
  { when: "cafe", suggest: "salgado", weight: 22 },
  { when: "bebida-quente", suggest: "bolo", weight: 30 },
  { when: "bebida-quente", suggest: "doce", weight: 28 },
  { when: "bebida-quente", suggest: "salgado", weight: 22 },
  { when: "bolo", suggest: "cafe", weight: 34 },
  { when: "bolo", suggest: "bebida-quente", weight: 30 },
  { when: "doce", suggest: "cafe", weight: 30 },
  { when: "doce", suggest: "bebida-quente", weight: 26 },
  { when: "sobremesa", suggest: "cafe", weight: 30 },
  { when: "salgado", suggest: "cafe", weight: 32 },
  { when: "salgado", suggest: "bebida-quente", weight: 28 },
  { when: "salgado", suggest: "bebida", weight: 20 },
  { when: "bebida-gelada", suggest: "sobremesa", weight: 30 },
  { when: "bebida-gelada", suggest: "doce", weight: 24 },
  { when: "bebida-gelada", suggest: "salgado", weight: 18 },
  { when: "bebida", suggest: "salgado", weight: 20 },
  { when: "bebida", suggest: "bolo", weight: 18 },
];

export const productPairs: ProductPair[] = [];
