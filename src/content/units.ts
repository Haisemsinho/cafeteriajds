import type { StoreUnit } from "@/types/content";

export const units: StoreUnit[] = [
  {
    id: "centro",
    name: "Centro",
    summary: "Av. Jacob Dornelas Neto",
    address: {
      status: "verified",
      street: "Avenida Jacob Dornelas Neto",
      district: "Centro",
      city: "São João do Manhuaçu",
      state: "MG",
      postalCode: "36918-000",
    },
    hours: {
      status: "verified",
      timezone: "America/Sao_Paulo",
      week: {
        0: [],
        1: [{ opens: "07:00", closes: "19:00" }],
        2: [{ opens: "07:00", closes: "19:00" }],
        3: [{ opens: "07:00", closes: "19:00" }],
        4: [{ opens: "07:00", closes: "19:00" }],
        5: [{ opens: "07:00", closes: "19:00" }],
        6: [],
      },
      exceptions: [],
    },
    contact: { status: "verified", phone: "5533984224482", whatsapp: "5533984224482" },
    delivery: {
      status: "draft",
      feeCents: 500,
      cities: ["São João do Manhuaçu"],
      note: "Área e taxa de exemplo. A entrega real ainda não foi confirmada pela JDS.",
    },
  },
  {
    id: "br116",
    name: "BR 116",
    summary: "Rodovia Santos Dumont, Córrego Caratinga",
    address: {
      status: "verified",
      street: "Rodovia Santos Dumont, BR 116 (Rio-Bahia)",
      district: "Córrego Caratinga, área rural",
      city: "São João do Manhuaçu",
      state: "MG",
      postalCode: "36918-000",
    },
    hours: undefined,
    contact: { status: "draft" },
    delivery: {
      status: "draft",
      feeCents: 800,
      cities: ["São João do Manhuaçu"],
      note: "Área e taxa de exemplo. A entrega real ainda não foi confirmada pela JDS.",
    },
  },
];

export const packagingOptions = [
  { id: "padrao", label: "Embalagem padrão", description: "Copo com tampa e sacola simples.", priceCents: 0 },
  {
    id: "reforcada",
    label: "Embalagem reforçada",
    description: "Suporte para copos e proteção extra no trajeto.",
    priceCents: 200,
  },
  {
    id: "presente",
    label: "Embalagem para presente",
    description: "Caixa fechada com laço, para entregar de surpresa.",
    priceCents: 500,
  },
] as const;

export type PackagingId = (typeof packagingOptions)[number]["id"];
