import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPartyExpenses } from "@/lib/database/party";

export async function PartyExpense() {
    const expenses = await getPartyExpenses(10);

    return (
        <Card className="gap-4 py-5">
            <CardHeader className="px-5 pb-0">
                <CardTitle className="text-xl font-semibold">Expense Log</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-5">Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="px-5 text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length ? (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="px-5 text-base font-medium">{expense.description}</TableCell>
                                    <TableCell className="text-base text-muted-foreground">
                                        {new Date(expense.spentAt).toISOString().slice(0, 10)}
                                    </TableCell>
                                    <TableCell className="px-5 text-right text-base font-medium">৳{expense.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                                    No expenses have been added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )


}