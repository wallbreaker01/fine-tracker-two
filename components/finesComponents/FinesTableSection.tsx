import { FinesTable } from "@/components/finesComponents/FinesTable";
import { getSessionUser } from "@/lib/auth/session";
import { getFines } from "@/lib/database/fines";

interface FinesTableSectionProps {
    search?: string;
}

export async function FinesTableSection({ search = "" }: FinesTableSectionProps) {
    const [fines, sessionUser] = await Promise.all([getFines(100), getSessionUser()]);

    // Filter fines based on search query
    const filteredFines = fines.filter((fine) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (
            fine.user.name.toLowerCase().includes(searchLower) ||
            fine.reason.toLowerCase().includes(searchLower)
        );
    });

    return <FinesTable fines={filteredFines} canManageFines={sessionUser?.role === "admin"} />;
}
