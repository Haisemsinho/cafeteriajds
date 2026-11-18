import type { MetadataRoute } from "next";
import { footerNav } from "@/lib/navigation";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return footerNav.map((item) => ({
    url: `${siteUrl}${item.href === "/" ? "" : item.href}`,
    changeFrequency: item.href === "/cardapio" || item.href === "/produtos" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/cardapio" ? 0.9 : 0.7,
  }));
}
