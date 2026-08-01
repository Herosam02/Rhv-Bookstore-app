import { classNames } from '../utils/format';

export function BookCardSkeleton() {
  return (
    <div className="w-36 sm:w-40 md:w-44 lg:w-48 rounded-2xl overflow-hidden bg-white/60 dark:bg-ink-900/40 backdrop-blur-sm border border-black/5 dark:border-white/5">
      <div className="w-full aspect-[2/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-4/5 rounded skeleton" />
        <div className="h-3 w-3/5 rounded skeleton" />
        <div className="h-3 w-2/5 rounded skeleton" />
        <div className="h-8 w-full rounded-lg skeleton" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={classNames('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ className }: { className?: string }) {
  return <div className={classNames('skeleton rounded', className)} />;
}
