import { ExpenseForm } from "@/components/partyFundComponents/ExpenseForm";

export default function AddExpense() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-semibold text-gray-400">Add Expense</h2>
                <p className="mt-1 text-sm text-gray-500">Create a new expense entry for the party.</p>
            </div>
            <ExpenseForm
             />
        </div>
    );
}