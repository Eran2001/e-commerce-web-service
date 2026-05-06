export function SkeletonCard() {
  return (
    <div className="group">
      <div className="aspect-square overflow-hidden rounded-lg bg-card skeleton-shimmer" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-card skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded bg-card skeleton-shimmer" />
        <div className="h-4 w-1/4 rounded bg-card skeleton-shimmer" />
      </div>
    </div>
  )
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
