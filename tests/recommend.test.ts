import assert from "node:assert/strict";
import { test } from "node:test";
import { pairingRules } from "../src/content/pairings.ts";
import { recommend, type Candidate, type RecommendContext, type RoleRule } from "../src/lib/recommend/engine.ts";

const c = (id: string, roles: Candidate["roles"], extra: Partial<Candidate> = {}): Candidate => ({
  id,
  name: id,
  categoryId: roles[0] ?? "x",
  roles,
  unitIds: ["centro", "br116"],
  order: 1,
  status: "verified",
  blocked: false,
  availabilityConfirmed: true,
  hasPrice: true,
  ...extra,
});

const catalog: Candidate[] = [
  c("espresso", ["bebida", "cafe", "bebida-quente"]),
  c("cappuccino", ["bebida", "cafe", "bebida-quente"]),
  c("bolo", ["bolo", "doce"]),
  c("brownie", ["doce", "sobremesa"], { order: 2 }),
  c("pao-de-queijo", ["salgado"]),
  c("suco", ["bebida"]),
  c("cafe-gelado", ["bebida", "bebida-gelada"]),
  c("long-neck", ["bebida"], { blocked: true }),
];
const ctx: RecommendContext = { unitId: "centro", statuses: ["verified"], requireConfirmedAvailability: true };
const config = { rules: pairingRules, pairs: [] };
const item = (id: string, roles: Candidate["roles"], temperature?: string) => ({
  productId: id,
  name: id,
  roles,
  temperature,
});
const ids = (s: { productId: string }[]) => s.map((x) => x.productId);

test("café sugere bolo, depois doce, depois salgado", () => {
  assert.deepEqual(ids(recommend([item("cappuccino", ["bebida", "cafe", "bebida-quente"])], catalog, config, ctx)), [
    "bolo",
    "brownie",
    "pao-de-queijo",
  ]);
});

test("bolo sugere café", () => {
  assert.equal(recommend([item("bolo", ["bolo", "doce"])], catalog, config, ctx)[0]?.productId, "cappuccino");
});

test("salgado sugere bebida", () => {
  const r = ids(recommend([item("pao-de-queijo", ["salgado"])], catalog, config, ctx));
  assert.ok(["espresso", "cappuccino"].includes(r[0]!));
});

test("bebida gelada sugere sobremesa", () => {
  assert.equal(
    recommend([item("cafe-gelado", ["bebida", "bebida-gelada"])], catalog, config, ctx)[0]?.productId,
    "brownie",
  );
});

test("escolha gelado no carrinho vira bebida gelada", () => {
  assert.equal(
    recommend([item("mocha", ["bebida", "bebida-quente"], "gelado")], catalog, config, ctx)[0]?.productId,
    "brownie",
  );
});

test("não repete o que já está no carrinho nem um papel já coberto", () => {
  const r = ids(
    recommend(
      [item("cappuccino", ["bebida", "cafe", "bebida-quente"]), item("bolo", ["bolo", "doce"])],
      catalog,
      config,
      ctx,
    ),
  );
  assert.ok(!r.includes("cappuccino") && !r.includes("bolo") && !r.includes("brownie"));
  assert.deepEqual(r, ["pao-de-queijo"]);
});

test("carrinho com bebida e salgado não pede outra bebida", () => {
  const r = ids(recommend([item("suco", ["bebida"]), item("pao-de-queijo", ["salgado"])], catalog, config, ctx));
  assert.ok(!r.some((id) => ["espresso", "cappuccino", "suco", "cafe-gelado"].includes(id)));
});

test("nunca sugere bloqueado, sem preço, de outra unidade, status não permitido ou disponibilidade incerta", () => {
  const only = (x: Candidate) => recommend([item("pao-de-queijo", ["salgado"])], [x], config, ctx);
  assert.equal(only(c("a", ["bebida"], { blocked: true })).length, 0);
  assert.equal(only(c("a", ["bebida"], { hasPrice: false })).length, 0);
  assert.equal(only(c("a", ["bebida"], { unitIds: ["br116"] })).length, 0);
  assert.equal(only(c("a", ["bebida"], { status: "draft" })).length, 0);
  assert.equal(only(c("a", ["bebida"], { availabilityConfirmed: false })).length, 0);
  assert.equal(only(c("a", ["bebida"])).length, 1);
});

test("demonstração aceita exemplo e disponibilidade a confirmar", () => {
  const demo: RecommendContext = {
    unitId: null,
    statuses: ["verified", "draft", "review"],
    requireConfirmedAvailability: false,
  };
  const r = recommend(
    [item("pao-de-queijo", ["salgado"])],
    [c("a", ["bebida"], { status: "review", availabilityConfirmed: false })],
    config,
    demo,
  );
  assert.equal(r.length, 1);
});

test("par escolhido pela casa vem primeiro e respeita unidade e ativo", () => {
  const pairs = [
    { productId: "cappuccino", pairedProductId: "pao-de-queijo", priority: 5, unitId: null, active: true },
  ];
  const r = recommend(
    [item("cappuccino", ["bebida", "cafe", "bebida-quente"])],
    catalog,
    { rules: pairingRules, pairs },
    ctx,
  );
  assert.equal(r[0]?.productId, "pao-de-queijo");
  assert.equal(r[0]?.source, "casa");
  const other = recommend(
    [item("cappuccino", ["bebida", "cafe", "bebida-quente"])],
    catalog,
    { rules: pairingRules, pairs: [{ ...pairs[0]!, unitId: "br116" }] },
    ctx,
  );
  assert.equal(other[0]?.productId, "bolo");
  const off = recommend(
    [item("cappuccino", ["bebida", "cafe", "bebida-quente"])],
    catalog,
    { rules: pairingRules, pairs: [{ ...pairs[0]!, active: false }] },
    ctx,
  );
  assert.equal(off[0]?.productId, "bolo");
});

test("regra de clima só vale com dado de clima", () => {
  const rules: RoleRule[] = [{ when: "cafe", suggest: "sobremesa", weight: 99, weather: "calor" }];
  const cart = [item("espresso", ["bebida", "cafe", "bebida-quente"])];
  assert.equal(recommend(cart, catalog, { rules, pairs: [] }, ctx).length, 0);
  assert.equal(recommend(cart, catalog, { rules, pairs: [] }, { ...ctx, weather: "calor" })[0]?.productId, "brownie");
});

test("carrinho vazio ou sem combinação não sugere nada", () => {
  assert.deepEqual(recommend([], catalog, config, ctx), []);
  assert.deepEqual(recommend([item("x", [])], catalog, config, ctx), []);
});

test("sugestões variam de categoria antes de repetir", () => {
  const many = [
    ...catalog,
    c("bolo-2", ["bolo", "doce"], { categoryId: "bolo" }),
    c("bolo-3", ["bolo", "doce"], { categoryId: "bolo" }),
  ];
  const r = recommend([item("cappuccino", ["bebida", "cafe", "bebida-quente"])], many, config, ctx);
  assert.deepEqual(
    r.map((x) => x.productId),
    ["bolo", "brownie", "pao-de-queijo"],
  );
});
