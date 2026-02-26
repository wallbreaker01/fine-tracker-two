import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { partyFundGoalAmount } from "@/lib/constants";
import { getPartySummaryStats } from "@/lib/database/data";

export async function PartyGoal() {
    const summary = await getPartySummaryStats();
    const savedAmount = summary.netBalance;
    const progressRatio = partyFundGoalAmount > 0 ? (savedAmount / partyFundGoalAmount) * 100 : 0;
    const progressPercent = Math.max(0, Math.min(100, progressRatio));

    return (
        <Card className="gap-4 py-5">
            <CardHeader className="px-5 pb-0">
                <CardTitle className="text-xl font-semibold">Goal Progression Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5">
                <div className="flex items-center justify-between text-base text-muted-foreground">
                    <p>৳{savedAmount.toLocaleString()} saved</p>
                    <p>৳{partyFundGoalAmount.toLocaleString()} goal</p>
                </div>

                <div className="h-2 w-full rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}