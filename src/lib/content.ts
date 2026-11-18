import { z } from "zod";
import { announcements as rawAnnouncements, business as rawBusiness } from "@/content/business";
import { gallery as rawGallery } from "@/content/gallery";
import { highlights as rawHighlights } from "@/content/highlights";
import { categories as rawCategories, products as rawProducts } from "@/content/menu";
import { philosophy, storyBlocks as rawStory, storyIntro } from "@/content/story";
import {
  announcementSchema,
  businessProfileSchema,
  galleryImageSchema,
  highlightSchema,
  menuCategorySchema,
  menuProductSchema,
  storyBlockSchema,
} from "@/lib/schemas";
import { showDrafts } from "@/lib/site";
import { zonedNow } from "@/lib/hours";
import type { ContactInformation, DataStatus, GalleryImage, Highlight, MenuProduct } from "@/types/content";

function check<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join(".") || "(raiz)"}: ${i.message}`).join("\n");
    throw new Error(`Conteúdo inválido em ${label}:\n${issues}`);
  }
  return result.data;
}

function unique(items: { id: string }[], label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`id repetido em ${label}: ${item.id}`);
    seen.add(item.id);
  }
}

const business = check(businessProfileSchema, rawBusiness, "content/business.ts");
const announcements = check(z.array(announcementSchema), rawAnnouncements, "avisos");
const categories = check(z.array(menuCategorySchema), rawCategories, "categorias do cardápio");
const products = check(z.array(menuProductSchema), rawProducts, "produtos do cardápio");
const gallery = check(z.array(galleryImageSchema), rawGallery, "content/gallery.ts");
const highlights = check(z.array(highlightSchema), rawHighlights, "content/highlights.ts");
const story = check(z.array(storyBlockSchema), rawStory, "content/story.ts");

unique(categories, "categorias");
unique(products, "produtos");
unique(
  products.map((p) => ({ id: p.slug })),
  "slugs de produtos",
);

for (const product of products) {
  if (!categories.some((c) => c.id === product.categoryId)) {
    throw new Error(`Produto "${product.name}" aponta para a categoria "${product.categoryId}", que não existe.`);
  }
}

const isVisible = (status: DataStatus | "pending") => status === "verified" || (showDrafts && status === "draft");

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const hiddenContact = (contact: ContactInformation): ContactInformation => ({ status: contact.status });

export function getBusiness() {
  const { address, hours, contact, social } = business;
  return {
    ...business,
    address: address && isVisible(address.status) ? address : undefined,
    hours: hours && isVisible(hours.status) ? hours : undefined,
    contact: isVisible(contact.status) ? contact : hiddenContact(contact),
    social: social.filter((s) => isVisible(s.status)),
  };
}

export type PublicBusiness = ReturnType<typeof getBusiness>;

export function getInstagram() {
  return getBusiness().social.find((s) => s.network === "instagram");
}

export function getAnnouncements(today = zonedNow(business.hours?.timezone ?? "America/Sao_Paulo").date) {
  return announcements.filter(
    (a) => isVisible(a.status) && (!a.startsAt || a.startsAt <= today) && (!a.endsAt || a.endsAt >= today),
  );
}

export function getMenu() {
  const visibleProducts = products.filter((p) => isVisible(p.dataStatus)).sort(byOrder);
  const visibleCategories = categories
    .filter((c) => isVisible(c.status) && visibleProducts.some((p) => p.categoryId === c.id))
    .sort(byOrder);
  const categoryIds = new Set(visibleCategories.map((c) => c.id));

  return {
    categories: visibleCategories,
    products: visibleProducts.filter((p) => categoryIds.has(p.categoryId)),
  };
}

export function getFeaturedProducts(limit = 4): (MenuProduct & { categoryName: string })[] {
  const { categories: cats, products: items } = getMenu();
  const names = new Map(cats.map((c) => [c.id, c.name]));
  return items
    .filter((p) => p.featured && p.availability !== "unavailable")
    .slice(0, limit)
    .map((p) => ({ ...p, categoryName: names.get(p.categoryId) ?? "" }));
}

export function getGallery(area?: GalleryImage["area"]) {
  return gallery.filter((g) => isVisible(g.status) && (!area || g.area === area));
}

export function getHighlights(): Highlight[] {
  return highlights.filter((h) => isVisible(h.status)).sort(byOrder);
}

export function getStory() {
  return {
    intro: isVisible(storyIntro.status) ? storyIntro.paragraphs : [],
    blocks: story.filter((b) => isVisible(b.status)),
    pending: showDrafts ? story.filter((b) => b.status === "pending") : [],
    philosophy: isVisible(philosophy.status) ? philosophy : undefined,
  };
}

export function isDraft(status: DataStatus | "pending") {
  return status !== "verified";
}
