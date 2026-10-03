import { randomInt } from "crypto";

/** Generates a human-friendly order code like GF-48213. Uniqueness is enforced
 * by the database's unique constraint; callers should retry on collision. */
export function generateOrderCode(): string {
  const n = randomInt(10000, 99999);
  return `GF-${n}`;
}
