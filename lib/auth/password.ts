import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const passwordHashBuffer = scryptSync(password, salt, KEY_LENGTH);
  const storedHashBuffer = Buffer.from(hash, "hex");

  if (passwordHashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(passwordHashBuffer, storedHashBuffer);
}
