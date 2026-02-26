import { PartyExpense } from "./PartyExpense";
import { PartyGoal } from "./PartyGoal";

export function PartyDownSummary() {
    return (
        <div className=" grid grid-cols-1 gap-4 xl:grid-cols-2">
            <PartyGoal />
            <PartyExpense />
        </div>
    )
}