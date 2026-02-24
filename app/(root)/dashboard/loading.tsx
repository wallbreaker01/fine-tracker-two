import { SecondarySectionsSkeleton } from "@/components/skeletons/secondary-sections-skeleton";
import { SummaryCardsSkeleton } from "@/components/skeletons/summary-cards-skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-8 w-40 animate-pulse rounded-md bg-gray-700" />
                <div className="h-4 w-72 animate-pulse rounded-md bg-gray-700" />
            </div>
            <SummaryCardsSkeleton />
            <SecondarySectionsSkeleton />
        </div>
    );
}