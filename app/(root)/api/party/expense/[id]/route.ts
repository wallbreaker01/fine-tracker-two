// import { NextResponse } from "next/server";
// import { revalidatePath } from "next/cache";
// import { getSessionUser } from "@/lib/auth/session";
// import { getPartyExpenses } from "@/lib/database/party";

// type Params = {
//   id: string;
// };

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<Params> },
// ) {
//   try {
//     const { id } = await params;
//     const expenseId = Number(id);

//     if (!Number.isFinite(expenseId) || expenseId <= 0) {
//       return NextResponse.json(
//         { success: false, message: "Invalid expense ID" },
//         { status: 400 },
//       );
//     }

//     const expenses = await getPartyExpenses();
//     const expense = expenses.find((e) => e.id === expenseId);

//     if (!expense) {
//       return NextResponse.json(
//         { success: false, message: "Expense not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({ success: true, data: expense });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to load expense",
//         error: (error as Error).message,
//       },
//       { status: 500 },
//     );
//   }
// }