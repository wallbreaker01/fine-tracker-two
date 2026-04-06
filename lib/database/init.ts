import { ensureUsersTable } from "./data";

let initialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeDatabase() {
  // Skip during build time
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    return;
  }
  
  if (initialized) return;
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = (async () => {
    try {
      await ensureUsersTable();
      initialized = true;
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      initialized = false;
      throw error;
    }
  })();
  
  return initializationPromise;
}

