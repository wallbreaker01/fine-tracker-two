import { Skeleton } from "@/components/skeletons/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="gap-3 border-gray-600/60 bg-gray-800/70 py-4">
          <CardHeader className="px-4">
            <Skeleton className="h-3 w-24 bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <Skeleton className="h-8 w-28 bg-gray-700" />
            <Skeleton className="h-3 w-36 bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}