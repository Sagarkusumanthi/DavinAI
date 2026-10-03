import "server-only";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { ValidationError } from "@/lib/api-errors";

/** identifier can be either an email address or a phone number. */
export async function authenticate(identifier: string, password: string) {
  const db = getDb();
  const trimmed = identifier.trim();
  const isEmail = trimmed.includes("@");
  const user = await db.user.findUnique({
    where: isEmail ? { email: trimmed.toLowerCase() } : { phone: trimmed },
  });
  if (!user) {
    throw new ValidationError("Incorrect email/phone or password.");
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new ValidationError("Incorrect email/phone or password.");
  }
  return user;
}
