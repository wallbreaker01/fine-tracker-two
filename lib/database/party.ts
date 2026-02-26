import { db, ensureUsersTable } from "@/lib/database/data";
import type { ExpenseInput } from "@/lib/formValidation";
import { getSessionUser } from "@/lib/auth/session";

const DEFAULT_EXPENSES_LIMIT = 100;
const MAX_EXPENSES_LIMIT = 500;

export type PartyExpenseListItem = {
  id: number;
  description: string;
  amount: number;
  spentAt: string;
};

type PartyExpenseRow = {
  id: number | string;
  amount: string | number;
  note: string | null;
  spent_at: string;
};

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const globalForPartyInfrastructure = globalThis as unknown as {
  __fineTrackerPartyInfraReady?: Promise<void>;
};

const ensurePartyInfrastructure = async () => {
  if (!globalForPartyInfrastructure.__fineTrackerPartyInfraReady) {
    globalForPartyInfrastructure.__fineTrackerPartyInfraReady = (async () => {
      await ensureUsersTable();

      await db.query(`
        CREATE TABLE IF NOT EXISTS party_expenses (
          id BIGSERIAL PRIMARY KEY,
          amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
          note TEXT,
          spent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_party_expenses_spent_at ON party_expenses(spent_at DESC)",
      );
    })();
  }

  await globalForPartyInfrastructure.__fineTrackerPartyInfraReady;
};

const mapExpenseRow = (row: PartyExpenseRow): PartyExpenseListItem => ({
  id: toNumber(row.id),
  description: row.note ?? "",
  amount: toNumber(row.amount),
  spentAt: row.spent_at,
});

export async function getPartyExpenses(
  limit = DEFAULT_EXPENSES_LIMIT,
): Promise<PartyExpenseListItem[]> {
  await ensurePartyInfrastructure();

  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(Math.trunc(limit), MAX_EXPENSES_LIMIT))
    : DEFAULT_EXPENSES_LIMIT;

  const result = await db.query<PartyExpenseRow>(
    `
      SELECT
        id,
        amount,
        note,
        spent_at
      FROM party_expenses
      ORDER BY spent_at DESC, id DESC
      LIMIT $1
    `,
    [safeLimit],
  );

  return result.rows.map(mapExpenseRow);
}

export async function createPartyExpense(
  input: ExpenseInput,
): Promise<PartyExpenseListItem> {
  await ensurePartyInfrastructure();

  const sessionUser = await getSessionUser();

  const result = await db.query<PartyExpenseRow>(
    `
      INSERT INTO party_expenses (amount, note, spent_at, created_by)
      VALUES ($1, $2, NOW(), $3)
      RETURNING id, amount, note, spent_at
    `,
    [input.price, input.description, sessionUser?.id ?? null],
  );

  const created = result.rows[0];

  if (!created) {
    throw new Error("Failed to create expense");
  }

  return mapExpenseRow(created);
}
