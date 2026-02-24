import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeaderboardEntry } from "@/lib/database/types";

type LeaderboardCardProps = {
    data: LeaderboardEntry[];
    hasError?: boolean;
};

const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

export function LeaderboardCard({ data, hasError = false }: LeaderboardCardProps) {
    if (hasError) {
        return (
            <Card className="border-gray-600/60 bg-gray-800/70 py-4">
                <CardHeader className="px-4">
                    <CardTitle className="text-lg text-gray-400">Leaderboard</CardTitle>
                    <CardDescription>Unable to load leaderboard right now.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="border-gray-600/60 bg-gray-800/70 py-4">
                <CardHeader className="px-4">
                    <CardTitle className="text-lg text-gray-400">Leaderboard</CardTitle>
                    <CardDescription>No user fine records available yet.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-gray-600/60 bg-gray-800/70 py-4">
            <CardHeader className="px-4">
                <CardTitle className="text-lg text-white">Leaderboard</CardTitle>
                <CardDescription>Team ranking by total fines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
                {data.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-md border border-gray-700/80 bg-black px-3 py-2 transform transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-900/60 hover:shadow-md"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-gray-400">
                                {getInitials(entry.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">{entry.name}</p>
                                <p className="text-xs text-gray-500">Rank #{entry.rank}</p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-yellow-400">৳{entry.totalFine.toLocaleString()}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
