import { Suspense } from "react";
import { SecondarySectionsSkeleton } from "@/components/skeletons/secondary-sections-skeleton";
import { SummaryCardsSkeleton } from "@/components/skeletons/summary-cards-skeleton";
import { DashboardDownSummary } from "@/components/dashboardComponents/DashboardDownSummary";
import { DashboardSummary } from "@/components/dashboardComponents/DashboardSummary";

const CURRENT_USER_ID = 1;


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-white">Track fines, rankings, and recent entries at a glance.</p>
      </div>

      <Suspense fallback={<SummaryCardsSkeleton />}>
        <DashboardSummary />
      </Suspense>

      <Suspense fallback={<SecondarySectionsSkeleton />}>
        <DashboardDownSummary />
      </Suspense>
    </div>
  );
}