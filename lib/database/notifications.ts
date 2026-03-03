import { cache } from "react";
import { db, ensureUsersTable } from "@/lib/database/data";
import type { Notification } from "@/lib/types";
import { getSessionUser } from "@/lib/auth/session";
import { NotificationRow } from "@/lib/types";

const DEFAULT_NOTIFICATIONS_LIMIT = 50;
const MAX_NOTIFICATIONS_LIMIT = 200;



const globalForNotificationInfrastructure = globalThis as unknown as {
  __fineTrackerNotificationInfraReady?: Promise<void>;
};

const ensureNotificationInfrastructure = async () => {
  if (!globalForNotificationInfrastructure.__fineTrackerNotificationInfraReady) {
    globalForNotificationInfrastructure.__fineTrackerNotificationInfraReady = (async () => {
      await ensureUsersTable();

      await db.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id BIGSERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT false,
          type VARCHAR(50) NOT NULL DEFAULT 'system',
          related_id INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC)"
      );

      await db.query(
        "CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)"
      );
    })();
  }

  await globalForNotificationInfrastructure.__fineTrackerNotificationInfraReady;
};

export const getNotifications = cache(async (limit?: number) => {
  await ensureNotificationInfrastructure();

  const user = await getSessionUser();
  if (!user) {
    return [];
  }

  const queryLimit = Math.min(limit ?? DEFAULT_NOTIFICATIONS_LIMIT, MAX_NOTIFICATIONS_LIMIT);

  const result = await db.query<NotificationRow>(
    `SELECT id, title, description, is_read, created_at, type, related_id 
     FROM notifications 
     WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [user.id, queryLimit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    isRead: row.is_read,
    createdAt: row.created_at,
    type: row.type,
    relatedId: row.related_id ?? undefined,
  })) as Notification[];
});

export const createNotification = async (
  userId: number,
  title: string,
  description: string,
  type: 'fine' | 'expense' | 'system' = 'system',
  relatedId?: number
) => {
  await ensureNotificationInfrastructure();

  const result = await db.query<NotificationRow>(
    `INSERT INTO notifications (user_id, title, description, type, related_id, is_read)
     VALUES ($1, $2, $3, $4, $5, false)
     RETURNING id, title, description, is_read, created_at, type, related_id`,
    [userId, title, description, type, relatedId ?? null]
  );

  if (result.rows.length === 0) throw new Error("Failed to create notification");

  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    isRead: row.is_read,
    createdAt: row.created_at,
    type: row.type,
    relatedId: row.related_id ?? undefined,
  } as Notification;
};

export const markAsRead = async (notificationId: number) => {
  await ensureNotificationInfrastructure();

  await db.query(
    `UPDATE notifications SET is_read = true, updated_at = NOW() WHERE id = $1`,
    [notificationId]
  );
};

export const markAllAsRead = async () => {
  await ensureNotificationInfrastructure();

  const user = await getSessionUser();
  if (!user) {
    return;
  }

  await db.query(
    `UPDATE notifications SET is_read = true, updated_at = NOW() WHERE user_id = $1 AND is_read = false`,
    [user.id]
  );
};
