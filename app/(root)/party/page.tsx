import { PartyDownSummary } from "@/components/partyFundComponents/PartyDownSummery";
import { PartySummary } from "@/components/partyFundComponents/PartySummery";
import { PartyFundSkeleton } from "@/components/skeletons/partyFundSkeleton";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";


export default function PartyFund() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Party Fund</h2>
          <p className="mt-1 text-sm text-gray-500">Manage the party fund and track contributions.</p>
        </div>
        <Button asChild>
          <Link href="/party/add"><Plus className="size-4" />Add Expense</Link>
        </Button>
      </div>

      <Suspense fallback={<PartyFundSkeleton />}>
        <PartySummary />
      </Suspense>

      <Suspense fallback={<PartyFundSkeleton />}>
        <PartyDownSummary />
      </Suspense>
    </div>

  )
}