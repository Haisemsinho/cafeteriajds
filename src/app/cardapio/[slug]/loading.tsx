import { Skeleton } from "@/components/ui/Feedback";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Carregando produto" className="page-x pt-8 pb-24">
      <Skeleton className="h-5 w-40" />
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4 md:pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
