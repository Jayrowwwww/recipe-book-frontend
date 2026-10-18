import { cn } from "@/lib/cn";

// Placeholder block shown while data loads. aria-hidden because each
// loading region also announces itself with a role="status" message.
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse bg-paper-200", className)} />;
}

// Card-shaped skeleton so the grid keeps its layout while recipes load.
export function RecipeCardSkeleton() {
  return (
    <div className="border border-ink-900/10 bg-white shadow-sm">
      <Skeleton className="h-56" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
