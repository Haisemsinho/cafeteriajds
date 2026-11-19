import type { StaticImageData } from "next/image";
import { z } from "zod";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "use HH:MM");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use AAAA-MM-DD");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug invalido");

export const dataStatusSchema = z.enum(["verified", "draft"]);

const staticImage = z.custom<StaticImageData>(
  (value) => typeof value === "object" && value !== null && "src" in value && "width" in value,
  "imagem precisa ser importada estaticamente",
);

export const photoCreditSchema = z.object({
  author: z.string().optional(),
  license: z.string(),
  url: z.url().refine((u) => u.startsWith("https://"), "link precisa ser https"),
});

export const photoSchema = z.object({
  src: staticImage,
  alt: z.string().min(3),
  caption: z.string().optional(),
  position: z.string().optional(),
  positionMobile: z.string().optional(),
  illustrative: z.boolean().optional(),
  credit: photoCreditSchema.optional(),
});

export const openingPeriodSchema = z
  .object({ opens: time, closes: time })
  .refine((p) => p.closes > p.opens, "horario de fechamento precisa ser depois da abertura");

const dayPeriods = z.array(openingPeriodSchema);

export const openingHoursSchema = z.object({
  status: dataStatusSchema,
  timezone: z.string().min(3),
  week: z.object({
    0: dayPeriods,
    1: dayPeriods,
    2: dayPeriods,
    3: dayPeriods,
    4: dayPeriods,
    5: dayPeriods,
    6: dayPeriods,
  }),
  exceptions: z.array(
    z.object({
      date: isoDate,
      label: z.string(),
      periods: dayPeriods,
    }),
  ),
});

export const addressSchema = z.object({
  status: dataStatusSchema,
  street: z.string().min(2),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(2),
  state: z.string().length(2),
  postalCode: z.string().optional(),
  reference: z.string().optional(),
  mapsUrl: z.string().url().startsWith("https://", "use um link https").optional(),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

const httpsUrl = z.string().url().startsWith("https://", "use um link https");

export const socialLinkSchema = z.object({
  network: z.enum(["instagram", "facebook", "tiktok"]),
  handle: z.string(),
  url: httpsUrl,
  status: dataStatusSchema,
});

export const contactInformationSchema = z.object({
  status: dataStatusSchema,
  phone: z
    .string()
    .regex(/^\d{12,13}$/, "telefone so com numeros, com 55 e DDD")
    .optional(),
  whatsapp: z
    .string()
    .regex(/^\d{12,13}$/, "whatsapp so com numeros, com 55 e DDD")
    .optional(),
  email: z.string().email().optional(),
});

export const businessProfileSchema = z.object({
  name: z.string().min(2),
  shortName: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  logo: photoSchema.optional(),
  foundedYear: z.number().int().optional(),
  address: addressSchema.optional(),
  hours: openingHoursSchema.optional(),
  contact: contactInformationSchema,
  social: z.array(socialLinkSchema),
});

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  tone: z.enum(["info", "warning", "special"]),
  startsAt: isoDate.optional(),
  endsAt: isoDate.optional(),
  status: dataStatusSchema,
});

export const menuCategorySchema = z.object({
  id: slug,
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  status: dataStatusSchema,
});

export const productVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  volume: z.string().optional(),
  priceCents: z.number().int().positive().optional(),
});

export const productAvailabilitySchema = z.enum(["available", "unavailable", "coming-soon"]);

export const illustrationSchema = z.enum([
  "espresso",
  "espresso-duplo",
  "coado",
  "cappuccino",
  "latte",
  "mocha",
  "gelado",
  "latte-gelado",
  "chocolate",
  "pao-de-queijo",
  "croissant",
  "bolo",
  "brownie",
  "biscoitos",
]);

export const productTagSchema = z.enum(["destaque", "novidade", "sazonal", "da-casa"]);

export const menuProductSchema = z.object({
  id: z.string(),
  slug,
  name: z.string(),
  description: z.string(),
  categoryId: slug,
  image: photoSchema.optional(),
  images: z.array(photoSchema).optional(),
  illustration: illustrationSchema.optional(),
  priceCents: z.number().int().positive().optional(),
  variants: z.array(productVariantSchema).optional(),
  temperature: z.enum(["hot", "iced", "both"]).optional(),
  ingredients: z.array(z.string()).optional(),
  allergens: z
    .object({
      contains: z.array(z.string()),
      checkedAt: isoDate,
    })
    .optional(),
  availability: productAvailabilitySchema,
  availabilityNote: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(productTagSchema).optional(),
  order: z.number(),
  dataStatus: dataStatusSchema,
  units: z.array(z.enum(["centro", "br116"])).optional(),
});

export const galleryImageSchema = photoSchema.extend({
  id: z.string(),
  area: z.enum(["fachada", "salao", "balcao", "detalhes", "cafe", "comunicacao"]),
  status: dataStatusSchema,
});

export const highlightSchema = z.object({
  id: z.string(),
  kind: z.enum(["destaque", "novidade", "sazonal", "embalado", "presente", "kit"]),
  title: z.string(),
  description: z.string(),
  image: photoSchema.optional(),
  productSlug: slug.optional(),
  order: z.number(),
  status: dataStatusSchema,
});

export const storyBlockSchema = z.object({
  id: z.string(),
  kind: z.enum(["origem", "fundadores", "inauguracao", "valores", "filosofia", "acervo"]),
  title: z.string(),
  body: z.array(z.string()),
  hint: z.string(),
  image: photoSchema.optional(),
  status: z.enum(["verified", "draft", "pending"]),
});

export const unitIdSchema = z.enum(["centro", "br116"]);

export const storeUnitSchema = z.object({
  id: unitIdSchema,
  name: z.string().min(2),
  summary: z.string(),
  address: addressSchema,
  hours: openingHoursSchema.optional(),
  contact: contactInformationSchema,
  delivery: z.object({
    status: dataStatusSchema,
    feeCents: z.number().int().nonnegative(),
    cities: z.array(z.string().min(2)).min(1),
    note: z.string(),
  }),
});

export const reviewSchema = z
  .object({
    id: z.string().min(1),
    customerName: z.string().min(2).max(60),
    customerPhoto: photoSchema.extend({ authorized: z.literal(true, "foto de cliente so com autorizacao") }).optional(),
    reviewText: z.string().min(10).max(1200),
    rating: z.number().int().min(1).max(5).optional(),
    source: z.object({ label: z.string().min(2).max(40), url: httpsUrl.optional() }).optional(),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    displayOrder: z.number().int(),
    createdAt: isoDate,
    updatedAt: isoDate,
    status: dataStatusSchema,
  })
  .refine((r) => r.updatedAt >= r.createdAt, "updatedAt precisa ser igual ou depois de createdAt");
