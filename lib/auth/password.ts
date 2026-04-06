import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const KEY_LENGTH = 64;
const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) return false;

  const passwordHashBuffer = await scryptAsync(password, salt, KEY_LENGTH);
  const storedHashBuffer = Buffer.from(hash, "hex");

  if (passwordHashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(passwordHashBuffer, storedHashBuffer);
}