import "server-only";
import { getDb } from "@/lib/db";
import { NotFoundError, ValidationError } from "@/lib/api-errors";
import { ForbiddenError } from "@/lib/session";
import type { groupGiftSchema } from "@/lib/validation";
import type { z } from "zod";
import { Prisma } from "@prisma/client";

type GroupGiftInput = z.infer<typeof groupGiftSchema>;

export async function listGroupGiftsForUser(userId: string) {
  const db = getDb();
  const groupGifts = await db.groupGift.findMany({
    where: { createdById: userId },
    include: { contributors: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return groupGifts.map(decorate);
}

export async function getGroupGift(userId: string, groupGiftId: string) {
  const db = getDb();
  const gg = await db.groupGift.findUnique({
    where: { id: groupGiftId },
    include: { contributors: true, items: { include: { product: { include: { store: true } } } }, city: true },
  });
  if (!gg) throw new NotFoundError("This group gift could not be found.");
  if (gg.createdById !== userId) throw new ForbiddenError("You cannot view another user's group gift.");
  return decorate(gg);
}

/** Every product referenced must exist; validates server-side rather than trusting the client's price list. */
export async function createGroupGift(userId: string, input: GroupGiftInput) {
  const db = getDb();

  const products = await db.product.findMany({ where: { id: { in: input.productIds } } });
  if (products.length !== input.productIds.length) {
    throw new ValidationError("One or more selected gifts could not be found.");
  }

  const gg = await db.groupGift.create({
    data: {
      createdById: userId,
      title: `${input.recipientName}'s ${titleCase(input.occasionType)}`,
      occasionType: input.occasionType,
      recipientName: input.recipientName,
      cityId: input.cityId,
      deliveryDate: new Date(input.deliveryDate),
      goalAmount: new Prisma.Decimal(input.goalAmount),
      splitType: input.splitType,
      message: input.message || null,
      items: { create: input.productIds.map((productId) => ({ productId })) },
      contributors: {
        create: input.contributors.map((c, i) => ({
          name: c.name,
          amount: new Prisma.Decimal(c.amount),
          paid: i === 0, // the creator is recorded as having already contributed their share
        })),
      },
    },
    include: { contributors: true, items: { include: { product: true } } },
  });
  return decorate(gg);
}

export async function markContributorPaid(userId: string, groupGiftId: string, contributorId: string) {
  const db = getDb();
  const gg = await db.groupGift.findUnique({ where: { id: groupGiftId } });
  if (!gg) throw new NotFoundError("This group gift could not be found.");
  if (gg.createdById !== userId) throw new ForbiddenError("You cannot edit another user's group gift.");

  const contributor = await db.groupGiftContributor.findUnique({ where: { id: contributorId } });
  if (!contributor || contributor.groupGiftId !== groupGiftId) {
    throw new NotFoundError("This contributor could not be found.");
  }
  await db.groupGiftContributor.update({ where: { id: contributorId }, data: { paid: true } });
  return getGroupGift(userId, groupGiftId);
}

export async function deleteGroupGift(userId: string, groupGiftId: string) {
  const db = getDb();
  const gg = await db.groupGift.findUnique({ where: { id: groupGiftId } });
  if (!gg) throw new NotFoundError("This group gift could not be found.");
  if (gg.createdById !== userId) throw new ForbiddenError("You cannot delete another user's group gift.");

  await db.$transaction([
    db.groupGiftContributor.deleteMany({ where: { groupGiftId } }),
    db.groupGiftItem.deleteMany({ where: { groupGiftId } }),
    db.groupGift.delete({ where: { id: groupGiftId } }),
  ]);
}

function titleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

/** Adds the derived, always-computed-server-side fields the UI needs: never trust a stored "collected" total. */
function decorate<T extends { contributors: { amount: Prisma.Decimal; paid: boolean }[]; goalAmount: Prisma.Decimal }>(gg: T) {
  const collected = gg.contributors.filter((c) => c.paid).reduce((s, c) => s + Number(c.amount), 0);
  const goal = Number(gg.goalAmount);
  return {
    ...gg,
    collectedAmount: collected,
    percentFunded: goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0,
    isFullyFunded: collected >= goal,
  };
}
