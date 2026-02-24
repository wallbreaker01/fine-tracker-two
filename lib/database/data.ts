import { cache } from "react";
import { Pool } from "pg";
import type {
  LeaderboardEntry,
  RecentActivityEntry,
  SummaryStats,
} from "@/lib/database/types";

const withExplicitSslMode = (connectionString: string) => {
  try {
    const url = new URL(connectionString);
    url.searchParams.set("sslmode", "verify-full");
    return url.toString();
  } catch {
    const [base, query = ""] = connectionString.split("?");
    const params = new URLSearchParams(query);
    params.set("sslmode", "verify-full");
    const nextQuery = params.toString();
    return nextQuery ? `${base}?${nextQuery}` : base;
  }
};

const globalForDb = globalThis as unknown as {
  __fineTrackerDbPool?: Pool;
  __fineTrackerDbPoolInit?: Promise<Pool>;
  __fineTrackerUsersReady?: Promise<void>;
  __fineTrackerDashboardReady?: Promise<void>;
};

const getDbPool = async (): Promise<Pool> => {
  if (globalForDb.__fineTrackerDbPool) {
    return globalForDb.__fineTrackerDbPool;
  }

  if (!globalForDb.__fineTrackerDbPoolInit) {
    globalForDb.__fineTrackerDbPoolInit = Promise.resolve().then(() => {
      const connectDB = process.env.DATABASE_URL;

      if (!connectDB) {
        throw new Error("DATABASE_URL is missing in environment variables");
      }

      const connectionString = withExplicitSslMode(connectDB);
      const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      globalForDb.__fineTrackerDbPool = pool;

      return pool;
    });
  }

  return globalForDb.__fineTrackerDbPoolInit;
};

const query: Pool["query"] = ((...args: unknown[]) => {
  return getDbPool().then((pool) => {
    const poolQuery = pool.query as (...innerArgs: unknown[]) => unknown;
    return poolQuery(...args);
  });
}) as Pool["query"];

export const db: Pick<Pool, "query"> = {
  query,
};

export async function ensureUsersTable() {
  if (!globalForDb.__fineTrackerUsersReady) {
    globalForDb.__fineTrackerUsersReady = db
      .query(
        `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(120) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      )
      .then(() => undefined);
  }

  await globalForDb.__fineTrackerUsersReady;
}

type SumRow = {
  total: string | null;
};

type TopFineGiverRow = {
  name: string;
  total_fine: string;
};

type LeaderboardRow = {
  id: number | string;
  name: string;
  total_fine: string;
};

type RecentActivityRow = {
  id: number | string;
  user_id: number;
  user_name: string;
  amount: string;
  reason: string;
  created_at: string;
};

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const ensureDashboardTables = async () => {
  if (!globalForDb.__fineTrackerDashboardReady) {
    globalForDb.__fineTrackerDashboardReady = (async () => {
      await ensureUsersTable();

      await db.query(`
        CREATE TABLE IF NOT EXISTS fines (
          id BIGSERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
          reason TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS party_expenses (
          id BIGSERIAL PRIMARY KEY,
          amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
          note TEXT,
          spent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
      `);

      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_fines_user_id ON fines(user_id)",
      );
      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_fines_created_at ON fines(created_at DESC)",
      );
      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_party_expenses_spent_at ON party_expenses(spent_at DESC)",
      );
    })();
  }

  await globalForDb.__fineTrackerDashboardReady;
};

export const getSummaryStats = cache(
  async (currentUserId: number | null): Promise<SummaryStats> => {
    try {
      await ensureDashboardTables();

      const [myFineResult, totalFineResult, topFineResult, totalExpenseResult] =
        await Promise.all([
          currentUserId
            ? db.query<SumRow>(
                "SELECT COALESCE(SUM(amount), 0) AS total FROM fines WHERE user_id = $1",
                [currentUserId],
              )
            : Promise.resolve({ rows: [{ total: "0" }] }),
          db.query<SumRow>(
            "SELECT COALESCE(SUM(amount), 0) AS total FROM fines",
          ),
          db.query<TopFineGiverRow>(`
            SELECT u.name, COALESCE(SUM(f.amount), 0) AS total_fine
            FROM users u
            LEFT JOIN fines f ON f.user_id = u.id
            GROUP BY u.id, u.name
            ORDER BY total_fine DESC, u.name ASC
            LIMIT 1
          `),
          db.query<SumRow>(
            "SELECT COALESCE(SUM(amount), 0) AS total FROM party_expenses",
          ),
        ]);

      const myFines = toNumber(myFineResult.rows[0]?.total);
      const totalCollectedFines = toNumber(totalFineResult.rows[0]?.total);
      const totalExpenses = toNumber(totalExpenseResult.rows[0]?.total);
      const topFineGiverRow = topFineResult.rows[0];

      return {
        myFines,
        totalCollectedFines,
        topFineGiver: topFineGiverRow
          ? {
              name: topFineGiverRow.name,
              amount: toNumber(topFineGiverRow.total_fine),
            }
          : null,
        totalPartyFund: Math.max(totalCollectedFines - totalExpenses, 0),
      };
    } catch (error) {
      throw new Error(
        `Failed to load dashboard summary: ${(error as Error).message}`,
      );
    }
  },
);

export const getLeaderboard = cache(
  async (limit = 8): Promise<LeaderboardEntry[]> => {
    try {
      await ensureDashboardTables();

      const safeLimit = Number.isFinite(limit)
        ? Math.max(1, Math.min(Math.trunc(limit), 50))
        : 8;

      const result = await db.query<LeaderboardRow>(
        `
          SELECT
            u.id,
            u.name,
            COALESCE(SUM(f.amount), 0) AS total_fine
          FROM users u
          LEFT JOIN fines f ON f.user_id = u.id
          GROUP BY u.id, u.name
          ORDER BY total_fine DESC, u.name ASC
          LIMIT $1
        `,
        [safeLimit],
      );

      return result.rows.map((row: LeaderboardRow, index: number) => ({
        id: toNumber(row.id),
        name: row.name,
        avatar: null,
        totalFine: toNumber(row.total_fine),
        rank: index + 1,
      }));
    } catch (error) {
      throw new Error(
        `Failed to load leaderboard data: ${(error as Error).message}`,
      );
    }
  },
);

export const getRecentActivity = cache(
  async (limit = 6): Promise<RecentActivityEntry[]> => {
    try {
      await ensureDashboardTables();

      const safeLimit = Number.isFinite(limit)
        ? Math.max(1, Math.min(Math.trunc(limit), 50))
        : 6;

      const result = await db.query<RecentActivityRow>(
        `
          SELECT
            f.id,
            f.user_id,
            u.name AS user_name,
            f.amount,
            f.reason,
            f.created_at
          FROM fines f
          INNER JOIN users u ON u.id = f.user_id
          ORDER BY f.created_at DESC
          LIMIT $1
        `,
        [safeLimit],
      );

      return result.rows.map((row: RecentActivityRow) => ({
        id: toNumber(row.id),
        userId: row.user_id,
        userName: row.user_name,
        amount: toNumber(row.amount),
        reason: row.reason,
        createdAt: new Date(row.created_at).toISOString(),
      }));
    } catch (error) {
      throw new Error(
        `Failed to load recent activity: ${(error as Error).message}`,
      );
    }
  },
);
