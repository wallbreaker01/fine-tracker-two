import { cache } from "react";
import { db, ensureUsersTable } from "@/lib/database/data";
import type { FineInput } from "@/lib/formValidation";

export type FineMember = {
  id: number;
  name: string;
  image: string | null;
};

export type FineListItem = {
  id: number;
  amount: number;
  reason: string;
  date: string;
  user: FineMember & { initials: string };
};

type FineRow = {
  id: number | string;
  amount: string | number;
  reason: string;
  fine_date: string;
  user_id: number;
  user_name: string;
  user_image: string | null;
};

type MemberRow = {
  id: number;
  name: string;
  image_url: string | null;
};

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

const ensureFineInfrastructure = cache(async () => {
  await ensureUsersTable();

  await db.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS image_url TEXT
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS fines (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
      reason TEXT NOT NULL,
      fine_date DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    ALTER TABLE fines
    ADD COLUMN IF NOT EXISTS fine_date DATE NOT NULL DEFAULT CURRENT_DATE
  `);

  await db.query(`
    ALTER TABLE fines
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `);

  await db.query(`
    UPDATE fines
    SET fine_date = created_at::date
    WHERE fine_date IS NULL
  `);

  await db.query(
    "CREATE INDEX IF NOT EXISTS idx_fines_date_desc ON fines(fine_date DESC)",
  );
});

const mapFineRow = (row: FineRow): FineListItem => ({
  id: toNumber(row.id),
  amount: toNumber(row.amount),
  reason: row.reason,
  date: row.fine_date,
  user: {
    id: row.user_id,
    name: row.user_name,
    image: row.user_image,
    initials: buildInitials(row.user_name),
  },
});

export const getFineMembers = cache(async (): Promise<FineMember[]> => {
  await ensureFineInfrastructure();

  const result = await db.query<MemberRow>(`
    SELECT id, name, image_url
    FROM users
    ORDER BY name ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    image: row.image_url,
  }));
});
export async function getFines(): Promise<FineListItem[]> {
  await ensureFineInfrastructure();

  const result = await db.query<FineRow>(
    `
      SELECT
        f.id,
        f.amount,
        f.reason,
        TO_CHAR(f.fine_date, 'YYYY-MM-DD') AS fine_date,
        u.id AS user_id,
        u.name AS user_name,
        u.image_url AS user_image
      FROM fines f
      INNER JOIN users u ON u.id = f.user_id
      ORDER BY f.fine_date DESC, f.id DESC
    `,
  );

  return result.rows.map(mapFineRow);
}

export async function getFineById(id: number): Promise<FineListItem | null> {
  await ensureFineInfrastructure();

  const result = await db.query<FineRow>(
    `
      SELECT
        f.id,
        f.amount,
        f.reason,
        TO_CHAR(f.fine_date, 'YYYY-MM-DD') AS fine_date,
        u.id AS user_id,
        u.name AS user_name,
        u.image_url AS user_image
      FROM fines f
      INNER JOIN users u ON u.id = f.user_id
      WHERE f.id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapFineRow(row) : null;
}

export async function createFine(input: FineInput): Promise<FineListItem> {
  await ensureFineInfrastructure();

  const result = await db.query<FineRow>(
    `
      INSERT INTO fines (user_id, reason, amount, fine_date, updated_at)
      VALUES ($1, $2, $3, $4::date, NOW())
      RETURNING id, amount, reason, TO_CHAR(fine_date, 'YYYY-MM-DD') AS fine_date,
      user_id, '' AS user_name, NULL::text AS user_image
    `,
    [input.userId, input.reason, input.amount, input.date],
  );

  const created = result.rows[0];

  const userResult = await db.query<MemberRow>(
    `SELECT id, name, image_url FROM users WHERE id = $1 LIMIT 1`,
    [created.user_id],
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new Error("Selected member no longer exists");
  }

  return {
    id: toNumber(created.id),
    amount: toNumber(created.amount),
    reason: created.reason,
    date: created.fine_date,
    user: {
      id: user.id,
      name: user.name,
      image: user.image_url,
      initials: buildInitials(user.name),
    },
  };
}

export async function updateFine(
  id: number,
  input: FineInput,
): Promise<FineListItem | null> {
  await ensureFineInfrastructure();

  const result = await db.query(
    `
      UPDATE fines
      SET user_id = $2, reason = $3, amount = $4, fine_date = $5::date, updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [id, input.userId, input.reason, input.amount, input.date],
  );

  if (!result.rowCount) {
    return null;
  }

  return getFineById(id);
}

export async function deleteFine(id: number): Promise<boolean> {
  await ensureFineInfrastructure();

  const result = await db.query(`DELETE FROM fines WHERE id = $1`, [id]);
  return Boolean(result.rowCount);
}
