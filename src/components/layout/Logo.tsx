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

  const rest = brand.name.startsWith(brand.shortName)
    ? brand.name.slice(brand.shortName.length).trim()
    : brand.name.endsWith(brand.shortName)
      ? brand.name.slice(0, -brand.shortName.length).trim()
      : "";

  return (
    <span className={cn("inline-flex items-baseline gap-2 leading-none", className)}>
      <span className={cn("font-display tracking-[-0.01em]", large ? "text-[2.5rem]" : "text-[2rem]")}>
        {brand.shortName}
      </span>
      {rest ? (
        <span
          className={cn("font-semibold tracking-[0.24em] uppercase opacity-80", large ? "text-xs" : "text-[0.6875rem]")}
        >
          {rest}
        </span>
      ) : null}
    </span>
  );
}
