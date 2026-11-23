import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { importTranscript, slugify } from "../src/lib/menuImport.ts";
import { orderBlock } from "../src/lib/order/rules.ts";
import { menuCategorySchema, menuProductSchema } from "../src/lib/schemas.ts";

const raw = JSON.parse(
  readFileSync(new URL("../src/content/import/cardapio-transcrito-2026-11-23.json", import.meta.url), "utf8"),
);
const { categories, products } = importTranscript(raw);

test("importa os 46 produtos e as 7 categorias na ordem do cardápio", () => {
  assert.equal(products.length, 46);
  assert.deepEqual(
    categories.map((c) => c.name),
    ["Cafés", "Drinks Quentes", "Bebidas", "Sobremesas", "Bebidas Geladas", "Bolos", "Salgados"],
  );
});

test("nomes, preços e descrições iguais à transcrição", () => {
  for (const source of raw.products) {
    const p = products.find((x) => x.id === source.id);
    assert.ok(p, source.id);
    assert.equal(p.name, source.name);
    assert.equal(p.slug, source.slug);
    assert.equal(p.priceCents, source.priceCents);
    assert.equal(p.description, source.descriptionFromMenu ?? "");
    assert.equal(p.categoryId, slugify(source.category));
  }
});

test("nada vira oficial, unidade e disponibilidade ficam pendentes", () => {
  assert.ok(products.every((p) => p.dataStatus === "review"));
  assert.ok(products.every((p) => p.unitStatus === "pending" && p.units === undefined));
  assert.ok(products.every((p) => p.availability === "unconfirmed"));
  assert.ok(products.every((p) => !p.image && !p.illustration && !p.variants && !p.temperature && !p.ingredients));
});

test("opções só onde o cardápio informa", () => {
  const withOptions = products.filter((p) => p.options).map((p) => p.slug);
  assert.deepEqual(withOptions, ["expresso-com-borda", "suco", "soda-italiana", "vitamina"]);
  const borda = products.find((p) => p.slug === "expresso-com-borda")?.options?.[0];
  assert.equal(borda?.id, "borda");
  assert.deepEqual(
    borda?.choices.map((c) => c.label),
    ["doce de leite", "nutella"],
  );
  const suco = products.find((p) => p.slug === "suco")?.options?.[0];
  assert.deepEqual(
    suco?.choices.map((c) => c.label),
    ["Maracujá", "Morango", "Abacaxi com hortelã", "Detox"],
  );
  assert.equal(products.find((p) => p.slug === "milk-shake")?.options, undefined);
  assert.equal(products.find((p) => p.slug === "refrigerante-lata")?.options, undefined);
});

test("long neck bloqueado para compra pelo site", () => {
  const ln = products.find((p) => p.slug === "long-neck");
  assert.equal(ln?.ageRestricted, true);
  assert.equal(ln?.onlinePurchasable, false);
  assert.equal(orderBlock(ln!), "restricted");
  assert.equal(orderBlock(products.find((p) => p.slug === "suco")!), null);
});

test("pendências da transcrição preservadas", () => {
  const flagged = products.filter((p) => p.reviewFlags?.length).map((p) => p.slug);
  assert.deepEqual(flagged, [
    "refrigerante-lata",
    "long-neck",
    "taca-sensacao",
    "delicia-biscof",
    "milk-shake",
    "cativantt",
  ]);
});

test("passa na validação do site", () => {
  for (const c of categories) assert.ok(menuCategorySchema.safeParse(c).success, c.id);
  for (const p of products) {
    const r = menuProductSchema.safeParse(p);
    assert.ok(r.success, `${p.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`);
  }
});

test("transcrição inválida é recusada", () => {
  assert.throws(() => importTranscript({ ...raw, products: [{ ...raw.products[0], priceCents: -1 }] }), /inválida/);
  assert.throws(() => importTranscript({ ...raw, products: [{ ...raw.products[0], priceCents: 8.9 }] }), /inválida/);
});
