import { notFound } from "next/navigation";

import { FineForm } from "@/components/finesComponents/FineForm";
import { getFineById, getFineMembers } from "@/lib/database/fines";

type EditFinePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditFinePage({ params }: EditFinePageProps) {
  const { id } = await params;
  const fineId = Number(id);

  if (!Number.isFinite(fineId) || fineId <= 0) {
    notFound();
  }
  if (!fineId) notFound();

  const [members, fine] = await Promise.all([getFineMembers(), getFineById(fineId)]);

  if (!fine) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-gray-400">Edit Fine</h2>
        <p className="mt-1 text-sm text-gray-500">Update amount, reason, member, or date.</p>
      </div>

      <FineForm mode='edit'
        fineId={fine.id}
        members={members.map((member) => ({ id: member.id, name: member.name }))}
        initialValues={{
          userId: fine.user.id,
          reason: fine.reason,
          amount: fine.amount,
          date: fine.date,
        }}
      />
    </div>
  )
}