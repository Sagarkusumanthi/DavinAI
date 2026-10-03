import "server-only";
import { getDb } from "@/lib/db";
import { NotFoundError } from "@/lib/api-errors";
import { ForbiddenError } from "@/lib/session";
import type { reminderSchema } from "@/lib/validation";
import type { z } from "zod";

type ReminderInput = z.infer<typeof reminderSchema>;

export async function listRemindersForCustomer(customerId: string) {
  const db = getDb();
  return db.reminder.findMany({
    where: { customerId },
    orderBy: { date: "asc" },
  });
}

export async function createReminder(customerId: string, input: ReminderInput) {
  const db = getDb();
  return db.reminder.create({
    data: {
      customerId,
      occasionName: input.occasionName,
      recipientName: input.recipientName,
      occasionType: input.occasionType,
      date: new Date(input.date),
      repeatYearly: input.repeatYearly ?? false,
      remindMe: input.remindMe,
      giftCategory: input.giftCategory || null,
      note: input.note || null,
    },
  });
}

export async function updateReminder(customerId: string, reminderId: string, input: ReminderInput) {
  const db = getDb();
  const existing = await db.reminder.findUnique({ where: { id: reminderId } });
  if (!existing) throw new NotFoundError("This reminder could not be found.");
  if (existing.customerId !== customerId) throw new ForbiddenError("You cannot edit another customer's reminder.");

  return db.reminder.update({
    where: { id: reminderId },
    data: {
      occasionName: input.occasionName,
      recipientName: input.recipientName,
      occasionType: input.occasionType,
      date: new Date(input.date),
      repeatYearly: input.repeatYearly ?? false,
      remindMe: input.remindMe,
      giftCategory: input.giftCategory || null,
      note: input.note || null,
    },
  });
}

export async function deleteReminder(customerId: string, reminderId: string) {
  const db = getDb();
  const existing = await db.reminder.findUnique({ where: { id: reminderId } });
  if (!existing) throw new NotFoundError("This reminder could not be found.");
  if (existing.customerId !== customerId) throw new ForbiddenError("You cannot delete another customer's reminder.");
  await db.reminder.delete({ where: { id: reminderId } });
}

export async function markReminderGiftPlanned(customerId: string, reminderId: string) {
  const db = getDb();
  const existing = await db.reminder.findUnique({ where: { id: reminderId } });
  if (!existing) throw new NotFoundError("This reminder could not be found.");
  if (existing.customerId !== customerId) throw new ForbiddenError("You cannot edit another customer's reminder.");
  return db.reminder.update({ where: { id: reminderId }, data: { giftPlanned: true } });
}
