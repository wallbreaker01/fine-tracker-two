import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentActivityEntry } from "@/lib/database/types";

type RecentActivityCardProps = {
    data: RecentActivityEntry[];
    hasError?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
});

export function RecentActivityCard({ data, hasError = false }: RecentActivityCardProps) {
    if (hasError) {
        return (
            <Card className="border-gray-600/60 bg-gray-800/70 py-4">
                <CardHeader className="px-4">
                    <CardTitle className="text-lg text-gray-400">Recent Activity</CardTitle>
                    <CardDescription>Unable to load recent activity right now.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="border-gray-600/60 bg-gray-800/70 py-4">
                <CardHeader className="px-4">
                    <CardTitle className="text-lg text-gray-400">Recent Activity</CardTitle>
                    <CardDescription>No fine activity has been added yet.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-gray-600/60 bg-gray-800/70 py-4">
            <CardHeader className="px-4">
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                <CardDescription>Latest fine entries from the team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
                {data.map((item) => (
                    <div key={item.id} className="rounded-md border border-gray-700/80 bg-black px-3 py-2 transform transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-900/60 hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-white">{item.userName}</p>
                            <p className="text-sm font-semibold text-red-500">৳{item.amount.toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.reason}</p>
                        <p className="mt-1 text-xs text-gray-500">{dateFormatter.format(new Date(item.createdAt))}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
