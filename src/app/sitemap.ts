import type { MetadataRoute } from "next";
import { getMenu } from "@/lib/content";
import { footerNav } from "@/lib/navigation";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = footerNav.map((item) => ({
    url: `${siteUrl}${item.href === "/" ? "" : item.href}`,
    changeFrequency: item.href === "/cardapio" || item.href === "/produtos" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/cardapio" ? 0.9 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = getMenu().products.map((p) => ({
    url: `${siteUrl}/cardapio/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...pages, ...products];
}
