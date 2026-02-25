import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_SESSION_COOKIE = "fineTrackerSession";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type UserRole = "admin" | "user";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type SessionPayload = SessionUser & {
  exp: number;
};

const getSessionSecret = () => {
  const secret = process.env.AUTH_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET (or NEXTAUTH_SECRET) is required for signed sessions");
  }

  return secret;
};

const signValue = (rawValue: string) =>
  createHmac("sha256", getSessionSecret()).update(rawValue).digest("base64url");

export function createSessionCookieValue(
  user: SessionUser,
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
) {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

const parseSessionCookieValue = (sessionCookie: string): SessionUser | null => {
  const [encodedPayload, providedSignature] = sessionCookie.split(".");
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = signValue(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
  const parsed = JSON.parse(decoded) as Partial<SessionPayload>;
  const currentUnixTime = Math.floor(Date.now() / 1000);

  if (
    typeof parsed.id !== "number" ||
    typeof parsed.name !== "string" ||
    typeof parsed.email !== "string" ||
    typeof parsed.exp !== "number" ||
    parsed.exp <= currentUnixTime
  ) {
    return null;
  }

  return {
    id: parsed.id,
    name: parsed.name,
    email: parsed.email,
    role: parsed.role === "admin" ? "admin" : "user",
  };
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!sessionCookie) return null;

  try {
    return parseSessionCookieValue(sessionCookie);
  } catch {
    return null;
  }
}

export async function getSessionUserId(): Promise<number | null> {
  const user = await getSessionUser();
  return user?.id ?? null;
}
