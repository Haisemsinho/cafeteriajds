export type GroupId =
  "tamanho" | "temperatura" | "sabor" | "borda" | "intensidade" | "dose" | "leite" | "adocar" | "docura" | "adicionais";

export type OptionChoice = {
  id: string;
  label: string;
  detail?: string;
  priceCents?: number;
};

export type OptionGroup = {
  id: GroupId;
  label: string;
  hint?: string;
  kind: "single" | "multi";
  required: boolean;
  defaultChoice?: string;
  maxChoices?: number;
  showWhen?: { group: GroupId; notIn: string[] };
  choices: OptionChoice[];
};

export type Selection = {
  choices: Partial<Record<GroupId, string[]>>;
  note: string;
};

export type PricedProduct = {
  name: string;
  priceCents?: number;
  variants?: { id: string; label: string; volume?: string; priceCents?: number }[];
  groups: OptionGroup[];
};

export type PriceLine = { label: string; cents: number };

export type UnitPrice = {
  base: PriceLine;
  extras: PriceLine[];
  unitCents: number;
  known: boolean;
};

export const NOTE_LIMIT = 140;

export function isGroupVisible(group: OptionGroup, selection: Selection) {
  if (!group.showWhen) return true;
  const picked = selection.choices[group.showWhen.group] ?? [];
  return picked.length > 0 && !picked.some((id) => group.showWhen?.notIn.includes(id));
}

export function visibleGroups(product: PricedProduct, selection: Selection) {
  return product.groups.filter((g) => isGroupVisible(g, selection));
}

export function defaultSelection(product: PricedProduct): Selection {
  const choices: Selection["choices"] = {};
  for (const group of product.groups) {
    if (group.kind === "single" && group.defaultChoice) choices[group.id] = [group.defaultChoice];
    else if (group.kind === "multi") choices[group.id] = [];
  }
  return { choices, note: "" };
}

export function unitPrice(product: PricedProduct, selection: Selection): UnitPrice {
  const size = product.groups.find((g) => g.id === "tamanho");
  const sizeId = selection.choices.tamanho?.[0] ?? size?.defaultChoice;
  const variant = size ? product.variants?.find((v) => v.id === sizeId) : undefined;
  const baseCents = variant?.priceCents ?? product.priceCents;
  const base = {
    label: variant ? `${product.name}, ${variant.label.toLowerCase()}` : product.name,
    cents: baseCents ?? 0,
  };

  const extras: PriceLine[] = [];
  for (const group of visibleGroups(product, selection)) {
    if (group.id === "tamanho") continue;
    for (const id of selection.choices[group.id] ?? []) {
      const choice = group.choices.find((c) => c.id === id);
      if (choice?.priceCents) extras.push({ label: choice.label, cents: choice.priceCents });
    }
  }

  return {
    base,
    extras,
    unitCents: base.cents + extras.reduce((sum, e) => sum + e.cents, 0),
    known: baseCents !== undefined,
  };
}

export function lineTotal(unitCents: number, quantity: number) {
  return unitCents * quantity;
}

export type ValidationError = { group: GroupId | "note"; message: string };

export function validateSelection(product: PricedProduct, selection: Selection): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const group of visibleGroups(product, selection)) {
    const picked = (selection.choices[group.id] ?? []).filter((id) => group.choices.some((c) => c.id === id));
    if (group.required && picked.length === 0) {
      errors.push({ group: group.id, message: `Escolha uma opção em "${group.label}".` });
    }
    if (group.kind === "single" && picked.length > 1) {
      errors.push({ group: group.id, message: `Escolha só uma opção em "${group.label}".` });
    }
    if (group.maxChoices && picked.length > group.maxChoices) {
      errors.push({ group: group.id, message: `Escolha até ${group.maxChoices} itens em "${group.label}".` });
    }
  }
  if (selection.note.length > NOTE_LIMIT) {
    errors.push({ group: "note", message: `A observação pode ter até ${NOTE_LIMIT} caracteres.` });
  }
  return errors;
}

export function describeSelection(product: PricedProduct, selection: Selection) {
  const parts: string[] = [];
  for (const group of visibleGroups(product, selection)) {
    const labels = (selection.choices[group.id] ?? [])
      .map((id) => group.choices.find((c) => c.id === id)?.label)
      .filter((l): l is string => Boolean(l));
    if (labels.length) parts.push(group.kind === "multi" ? `Adicionais: ${labels.join(", ")}` : labels.join(", "));
  }
  return parts;
}

export function sameSelection(a: Selection, b: Selection) {
  const keys = new Set([...Object.keys(a.choices), ...Object.keys(b.choices)]) as Set<GroupId>;
  for (const key of keys) {
    const x = [...(a.choices[key] ?? [])].sort().join("|");
    const y = [...(b.choices[key] ?? [])].sort().join("|");
    if (x !== y) return false;
  }
  return a.note.trim() === b.note.trim();
}

export type Totals = {
  itemCount: number;
  subtotalCents: number;
  packagingCents: number;
  deliveryCents: number;
  totalCents: number;
};

export function orderTotals(
  lines: { unitCents: number; quantity: number }[],
  extras: { packagingCents?: number; deliveryCents?: number } = {},
): Totals {
  const subtotalCents = lines.reduce((sum, l) => sum + lineTotal(l.unitCents, l.quantity), 0);
  const packagingCents = extras.packagingCents ?? 0;
  const deliveryCents = extras.deliveryCents ?? 0;
  return {
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotalCents,
    packagingCents,
    deliveryCents,
    totalCents: subtotalCents + packagingCents + deliveryCents,
  };
}

export const MAX_QUANTITY = 20;

export function clampQuantity(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(n)));
}

export function needsChoice(product: Pick<PricedProduct, "groups">) {
  return product.groups.some((g) => g.required && !g.defaultChoice && !g.showWhen);
}
