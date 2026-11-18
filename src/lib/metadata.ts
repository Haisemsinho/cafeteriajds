import type { Metadata } from "next";
import { getBusiness } from "@/lib/content";

type Input = { title?: string; description: string; path: string };

export function pageMetadata({ title, description, path }: Input): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${getBusiness().name}` : getBusiness().name,
      description,
      url: path,
    },
  };
}
