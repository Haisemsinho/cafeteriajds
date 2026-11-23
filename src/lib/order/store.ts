"use client";

import { useSyncExternalStore } from "react";
import type { UnitId } from "@/types/content";
import { clampQuantity, sameSelection, type Selection } from "./pricing";

type Kind = "local" | "session";

function createStore<T>(key: string, kind: Kind, fallback: T, parse: (data: unknown) => T) {
  const listeners = new Set<() => void>();
  let memory = fallback;
  let lastRaw: string | null | undefined;

  const storage = () => (kind === "local" ? window.localStorage : window.sessionStorage);

  const read = () => {
    let raw: string | null;
    try {
      raw = storage().getItem(key);
    } catch {
      return memory;
    }
    if (raw !== lastRaw) {
      lastRaw = raw;
      try {
        memory = raw ? parse(JSON.parse(raw)) : fallback;
      } catch {
        memory = fallback;
      }
    }
    return memory;
  };

  const write = (next: T) => {
    memory = next;
    try {
      lastRaw = JSON.stringify(next);
      storage().setItem(key, lastRaw);
    } catch {
      lastRaw = undefined;
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  };

  const use = () => useSyncExternalStore(subscribe, read, () => fallback);

  return { read, write, use };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const isUnit = (v: unknown): v is UnitId => v === "centro" || v === "br116";

function parseSelection(v: unknown): Selection {
  const out: Selection = { choices: {}, note: "" };
  if (!isObj(v)) return out;
  out.note = str(v.note, 140);
  if (isObj(v.choices)) {
    for (const [k, list] of Object.entries(v.choices)) {
      if (Array.isArray(list)) {
        (out.choices as Record<string, string[]>)[k] = list
          .filter((x): x is string => typeof x === "string")
          .slice(0, 8);
      }
    }
  }
  return out;
}

export type CartLine = { id: string; productId: string; quantity: number; selection: Selection };

function parseLines(v: unknown): CartLine[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(isObj)
    .map((l) => ({
      id: str(l.id, 40),
      productId: str(l.productId, 40),
      quantity: clampQuantity(Number(l.quantity)),
      selection: parseSelection(l.selection),
    }))
    .filter((l) => l.id && l.productId)
    .slice(0, 50);
}

const emptyLines: CartLine[] = [];
const cart = createStore<CartLine[]>("jds:carrinho", "local", emptyLines, parseLines);
const unit = createStore<UnitId | null>("jds:unidade", "local", null, (v) => (isUnit(v) ? v : null));

const newId = () => Math.random().toString(36).slice(2, 10);

export const useCart = cart.use;
export const useUnit = unit.use;

export function setUnit(id: UnitId) {
  unit.write(id);
}

export function addToCart(productId: string, selection: Selection, quantity: number) {
  const lines = cart.read();
  const same = lines.find((l) => l.productId === productId && sameSelection(l.selection, selection));
  if (same) {
    cart.write(lines.map((l) => (l === same ? { ...l, quantity: clampQuantity(l.quantity + quantity) } : l)));
    return same.id;
  }
  const id = newId();
  cart.write([...lines, { id, productId, selection, quantity: clampQuantity(quantity) }]);
  return id;
}

export function updateLine(id: string, patch: Partial<Pick<CartLine, "quantity" | "selection">>) {
  cart.write(
    cart
      .read()
      .map((l) => (l.id === id ? { ...l, ...patch, quantity: clampQuantity(patch.quantity ?? l.quantity) } : l)),
  );
}

export function removeLine(id: string) {
  const lines = cart.read();
  const removed = lines.find((l) => l.id === id);
  cart.write(lines.filter((l) => l.id !== id));
  return removed;
}

export function restoreLine(line: CartLine) {
  cart.write([...cart.read(), line]);
}

export function clearCart() {
  cart.write(emptyLines);
}

export function readCart() {
  return cart.read();
}

export type CheckoutDraft = {
  isGift: boolean | null;
  giftName: string;
  giftMessage: string;
  packaging: string;
  packagingNote: string;
  recipient: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  reference: string;
  deliveryNote: string;
  payment: "pix" | "cartao" | null;
};

export const emptyCheckout: CheckoutDraft = {
  isGift: null,
  giftName: "",
  giftMessage: "",
  packaging: "padrao",
  packagingNote: "",
  recipient: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "São João do Manhuaçu",
  state: "MG",
  reference: "",
  deliveryNote: "",
  payment: null,
};

const checkout = createStore<CheckoutDraft>("jds:finalizar", "session", emptyCheckout, (v) => {
  if (!isObj(v)) return emptyCheckout;
  const out = { ...emptyCheckout };
  for (const key of Object.keys(emptyCheckout) as (keyof CheckoutDraft)[]) {
    const value = v[key];
    if (key === "isGift") out.isGift = typeof value === "boolean" ? value : null;
    else if (key === "payment") out.payment = value === "pix" || value === "cartao" ? value : null;
    else if (typeof value === "string") (out[key] as string) = value.slice(0, 300);
  }
  return out;
});

export const useCheckout = checkout.use;

export function patchCheckout(patch: Partial<CheckoutDraft>) {
  checkout.write({ ...checkout.read(), ...patch });
}

export function resetCheckout() {
  checkout.write(emptyCheckout);
  try {
    window.sessionStorage.removeItem(SUGGESTION_KEY);
  } catch {}
}

const SUGGESTION_KEY = "jds:sugestao-vista";

export function readSuggestionSeen() {
  try {
    return window.sessionStorage.getItem(SUGGESTION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSuggestionSeen() {
  try {
    window.sessionStorage.setItem(SUGGESTION_KEY, "1");
  } catch {}
}

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  unitCents: number;
  details: string[];
  selection: Selection;
};

export type DemoOrder = {
  number: string;
  createdAt: string;
  unitId: UnitId;
  lines: OrderLine[];
  packaging: string;
  isGift: boolean;
  recipientFirstName: string;
  place: string;
  payment: "pix" | "cartao";
  subtotalCents: number;
  packagingCents: number;
  deliveryCents: number;
  totalCents: number;
  status: number;
};

const emptyOrders: DemoOrder[] = [];
const orders = createStore<DemoOrder[]>("jds:pedidos", "session", emptyOrders, (v) =>
  Array.isArray(v)
    ? (v.filter((o) => isObj(o) && typeof o.number === "string") as DemoOrder[]).slice(0, 30)
    : emptyOrders,
);

export const useOrders = orders.use;

export function saveOrder(order: DemoOrder) {
  orders.write([order, ...orders.read()]);
}

export function advanceOrder(number: string, max: number) {
  orders.write(orders.read().map((o) => (o.number === number ? { ...o, status: Math.min(max, o.status + 1) } : o)));
}

export function resetOrderStatus(number: string) {
  orders.write(orders.read().map((o) => (o.number === number ? { ...o, status: 0 } : o)));
}

export function newOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `DEMO-${n}`;
}
