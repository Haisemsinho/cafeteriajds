export type Role = "bebida" | "cafe" | "bebida-quente" | "bebida-gelada" | "doce" | "sobremesa" | "bolo" | "salgado";

export type Status = "verified" | "draft" | "review";

export type Candidate = {
  id: string;
  name: string;
  categoryId: string;
  roles: Role[];
  unitIds: string[];
  order: number;
  featured?: boolean;
  status: Status;
  blocked: boolean;
  availabilityConfirmed: boolean;
  hasPrice: boolean;
};

export type CartItem = {
  productId: string;
  name: string;
  roles: Role[];
  temperature?: string;
};

export type RoleRule = {
  when: Role;
  suggest: Role;
  weight: number;
  weather?: "calor" | "frio";
};

export type ProductPair = {
  productId: string;
  pairedProductId: string;
  priority: number;
  unitId: string | null;
  active: boolean;
};

export type RecommendConfig = { rules: RoleRule[]; pairs: ProductPair[] };

export type RecommendContext = {
  unitId: string | null;
  statuses: Status[];
  requireConfirmedAvailability: boolean;
  weather?: "calor" | "frio" | null;
};

export type Suggestion = {
  productId: string;
  score: number;
  forProductId: string;
  forName: string;
  source: "casa" | "regra";
};

function effectiveRoles(item: CartItem): Role[] {
  const roles = new Set(item.roles);
  if (item.temperature === "gelado") {
    roles.delete("bebida-quente");
    roles.add("bebida-gelada");
  }
  if (item.temperature === "quente") {
    roles.delete("bebida-gelada");
    roles.add("bebida-quente");
  }
  return [...roles];
}

export function eligible(c: Candidate, ctx: RecommendContext) {
  if (c.blocked || !c.hasPrice) return false;
  if (!ctx.statuses.includes(c.status)) return false;
  if (ctx.requireConfirmedAvailability && !c.availabilityConfirmed) return false;
  if (ctx.unitId && !c.unitIds.includes(ctx.unitId)) return false;
  return true;
}

export function recommend(
  cart: CartItem[],
  candidates: Candidate[],
  config: RecommendConfig,
  ctx: RecommendContext,
  limit = 3,
): Suggestion[] {
  if (!cart.length) return [];
  const inCart = new Set(cart.map((i) => i.productId));
  const cartRoles = cart.map((i) => ({ item: i, roles: effectiveRoles(i) }));
  const covered = new Set(cartRoles.flatMap((c) => c.roles));
  const best = new Map<string, Suggestion>();

  const offer = (s: Suggestion) => {
    const current = best.get(s.productId);
    if (!current || s.score > current.score) best.set(s.productId, s);
  };

  for (const c of candidates) {
    if (inCart.has(c.id) || !eligible(c, ctx)) continue;

    for (const pair of config.pairs) {
      if (!pair.active || pair.pairedProductId !== c.id) continue;
      if (pair.unitId && pair.unitId !== ctx.unitId) continue;
      const trigger = cart.find((i) => i.productId === pair.productId);
      if (trigger) {
        offer({
          productId: c.id,
          score: 1000 + pair.priority,
          forProductId: trigger.productId,
          forName: trigger.name,
          source: "casa",
        });
      }
    }

    for (const rule of config.rules) {
      if (rule.weather && rule.weather !== ctx.weather) continue;
      if (!c.roles.includes(rule.suggest) || covered.has(rule.suggest)) continue;
      if (c.roles.includes("bebida") && covered.has("bebida")) continue;
      const trigger = cartRoles.find((cr) => cr.roles.includes(rule.when));
      if (trigger) {
        offer({
          productId: c.id,
          score: rule.weight,
          forProductId: trigger.item.productId,
          forName: trigger.item.name,
          source: "regra",
        });
      }
    }
  }

  const byId = new Map(candidates.map((c) => [c.id, c]));
  const ranked = [...best.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ca = byId.get(a.productId);
    const cb = byId.get(b.productId);
    const fa = ca?.featured ? 1 : 0;
    const fb = cb?.featured ? 1 : 0;
    if (fb !== fa) return fb - fa;
    return (ca?.order ?? 0) - (cb?.order ?? 0) || a.productId.localeCompare(b.productId);
  });
  return varied(ranked, byId, limit);
}

function varied(ranked: Suggestion[], byId: Map<string, Candidate>, limit: number) {
  const picked: Suggestion[] = [];
  const seen = new Set<string>();
  for (const s of ranked) {
    const cat = byId.get(s.productId)?.categoryId ?? "";
    if (picked.length < limit && (s.source === "casa" || !seen.has(cat))) {
      picked.push(s);
      seen.add(cat);
    }
  }
  for (const s of ranked) if (picked.length < limit && !picked.includes(s)) picked.push(s);
  return picked;
}
