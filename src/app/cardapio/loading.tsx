import { Skeleton } from "@/components/ui/Feedback";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Carregando cardápio">
      <div className="border-b border-line bg-cream-soft">
        <div className="page-x py-12 sm:py-16">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-10 w-64" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg" />
        </div>
      </div>
      <div className="page-x grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-paper">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
