import "server-only";
import { getDb } from "@/lib/db";
import { NotFoundError } from "@/lib/api-errors";
import { ForbiddenError } from "@/lib/session";
import type { z } from "zod";
import type { productFormSchema, storeProfileSchema } from "@/lib/validation";

export async function getOwnedStore(ownerUserId: string) {
  const db = getDb();
  const store = await db.store.findFirst({ where: { ownerUserId }, include: { category: true, city: true } });
  if (!store) throw new NotFoundError("No store found for this account.");
  return store;
}

async function assertOwnsStore(storeId: string, ownerUserId: string) {
  const db = getDb();
  const store = await db.store.findUnique({ where: { id: storeId } });
  if (!store) throw new NotFoundError("Store not found.");
  if (store.ownerUserId !== ownerUserId) throw new ForbiddenError("You do not own this store.");
  return store;
}

export async function listOwnProducts(ownerUserId: string) {
  const store = await getOwnedStore(ownerUserId);
  const db = getDb();
  return db.product.findMany({ where: { storeId: store.id }, include: { category: true }, orderBy: { createdAt: "desc" } });
}

export async function createProduct(ownerUserId: string, data: z.infer<typeof productFormSchema>) {
  const store = await getOwnedStore(ownerUserId);
  const db = getDb();
  return db.product.create({
    data: {
      storeId: store.id,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
    },
  });
}

export async function updateProduct(ownerUserId: string, productId: string, data: Partial<z.infer<typeof productFormSchema>>) {
  const db = getDb();
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError("Product not found.");
  await assertOwnsStore(product.storeId, ownerUserId);
  // Historical orders snapshot product name/price at order time, so editing here
  // never changes past orders - see OrderItem.productName / unitPrice snapshots.
  return db.product.update({
    where: { id: productId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
    },
  });
}

export async function archiveProduct(ownerUserId: string, productId: string) {
  const db = getDb();
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError("Product not found.");
  await assertOwnsStore(product.storeId, ownerUserId);
  return db.product.update({ where: { id: productId }, data: { isArchived: true, isAvailable: false } });
}

export async function updateStoreProfile(ownerUserId: string, data: z.infer<typeof storeProfileSchema>) {
  const store = await getOwnedStore(ownerUserId);
  const db = getDb();
  return db.store.update({
    where: { id: store.id },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      coverImage: data.coverImage,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
    },
  });
}

export async function getStoreDashboard(ownerUserId: string) {
  const store = await getOwnedStore(ownerUserId);
  const db = getDb();
  const [newOrders, activeOrders, deliveredOrders, recentOrders, deliveredAgg] = await Promise.all([
    db.order.count({ where: { storeId: store.id, status: "ORDER_PLACED" } }),
    db.order.count({
      where: {
        storeId: store.id,
        status: { in: ["STORE_ACCEPTED", "PREPARING_GIFT", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] },
      },
    }),
    db.order.count({ where: { storeId: store.id, status: "DELIVERED" } }),
    db.order.findMany({ where: { storeId: store.id }, orderBy: { placedAt: "desc" }, take: 5, include: { items: true } }),
    db.order.aggregate({ where: { storeId: store.id, status: "DELIVERED" }, _sum: { total: true } }),
  ]);
  return {
    store,
    newOrders,
    activeOrders,
    deliveredOrders,
    recentOrders,
    mockDeliveredValue: deliveredAgg._sum.total ?? 0,
  };
}
