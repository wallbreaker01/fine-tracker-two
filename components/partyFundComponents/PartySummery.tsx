import { SummaryCard } from "@/components/summary-card";
import { getPartySummaryStats } from "@/lib/database/data";

export async function PartySummary() {
    try {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCard
                    title="Total Collected"
                    value={`৳${(await getPartySummaryStats()).totalCollected.toLocaleString()}`}
                    subtitle="All collected fines"
                />
                <SummaryCard
                    title="Total Spend"
                    value={`৳${(await getPartySummaryStats()).totalSpent.toLocaleString()}`}
                    subtitle="All party expenses"
                />
                <SummaryCard
                    title="Net Balance"
                    value={`৳${(await getPartySummaryStats()).netBalance.toLocaleString()}`}
                    subtitle="Collected minus spent"
                />
            </div>
        )
    } catch (error) {
        return(
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCard title="Total Collected" value="—" state="error" />
                <SummaryCard title="Total Spend" value="—" state="error" />
                <SummaryCard title="Net Balance" value="—" state="error" />
            </div>
        )
    }
}