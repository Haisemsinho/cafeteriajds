import assert from "node:assert/strict";
import { test } from "node:test";
import { reviewSchema } from "../src/lib/schemas.ts";
import { selectHomeReviews } from "../src/lib/reviews.ts";

const base = { isPublished: true, isFeatured: false, status: "verified" as const };
const list = [
  { ...base, id: "a", displayOrder: 3 },
  { ...base, id: "b", displayOrder: 1 },
  { ...base, id: "c", displayOrder: 2, isFeatured: true },
  { ...base, id: "d", displayOrder: 4, isPublished: false },
  { ...base, id: "e", displayOrder: 5, status: "draft" as const },
];

test("destaque primeiro, depois a ordem, sem ocultas", () => {
  assert.deepEqual(
    selectHomeReviews(list, false).map((r) => r.id),
    ["c", "b", "a"],
  );
});

test("exemplo só aparece na demonstração", () => {
  assert.deepEqual(
    selectHomeReviews(list, true).map((r) => r.id),
    ["c", "b", "a", "e"],
  );
});

test("sem destaque marcado, a primeira da ordem vira destaque", () => {
  const noFeatured = list.map((r) => ({ ...r, isFeatured: false }));
  assert.equal(selectHomeReviews(noFeatured, false)[0]?.id, "b");
});

test("limite de avaliações na home e lista vazia", () => {
  assert.equal(selectHomeReviews(list, true, 2).length, 2);
  assert.deepEqual(selectHomeReviews([], true), []);
});

const valid = {
  id: "x",
  customerName: "Ana",
  reviewText: "Muito bom, voltarei.",
  isFeatured: false,
  isPublished: true,
  displayOrder: 1,
  createdAt: "2026-11-19",
  updatedAt: "2026-11-19",
  status: "verified",
};

test("validação de campos da avaliação", () => {
  assert.ok(reviewSchema.safeParse(valid).success);
  assert.ok(!reviewSchema.safeParse({ ...valid, rating: 6 }).success, "nota acima de 5");
  assert.ok(!reviewSchema.safeParse({ ...valid, rating: 4.5 }).success, "nota quebrada");
  assert.ok(!reviewSchema.safeParse({ ...valid, reviewText: "curto" }).success, "texto curto demais");
  assert.ok(
    !reviewSchema.safeParse({ ...valid, source: { label: "Google", url: "http://x.com" } }).success,
    "fonte sem https",
  );
  assert.ok(!reviewSchema.safeParse({ ...valid, updatedAt: "2026-01-01" }).success, "atualização antes da criação");
  const photo = { src: { src: "/a.jpg", width: 10, height: 10 }, alt: "Foto da Ana" };
  assert.ok(!reviewSchema.safeParse({ ...valid, customerPhoto: photo }).success, "foto sem autorização");
  assert.ok(reviewSchema.safeParse({ ...valid, customerPhoto: { ...photo, authorized: true } }).success);
});
