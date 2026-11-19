type Selectable = { isPublished: boolean; isFeatured: boolean; displayOrder: number; status: "verified" | "draft" };

export function selectHomeReviews<T extends Selectable>(all: T[], showDrafts: boolean, limit = 6): T[] {
  const shown = all
    .filter((r) => r.isPublished && (r.status === "verified" || showDrafts))
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const featured = shown.find((r) => r.isFeatured) ?? shown[0];
  if (!featured) return [];
  return [featured, ...shown.filter((r) => r !== featured)].slice(0, limit);
}
