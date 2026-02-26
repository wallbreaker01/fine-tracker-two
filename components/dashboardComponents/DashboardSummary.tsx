import { getSessionUserId } from "@/lib/auth/session";
import { getSummaryStats } from "@/lib/database/data";
import { SummaryCard } from '../summary-card';

export async function DashboardSummary() {

    try {
        const currentUserId = await getSessionUserId();
        const summary = await getSummaryStats(currentUserId);

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="My Fines"
                    value={`৳${summary.myFines.toLocaleString()}`}
                    subtitle="Your current total fines"
                />
                <SummaryCard
                    title="Total Collected Fines"
                    value={`৳${summary.totalCollectedFines.toLocaleString()}`}
                    subtitle="All user fines combined"
                />
                <SummaryCard
                    title="Top Fine Giver"
                    value={summary.topFineGiver?.name ?? "N/A"}
                    subtitle={
                        summary.topFineGiver
                            ? `৳${summary.topFineGiver.amount.toLocaleString()} in fines`
                            : "No fine records"
                    }
                />
                <SummaryCard
                    title="Total Party Fund"
                    value={`৳${summary.totalPartyFund.toLocaleString()}`}
                    subtitle="Collected minus spent"
                />
            </div>

        );

    } catch {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard title="My Fines" value="—" state="error" />
                <SummaryCard title="Total Collected Fines" value="—" state="error" />
                <SummaryCard title="Top Fine Giver" value="—" state="error" />
                <SummaryCard title="Total Party Fund" value="—" state="error" />
            </div>
        )
    }
}