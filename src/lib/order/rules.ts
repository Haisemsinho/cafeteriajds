type Orderable = {
  availability: "available" | "unavailable" | "coming-soon" | "unconfirmed";
  onlinePurchasable?: boolean;
  ageRestricted?: boolean;
};

export type OrderBlock = "restricted" | "unavailable" | null;

export function orderBlock(product: Orderable): OrderBlock {
  if (product.ageRestricted || product.onlinePurchasable === false) return "restricted";
  if (product.availability === "available" || product.availability === "unconfirmed") return null;
  return "unavailable";
}
