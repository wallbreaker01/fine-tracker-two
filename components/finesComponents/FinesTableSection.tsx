import { FinesTable } from "@/components/finesComponents/FinesTable";
import { getFines } from "@/lib/database/fines";

export async function FinesTableSection() {
    const fines = await getFines();

    return <FinesTable fines={fines} />;
}
