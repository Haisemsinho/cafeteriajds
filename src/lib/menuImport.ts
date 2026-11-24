import { z } from "zod";
import type { CategoryRole, MenuCategory, MenuOption, MenuProduct } from "@/types/content";

export const transcriptSchema = z.object({
  sourceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  branch: z.string(),
  sourceIsPhotograph: z.boolean(),
  products: z
    .array(
      z.object({
        id: z.string().min(1),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        category: z.string().min(2),
        name: z.string().min(1),
        priceCents: z.number().int().positive(),
        descriptionFromMenu: z.string().nullable(),
        optionsFromMenu: z.array(z.string().min(1)),
        exampleOptions: z.array(z.string().min(1)).optional(),
        branchId: z.enum(["centro", "br116"]).nullable(),
        stockStatus: z.enum(["unconfirmed", "available", "unavailable"]),
        imageUrl: z.string().nullable(),
        published: z.boolean(),
        source: z.string(),
        reviewFlags: z.array(z.string()),
        restrictedItem: z.boolean().optional(),
        onlinePurchasable: z.boolean().optional(),
      }),
    )
    .min(1),
});

export type Transcript = z.infer<typeof transcriptSchema>;

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseOptions(raw: string[]): MenuOption[] {
  if (raw.length < 2) return [];
  const prefixed = raw.map((r) => r.match(/^([^:]+):\s*(.+)$/));
  if (prefixed.every(Boolean)) {
    const labels = new Set(prefixed.map((m) => m?.[1]?.trim()));
    const label = [...labels][0];
    if (labels.size === 1 && label) {
      return [
        {
          id: slugify(label) === "borda" ? "borda" : "sabor",
          label,
          choices: prefixed.map((m) => ({ id: slugify(m?.[2] ?? ""), label: m?.[2]?.trim() ?? "" })),
        },
      ];
    }
  }
  return [{ id: "sabor", label: "Sabor", choices: raw.map((r) => ({ id: slugify(r), label: r })) }];
}

export function importTranscript(
  input: unknown,
  roles: Record<string, CategoryRole[]> = {},
): { categories: MenuCategory[]; products: MenuProduct[] } {
  const parsed = transcriptSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Transcrição do cardápio inválida:\n${issues}`);
  }

  const categories: MenuCategory[] = [];
  const products: MenuProduct[] = [];
  const counters = new Map<string, number>();

  for (const item of parsed.data.products) {
    const categoryId = slugify(item.category);
    if (!categories.some((c) => c.id === categoryId)) {
      categories.push({
        id: categoryId,
        name: item.category,
        order: categories.length + 1,
        status: "review",
        roles: roles[categoryId],
      });
    }
    const order = (counters.get(categoryId) ?? 0) + 1;
    counters.set(categoryId, order);
    const options = parseOptions(item.optionsFromMenu);
    if (!options.length && item.exampleOptions && item.exampleOptions.length > 1) {
      options.push({
        id: "sabor",
        label: "Sabor",
        example: true,
        choices: item.exampleOptions.map((o) => ({ id: slugify(o), label: o })),
      });
    }

    products.push({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.descriptionFromMenu ?? "",
      categoryId,
      priceCents: item.priceCents,
      availability:
        item.stockStatus === "available"
          ? "available"
          : item.stockStatus === "unavailable"
            ? "unavailable"
            : "unconfirmed",
      order,
      dataStatus: item.published && item.branchId ? "verified" : "review",
      units: item.branchId ? [item.branchId] : undefined,
      unitStatus: item.branchId ? "confirmed" : "pending",
      options: options.length ? options : undefined,
      ageRestricted: item.restrictedItem || undefined,
      onlinePurchasable: item.onlinePurchasable,
      source: item.source,
      reviewFlags: item.reviewFlags.length ? item.reviewFlags : undefined,
    });
  }

  return { categories, products };
}
