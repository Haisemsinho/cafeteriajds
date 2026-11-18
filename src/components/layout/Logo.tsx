import { cn } from "@/lib/cn";

export function Logo({ className, large }: { className?: string; large?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 leading-none tracking-[-0.02em]", large ? "text-2xl" : "text-lg", className)}>
      <span className="font-extrabold">JDS</span>
      <span className="font-medium opacity-75">Cafeteria</span>
      <span aria-hidden className="size-1.5 self-center rounded-full bg-caramel" />
    </span>
  );
}
