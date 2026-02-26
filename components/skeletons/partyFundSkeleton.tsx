import { PartyFundCardSkeleton } from "./partyFundCardSkeleton";

export function PartyFundSkeleton() {
    return (
        <div className="space-y-4">

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg p-4 shadow bg-white/80 dark:bg-slate-800/60"
                    >
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-28 w-full rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-3 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}