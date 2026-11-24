import { z } from "zod";
import { announcements as rawAnnouncements, business as rawBusiness } from "@/content/business";
import { gallery as rawGallery } from "@/content/gallery";
import { highlights as rawHighlights } from "@/content/highlights";
import { categories as demoCategories, products as demoProducts } from "@/content/menu";
import { officialCategories, officialProducts } from "@/content/officialMenu";
import { philosophy, storyBlocks as rawStory, storyIntro } from "@/content/story";
import { productPhotos } from "@/content/illustrative";
import { casa } from "@/content/photos";
import { reviews as rawReviews } from "@/content/reviews";
import {
  announcementSchema,
  businessProfileSchema,
  galleryImageSchema,
  highlightSchema,
  menuCategorySchema,
  menuProductSchema,
  reviewSchema,
  storyBlockSchema,
} from "@/lib/schemas";
import { menuSource, showDrafts } from "@/lib/site";
import { zonedNow } from "@/lib/hours";
import { selectHomeReviews } from "@/lib/reviews";
import type {
  ContactInformation,
  CustomerReview,
  DataStatus,
  GalleryImage,
  Highlight,
  MenuProduct,
  Photo,
} from "@/types/content";

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
const official = menuSource === "oficial";
const categories = check(
  z.array(menuCategorySchema),
  official ? officialCategories : demoCategories,
  "categorias do cardápio",
);
const products = check(z.array(menuProductSchema), official ? officialProducts : demoProducts, "produtos do cardápio");
const gallery = check(z.array(galleryImageSchema), rawGallery, "content/gallery.ts");
const highlights = check(z.array(highlightSchema), rawHighlights, "content/highlights.ts");
const story = check(z.array(storyBlockSchema), rawStory, "content/story.ts");
const reviews = check(z.array(reviewSchema), rawReviews, "content/reviews.ts");

unique(reviews, "avaliações");

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

const isVisible = (status: DataStatus | "pending" | "review") =>
  status === "verified" || (showDrafts && (status === "draft" || (status === "review" && official)));

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

export function getBrand() {
  return { name: business.name, shortName: business.shortName, logo: business.logo };
}

export function getInstagram() {
  return getBusiness().social.find((s) => s.network === "instagram");
}

export function getAnnouncements(today = zonedNow(business.hours?.timezone ?? "America/Sao_Paulo").date) {
  return announcements.filter(
    (a) => isVisible(a.status) && (!a.startsAt || a.startsAt <= today) && (!a.endsAt || a.endsAt >= today),
  );
}

const allowPhoto = (photo?: Photo) => (photo && (showDrafts || !photo.illustrative) ? photo : undefined);

const withAllowedPhotos = (p: MenuProduct): MenuProduct => ({
  ...p,
  image: allowPhoto(p.image),
  images: p.images?.filter((i) => allowPhoto(i)),
});

export function getPhotoCredits() {
  if (!showDrafts) return [];
  const seen = new Map<string, NonNullable<Photo["credit"]>>();
  for (const photo of Object.values(productPhotos)) {
    if (photo.credit && !seen.has(photo.credit.url)) seen.set(photo.credit.url, photo.credit);
  }
  return [...seen.values()];
}

export function getScenes() {
  return {
    hero: { desktop: casa.salaoBalcao, mobile: casa.balcaoBolo },
    intro: casa.paredeLetreiro,
    invite: casa.mesas,
    menu: casa.mesas,
  };
}

export function getMenu() {
  const visibleProducts = products
    .filter((p) => isVisible(p.dataStatus))
    .map(withAllowedPhotos)
    .sort(byOrder);
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

export function getProduct(slug: string) {
  const { categories: cats, products: items } = getMenu();
  const product = items.find((p) => p.slug === slug);
  if (!product) return undefined;
  const category = cats.find((c) => c.id === product.categoryId);
  return { ...product, categoryName: category?.name ?? "" };
}

export function getRelatedProducts(product: MenuProduct, limit = 4) {
  const { categories: cats, products: items } = getMenu();
  const names = new Map(cats.map((c) => [c.id, c.name]));
  const others = items.filter((p) => p.id !== product.id && p.availability !== "unavailable");
  const picked: MenuProduct[] = [];
  const add = (list: MenuProduct[]) => {
    for (const p of list) if (picked.length < limit && !picked.includes(p)) picked.push(p);
  };
  add(others.filter((p) => p.categoryId === product.categoryId));
  add(others.filter((p) => p.featured));
  add(others);
  return picked.map((p) => ({ ...p, categoryName: names.get(p.categoryId) ?? "" }));
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

export function getHomeReviews(limit = 6): CustomerReview[] {
  return selectHomeReviews(reviews, showDrafts, limit);
}

export function isDraft(status: DataStatus | "pending" | "review") {
  return status !== "verified";
}
