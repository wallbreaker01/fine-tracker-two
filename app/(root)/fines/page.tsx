import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FinesTableSection } from "@/components/finesComponents/FinesTableSection";
import { FinesTableSkeleton } from "@/components/skeletons/fines-table-skeleton";
// import { FinesToast } from "@/components/finesComponents/FinesToast";



type FinesPageProps = {
  searchParams: Promise<{
    toast?: string;
    type?: "success" | "error";
  }>;
};


export default async function finePage({ searchParams }: FinesPageProps) {
  return (
    <div className=" space-y-6 ">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Fines</h2>
          <p className="mt-1 text-sm text-gray-500">Manage all team fines</p>
        </div>
        <Button asChild>
          <Link href="/fines/add"><Plus className="size-4" />Add Fine</Link>
        </Button>
      </div>
      <Suspense fallback={<FinesTableSkeleton />}>
        <FinesTableSection />
      </Suspense>
      {/* <FinesToast message={params.toast} type={params.type ?? "success"} /> */}
    </div>
  )
}
