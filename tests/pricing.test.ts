import assert from "node:assert/strict";
import { test } from "node:test";
import { maskCep, maskPhone, validateAddress, validateGift } from "../src/lib/order/checkout.ts";
import {
  clampQuantity,
  defaultSelection,
  describeSelection,
  lineTotal,
  needsChoice,
  orderTotals,
  sameSelection,
  unitPrice,
  validateSelection,
  type PricedProduct,
} from "../src/lib/order/pricing.ts";

const cafe: PricedProduct = {
  name: "Café",
  variants: [
    { id: "p", label: "Pequeno", priceCents: 1200 },
    { id: "g", label: "Grande", priceCents: 1500 },
  ],
  groups: [
    {
      id: "tamanho",
      label: "Tamanho",
      kind: "single",
      required: true,
      defaultChoice: "p",
      choices: [
        { id: "p", label: "Pequeno", priceCents: 1200 },
        { id: "g", label: "Grande", priceCents: 1500 },
      ],
    },
    {
      id: "temperatura",
      label: "Temperatura",
      kind: "single",
      required: true,
      choices: [
        { id: "quente", label: "Quente" },
        { id: "gelado", label: "Gelado" },
      ],
    },
    {
      id: "dose",
      label: "Dose",
      kind: "single",
      required: true,
      defaultChoice: "simples",
      choices: [
        { id: "simples", label: "Dose simples" },
        { id: "extra", label: "Dose extra", priceCents: 200 },
      ],
    },
    {
      id: "adocar",
      label: "Adoçamento",
      kind: "single",
      required: true,
      defaultChoice: "sem",
      choices: [
        { id: "sem", label: "Sem açúcar" },
        { id: "acucar", label: "Açúcar" },
      ],
    },
    {
      id: "docura",
      label: "Quanto adoçar",
      kind: "single",
      required: true,
      defaultChoice: "normal",
      showWhen: { group: "adocar", notIn: ["sem"] },
      choices: [{ id: "normal", label: "Normal" }],
    },
    {
      id: "adicionais",
      label: "Adicionais",
      kind: "multi",
      required: false,
      maxChoices: 2,
      choices: [
        { id: "a", label: "Chantilly", priceCents: 200 },
        { id: "b", label: "Canela" },
        { id: "c", label: "Caramelo", priceCents: 200 },
      ],
    },
  ],
};

test("exemplo do briefing: 12 + grande 3 + dose extra 2 = 17, vezes 2 = 34", () => {
  const sel = defaultSelection(cafe);
  sel.choices.tamanho = ["g"];
  sel.choices.dose = ["extra"];
  sel.choices.temperatura = ["quente"];
  const price = unitPrice(cafe, sel);
  assert.equal(price.unitCents, 1700);
  assert.equal(lineTotal(price.unitCents, 2), 3400);
});

test("adicionais somam e opção grátis não entra no detalhamento", () => {
  const sel = defaultSelection(cafe);
  sel.choices.adicionais = ["a", "b"];
  const price = unitPrice(cafe, sel);
  assert.equal(price.unitCents, 1400);
  assert.deepEqual(price.extras, [{ label: "Chantilly", cents: 200 }]);
});

test("obrigatório sem padrão gera erro e limite de adicionais é respeitado", () => {
  const sel = defaultSelection(cafe);
  assert.deepEqual(
    validateSelection(cafe, sel).map((e) => e.group),
    ["temperatura"],
  );
  sel.choices.temperatura = ["gelado"];
  sel.choices.adicionais = ["a", "b", "c"];
  assert.deepEqual(
    validateSelection(cafe, sel).map((e) => e.group),
    ["adicionais"],
  );
});

test("grupo condicional só aparece quando adoça", () => {
  const sel = defaultSelection(cafe);
  sel.choices.temperatura = ["quente"];
  assert.ok(!describeSelection(cafe, sel).includes("Normal"));
  sel.choices.adocar = ["acucar"];
  assert.ok(describeSelection(cafe, sel).includes("Normal"));
});

test("seleções iguais em ordem diferente são o mesmo item", () => {
  const a = { choices: { adicionais: ["a", "b"] }, note: "pouco gelo" };
  const b = { choices: { adicionais: ["b", "a"] }, note: "pouco gelo " };
  assert.ok(sameSelection(a, b));
  assert.ok(!sameSelection(a, { ...b, note: "sem canela" }));
});

test("totais do pedido e limites de quantidade", () => {
  const t = orderTotals(
    [
      { unitCents: 1700, quantity: 2 },
      { unitCents: 600, quantity: 1 },
    ],
    { packagingCents: 500, deliveryCents: 500 },
  );
  assert.deepEqual(t, { itemCount: 3, subtotalCents: 4000, packagingCents: 500, deliveryCents: 500, totalCents: 5000 });
  assert.equal(clampQuantity(0), 1);
  assert.equal(clampQuantity(99), 20);
  assert.equal(clampQuantity(Number.NaN), 1);
});

test("máscaras de telefone e CEP", () => {
  assert.equal(maskPhone("33999990000"), "(33) 99999-0000");
  assert.equal(maskPhone("3332221111"), "(33) 3222-1111");
  assert.equal(maskCep("36918000"), "36918-000");
});

test("validação de presente e endereço", () => {
  const gift = { isGift: null, giftName: "", giftMessage: "", packaging: "padrao", packagingNote: "" };
  assert.ok(validateGift(gift, ["padrao"]).isGift);
  assert.deepEqual(validateGift({ ...gift, isGift: false }, ["padrao"]), {});
  const addr = {
    recipient: "Ana",
    phone: "(33) 99999-0000",
    cep: "36918-000",
    street: "Rua A",
    number: "10",
    complement: "",
    district: "Centro",
    city: "Sao Joao do Manhuacu",
    state: "MG",
    reference: "",
    deliveryNote: "",
  };
  assert.deepEqual(validateAddress(addr, ["São João do Manhuaçu"]), {});
  assert.ok(validateAddress({ ...addr, city: "Manhuaçu" }, ["São João do Manhuaçu"]).city);
  assert.ok(validateAddress({ ...addr, phone: "123" }, ["São João do Manhuaçu"]).phone);
});

test("item que pede escolha antes de ir ao carrinho", () => {
  assert.equal(needsChoice(cafe), true);
  assert.equal(needsChoice({ groups: cafe.groups.filter((g) => g.id !== "temperatura") }), false);
});

test("sem tamanho gravado, vale o tamanho padrão e nunca preço zero", () => {
  const price = unitPrice(cafe, { choices: {}, note: "" });
  assert.equal(price.unitCents, 1200);
  assert.equal(price.known, true);
});
