import type { GroupId, OptionGroup } from "@/lib/order/pricing";

type GroupDef = Omit<OptionGroup, "id">;

export const optionGroups: Record<Exclude<GroupId, "tamanho" | "temperatura">, GroupDef> = {
  intensidade: {
    label: "Intensidade do café",
    kind: "single",
    required: true,
    defaultChoice: "tradicional",
    choices: [
      { id: "suave", label: "Suave" },
      { id: "tradicional", label: "Tradicional" },
      { id: "intenso", label: "Intenso" },
    ],
  },
  dose: {
    label: "Quantidade de espresso",
    kind: "single",
    required: true,
    defaultChoice: "simples",
    choices: [
      { id: "simples", label: "Dose simples" },
      { id: "dupla", label: "Dose dupla", priceCents: 300 },
      { id: "extra", label: "Dose extra", detail: "três doses", priceCents: 500 },
    ],
  },
  leite: {
    label: "Tipo de leite",
    kind: "single",
    required: true,
    defaultChoice: "integral",
    choices: [
      { id: "integral", label: "Integral" },
      { id: "desnatado", label: "Desnatado" },
      { id: "sem-lactose", label: "Sem lactose", priceCents: 100 },
      { id: "vegetal", label: "Bebida vegetal", priceCents: 300 },
    ],
  },
  adocar: {
    label: "Adoçamento",
    kind: "single",
    required: true,
    defaultChoice: "sem",
    choices: [
      { id: "sem", label: "Sem açúcar" },
      { id: "acucar", label: "Açúcar" },
      { id: "adocante", label: "Adoçante" },
    ],
  },
  docura: {
    label: "Quanto adoçar",
    kind: "single",
    required: true,
    defaultChoice: "normal",
    showWhen: { group: "adocar", notIn: ["sem"] },
    choices: [
      { id: "pouco", label: "Pouco" },
      { id: "normal", label: "Normal" },
      { id: "bastante", label: "Bastante" },
    ],
  },
  adicionais: {
    label: "Adicionais",
    hint: "Opcional. Escolha até 3.",
    kind: "multi",
    required: false,
    maxChoices: 3,
    choices: [
      { id: "chantilly", label: "Chantilly", priceCents: 200 },
      { id: "calda-chocolate", label: "Calda de chocolate", priceCents: 200 },
      { id: "caramelo", label: "Caramelo", priceCents: 200 },
      { id: "canela", label: "Canela" },
      { id: "leite-extra", label: "Leite extra", priceCents: 150 },
      { id: "dose-adicional", label: "Dose adicional de café", priceCents: 300 },
    ],
  },
};

type Profile = {
  groups: Exclude<GroupId, "tamanho" | "temperatura">[];
  addons?: string[];
};

const milkDrink: Profile = {
  groups: ["dose", "leite", "adocar", "docura", "adicionais"],
  addons: ["chantilly", "calda-chocolate", "caramelo", "canela"],
};

export const customizationProfiles: Record<string, Profile> = {
  espresso: { groups: ["intensidade", "dose", "adocar", "docura"] },
  "espresso-duplo": { groups: ["intensidade", "adocar", "docura"] },
  "cafe-coado": { groups: ["intensidade", "adocar", "docura", "adicionais"], addons: ["leite-extra", "canela"] },
  cappuccino: milkDrink,
  latte: milkDrink,
  mocha: { ...milkDrink, addons: ["chantilly", "caramelo", "canela"] },
  "cafe-gelado": {
    groups: ["dose", "adocar", "docura", "adicionais"],
    addons: ["leite-extra", "caramelo", "dose-adicional"],
  },
  "latte-gelado": milkDrink,
  "chocolate-quente": {
    groups: ["leite", "adocar", "docura", "adicionais"],
    addons: ["chantilly", "canela", "dose-adicional"],
  },
};

export const customizationStatus = "draft" as const;
