import type { BusinessAnnouncement, BusinessProfile } from "@/types/content";

export const business: BusinessProfile = {
  name: "Cafeteria JDS",
  shortName: "JDS",
  tagline: "Café, pausa e encontro",
  logo: undefined,
  description:
    "Cafeteria de fachada em ripas de madeira, com tijolo aparente, plantas e luz natural. Um lugar para o café, a pausa e o encontro.",

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

  contact: {
    status: "verified",
    phone: "5533984224482",
    whatsapp: "5533984224482",
    email: undefined,
  },

  social: [
    {
      network: "instagram",
      handle: "@cafeteriajds",
      url: "https://www.instagram.com/cafeteriajds/",
      status: "verified",
    },
  ],
};

export const announcements: BusinessAnnouncement[] = [
  {
    id: "aviso-exemplo",
    title: "Aviso de exemplo",
    message:
      "Use este espaço para horários especiais, feriados ou novidades da casa. Ele some sozinho depois da data de término.",
    tone: "info",
    status: "draft",
  },
];
