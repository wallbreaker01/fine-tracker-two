import { getLeaderboard, getRecentActivity } from "@/lib/database/data";
import { LeaderboardCard } from "./dashboardComponents/leaderboard-card";
import { RecentActivityCard } from "./dashboardComponents/recent-activity-card";


export async function DashboardDownSummary() {
    const [leaderboardResult, activityResult] = await Promise.allSettled([
        getLeaderboard(),
        getRecentActivity(),
    ]);

    const leaderboard = leaderboardResult.status === "fulfilled" ? leaderboardResult.value : [];
    const activities = activityResult.status === "fulfilled" ? activityResult.value : [];

    const leaderboardError = leaderboardResult.status === "rejected";
    const activityError = activityResult.status === "rejected";

    return (
        <div className=" grid grid-cols-1 gap-4 xl:grid-cols-2">
            <LeaderboardCard data={leaderboard} hasError={leaderboardError} />
            <RecentActivityCard data={activities} hasError={activityError} />
        </div>
    )
}