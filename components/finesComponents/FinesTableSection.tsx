import { FinesTable } from "@/components/finesComponents/FinesTable";
import { getSessionUser } from "@/lib/auth/session";
import { getFines } from "@/lib/database/fines";

export async function FinesTableSection() {
    const [fines, sessionUser] = await Promise.all([getFines(100), getSessionUser()]);

    return <FinesTable fines={fines} canManageFines={sessionUser?.role === "admin"} />;
}
