import { FinesTableSkeleton } from "@/components/skeletons/fines-table-skeleton";

export default function FinesLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-8 w-28 animate-pulse rounded-md bg-gray-700" />
                <div className="h-4 w-48 animate-pulse rounded-md bg-gray-700" />
            </div>
            <div className="h-20 w-full animate-pulse rounded-lg border border-border bg-muted/30" />
            <FinesTableSkeleton />
        </div>
    );
}
