import { getSessionUser } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getUserFineHistory } from "@/lib/database/fines";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export async function FineHistory() {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
        return (
            <div className="space-y-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        No user session found. Please log in.
                    </p>
                </div>
            </div>
        );
    }
    const fineHistory = await getUserFineHistory(sessionUser.id);
    if (!fineHistory) {
        return (
            <div className="space-y-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Failed to load fine history.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Fine History</CardTitle>
                </CardHeader>
                <CardContent>
                    {fineHistory.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                            <p className="text-lg font-medium text-foreground">No fines found</p>
                            {/* <p className="mt-1 text-sm text-muted-foreground">You have a clean record!</p> */}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fineHistory.map((fine) => (
                                        <TableRow key={fine.id}>
                                            <TableCell className="font-medium text-foreground">
                                                {fine.reason}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{fine.date}</TableCell>
                                            <TableCell className="font-semibold text-destructive">
                                                ৳{fine.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))} 
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}