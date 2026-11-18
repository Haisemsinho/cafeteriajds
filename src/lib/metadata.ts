import type { Metadata } from "next";

type Input = { title?: string; description: string; path: string };

export function pageMetadata({ title, description, path }: Input): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | JDS Cafeteria` : "JDS Cafeteria",
      description,
      url: path,
    },
  };
}
