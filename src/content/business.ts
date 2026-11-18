import type { BusinessAnnouncement, BusinessProfile } from "@/types/content";

export const business: BusinessProfile = {
  name: "JDS Cafeteria",
  shortName: "JDS",
  tagline: "Café, pausa e encontro",
  logo: undefined,
  description:
    "Cafeteria de fachada em ripas de madeira, com tijolo aparente, plantas e luz natural. Um lugar para o café, a pausa e o encontro.",

  // preencher quando o cliente confirmar. deixar undefined esconde o bloco no site
  address: undefined,
  hours: undefined,

  contact: {
    status: "draft",
    phone: undefined,
    whatsapp: undefined,
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
