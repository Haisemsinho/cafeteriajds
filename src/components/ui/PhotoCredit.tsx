import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";

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
