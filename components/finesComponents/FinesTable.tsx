import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FineRowActions } from "@/components/finesComponents/FineRowActions";
import type { FineListItem } from "@/lib/database/fines";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type FinesTableProps = {
    fines: FineListItem[];
    canManageFines: boolean;
};


export function FinesTable({ fines, canManageFines }: FinesTableProps) {
    if (!fines.length) {
        return (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-lg font-medium text-foreground">No fines found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try changing the filters or add a new fine.
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead>Name</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        {canManageFines ? <TableHead className="text-right">Actions</TableHead> : null}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fines.map((fine) => (
                        <TableRow key={fine.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={fine.user.image ?? ""} alt={fine.user.name} />
                                        <AvatarFallback>{fine.user.initials}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-foreground">{fine.user.name}</span>
                                </div>
                            </TableCell>

                            <TableCell>{fine.reason}</TableCell>
                            <TableCell>{fine.date}</TableCell>
                            <TableCell>৳{fine.amount.toFixed(2)}</TableCell>
                            {canManageFines ? (
                                <TableCell>
                                    <FineRowActions fineId={fine.id} />
                                </TableCell>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
