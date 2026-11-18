import { cn } from "@/lib/cn";

export function Logo({ className, large }: { className?: string; large?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 leading-none tracking-[-0.02em]", large ? "text-2xl" : "text-lg", className)}>
      <span className="font-extrabold">JDS</span>
      <span className="font-medium opacity-80">Cafeteria</span>
    </span>
  );
}
