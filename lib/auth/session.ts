import { cookies } from "next/headers";

export const AUTH_SESSION_COOKIE = "fineTrackerSession";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionCookie) as Partial<SessionUser>;
    if (
      typeof parsed.id === "number" &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function getSessionUserId(): Promise<number | null> {
  const user = await getSessionUser();
  return user?.id ?? null;
}
