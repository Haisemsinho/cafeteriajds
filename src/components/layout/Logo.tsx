import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";

export type Brand = { name: string; shortName: string; logo?: Photo };

export function Logo({ brand, className, large }: { brand: Brand; className?: string; large?: boolean }) {
  if (brand.logo) {
    return (
      <Image
        src={brand.logo.src}
        alt={brand.name}
        className={cn("w-auto", large ? "h-10" : "h-8", className)}
        sizes="12rem"
        loading="eager"
      />
    );
  }

  const rest = brand.name.startsWith(brand.shortName) ? brand.name.slice(brand.shortName.length).trim() : "";

  return (
    <span className={cn("inline-flex items-baseline gap-1.5 leading-none tracking-[-0.02em]", large ? "text-2xl" : "text-lg", className)}>
      <span className="font-extrabold">{brand.shortName}</span>
      {rest ? <span className="font-medium opacity-75">{rest}</span> : null}
      <span aria-hidden className="size-1.5 self-center rounded-full bg-caramel" />
    </span>
  );
}
