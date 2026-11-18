import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";

export function creditText(photo: Photo) {
  if (!photo.illustrative) return undefined;
  const who = photo.credit?.author ?? (photo.credit?.url.includes("unsplash") ? "Unsplash" : undefined);
  const license = photo.credit && photo.credit.license !== "Licença Unsplash" ? `, ${photo.credit.license}` : "";
  return who ? `Foto ilustrativa: ${who}${license}` : "Foto ilustrativa";
}

export function PhotoBadge({ photo, className }: { photo: Photo; className?: string }) {
  if (!photo.illustrative) return null;
  return (
    <span
      className={cn(
        "photo-credit pointer-events-none absolute z-10 rounded-full bg-night/70 px-2.5 py-1 font-medium text-white backdrop-blur-sm",
        className,
      )}
    >
      Foto ilustrativa
    </span>
  );
}

export function PhotoCredit({
  photo,
  className,
  tone = "light",
}: {
  photo: Photo;
  className?: string;
  tone?: "light" | "dark";
}) {
  const text = creditText(photo);
  if (!text) return null;
  return (
    <p className={cn("photo-credit", tone === "dark" ? "text-white/80" : "text-mocha", className)}>
      {photo.credit ? (
        <a
          href={photo.credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-7 items-center underline-offset-2 hover:underline"
        >
          {text}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      ) : (
        text
      )}
    </p>
  );
}
