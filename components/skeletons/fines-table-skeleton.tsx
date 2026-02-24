import { Skeleton } from "@/components/skeletons/skeleton";

export function FinesTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <div className="border-b border-border px-4 py-3">
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
                    <Skeleton className="h-4 w-20 bg-gray-700" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                    <Skeleton className="hidden h-4 w-24 bg-gray-700 sm:block" />
                    <Skeleton className="hidden h-4 w-24 bg-gray-700 sm:block" />
                    <Skeleton className="hidden h-4 w-20 bg-gray-700 sm:block" />
                    <Skeleton className="h-4 w-12 justify-self-end bg-gray-700" />
                </div>
            </div>

            <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="px-4 py-4">
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 sm:items-center">
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                            <Skeleton className="h-4 w-14 bg-gray-700" />
                            <Skeleton className="hidden h-4 w-28 bg-gray-700 sm:block" />
                            <Skeleton className="hidden h-4 w-24 bg-gray-700 sm:block" />
                            <Skeleton className="hidden h-6 w-16 rounded-full bg-gray-700 sm:block" />
                            <Skeleton className="h-8 w-8 justify-self-end rounded-md bg-gray-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
