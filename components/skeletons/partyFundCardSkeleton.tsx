export function PartyFundCardSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-lg p-4 shadow bg-white/80 dark:bg-slate-800/60"
                >
                    <div className="animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/5 mb-4" />
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
                    </div>
                </div>
            ))}
        </div>
    )
}