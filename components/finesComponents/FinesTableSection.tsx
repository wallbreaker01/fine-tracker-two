import { FinesTable } from "@/components/finesComponents/FinesTable";
import { getFines } from "@/lib/database/fines";

export async function FinesTableSection() {
    const fines = await getFines(100);

    return <FinesTable fines={fines} />;
}
