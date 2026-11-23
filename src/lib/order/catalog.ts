import { customizationProfiles, optionGroups } from "@/content/customization";
import { packagingOptions, units as rawUnits } from "@/content/units";
import { getBrand, getMenu } from "@/lib/content";
import { storeUnitSchema } from "@/lib/schemas";
import { showDrafts } from "@/lib/site";
import type { MenuProduct, StoreUnit, UnitId } from "@/types/content";
import { z } from "zod";
import type { OptionGroup } from "./pricing";

const parsedUnits = z.array(storeUnitSchema).safeParse(rawUnits);
if (!parsedUnits.success) {
  throw new Error(
    `Conteúdo inválido em content/units.ts:\n${parsedUnits.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("\n")}`,
  );
}
const allUnits = parsedUnits.data;

const visible = (status: "verified" | "draft") => status === "verified" || (showDrafts && status === "draft");

export type CatalogItem = MenuProduct & { categoryName: string; groups: OptionGroup[]; unitIds: UnitId[] };

export type PublicUnit = Omit<StoreUnit, "delivery"> & { delivery?: StoreUnit["delivery"] };

export type OrderConfig = {
  enabled: boolean;
  shopName: string;
  units: PublicUnit[];
  packaging: { id: string; label: string; description: string; priceCents: number }[];
  catalog: CatalogItem[];
};

function groupsFor(product: MenuProduct): OptionGroup[] {
  const groups: OptionGroup[] = [];
  if (product.variants?.length) {
    groups.push({
      id: "tamanho",
      label: "Tamanho",
      kind: "single",
      required: true,
      defaultChoice: product.variants[0]?.id,
      choices: product.variants.map((v) => ({ id: v.id, label: v.label, detail: v.volume, priceCents: v.priceCents })),
    });
  }
  if (product.temperature === "both") {
    groups.push({
      id: "temperatura",
      label: "Temperatura",
      kind: "single",
      required: true,
      choices: [
        { id: "quente", label: "Quente" },
        { id: "gelado", label: "Gelado" },
      ],
    });
  }
  for (const option of product.options ?? []) {
    groups.push({
      id: option.id,
      label: option.label,
      kind: "single",
      required: true,
      choices: option.choices.map((c) => ({ id: c.id, label: c.label })),
    });
  }
  const profile = product.dataStatus === "draft" ? customizationProfiles[product.slug] : undefined;
  if (!profile) return groups;
  for (const id of profile.groups) {
    const def = optionGroups[id];
    const choices =
      id === "adicionais" && profile.addons ? def.choices.filter((c) => profile.addons?.includes(c.id)) : def.choices;
    if (choices.length) groups.push({ ...def, id, choices });
  }
  return groups;
}

export function getUnits(): PublicUnit[] {
  return allUnits.map((u) => ({
    ...u,
    hours: u.hours && visible(u.hours.status) ? u.hours : undefined,
    contact: visible(u.contact.status) ? u.contact : { status: u.contact.status },
    delivery: visible(u.delivery.status) ? u.delivery : undefined,
  }));
}

export function getOrderConfig(): OrderConfig {
  const { categories, products } = getMenu();
  const names = new Map(categories.map((c) => [c.id, c.name]));
  const allIds = allUnits.map((u) => u.id);
  return {
    enabled: showDrafts,
    shopName: getBrand().shortName,
    units: getUnits(),
    packaging: packagingOptions.map((p) => ({ ...p })),
    catalog: products.map((p) => ({
      ...p,
      categoryName: names.get(p.categoryId) ?? "",
      groups: groupsFor(p),
      unitIds: p.units?.length ? p.units : allIds,
    })),
  };
}
