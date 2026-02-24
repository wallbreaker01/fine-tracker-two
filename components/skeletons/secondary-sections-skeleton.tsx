import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons/skeleton";

export function SecondarySectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="border-gray-600/60 bg-gray-800/70 py-4">
        <CardHeader className="px-4">
          <Skeleton className="h-6 w-36 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 bg-gray-700" />
                  <Skeleton className="h-3 w-20 bg-gray-700" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 bg-gray-700" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-600/60 bg-gray-800/70 py-4">
        <CardHeader className="px-4">
          <Skeleton className="h-6 w-36 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2 border-b border-gray-700 pb-3 last:border-0">
              <Skeleton className="h-3 w-24 bg-gray-700" />
              <Skeleton className="h-3 w-36 bg-gray-700" />
              <Skeleton className="h-3 w-20 bg-gray-700" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}