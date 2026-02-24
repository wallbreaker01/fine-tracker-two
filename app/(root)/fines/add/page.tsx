import { redirect } from "next/navigation";

import { FineForm } from "@/components/finesComponents/FineForm";
import { getFineMembers } from "@/lib/database/fines";

export default async function AddFinePage() {
  const members = await getFineMembers();

  return(
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-gray-400">Add Fine</h2>
        <p className="mt-1 text-sm text-gray-500">Create a new fine entry for a team member.</p>
      </div>

      <FineForm mode='add' 
        members={members.map((member) =>({id: member.id, name:member.name}))}
        initialValues={{
          userId: members[0].id,
          reason: "",
          amount: 0,
          date: new Date().toISOString().slice(0,10),
        }}
      /> 
    </div>
  ) 
}

//   if (!members.length) {
//     redirect("/fines?toast=Please%20create%20a%20member%20before%20adding%20fines&type=error");
//   }