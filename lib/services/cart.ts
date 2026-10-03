import "server-only";
import { getDb } from "@/lib/db";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/api-errors";
import { Prisma } from "@prisma/client";

const CART_INCLUDE = {
  product: { include: { store: true } },
} satisfies Prisma.CartItemInclude;

type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: typeof CART_INCLUDE }>;

export async function getCart(customerId: string) {
  const db = getDb();
  const items = await db.cartItem.findMany({
    where: { customerId },
    include: CART_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  const storeId = items[0]?.product.storeId ?? null;
  const subtotal = items.reduce(
    (sum: Prisma.Decimal, it: CartItemWithProduct) => sum.add(it.product.price.mul(it.quantity)),
    new Prisma.Decimal(0)
  );
  return { items, storeId, subtotal };
}

/**
 * Adds a product to the customer's cart. Enforces the single-store-per-cart
 * rule: if the cart already has items from a different store, this throws a
 * ConflictError rather than silently mixing stores into one order - the
 * caller (UI) should prompt the user to clear the cart first.
 */
export async function addToCart(customerId: string, productId: string, quantity: number) {
  const db = getDb();
  const product = await db.product.findUnique({ where: { id: productId }, include: { store: true } });
  if (!product) throw new NotFoundError("This product could not be found.");
  if (product.isArchived || !product.isAvailable) {
    throw new ValidationError("This product is no longer available.");
  }

  const existingItemsInclude = { product: true } satisfies Prisma.CartItemInclude;
  type ExistingCartItem = Prisma.CartItemGetPayload<{ include: typeof existingItemsInclude }>;
  const existingItems = await db.cartItem.findMany({ where: { customerId }, include: existingItemsInclude });
  const currentStoreId = existingItems[0]?.product.storeId;
  if (currentStoreId && currentStoreId !== product.storeId) {
    throw new ConflictError(
      "Your cart has items from a different store. Clear your cart before adding items from another store."
    );
  }

  const existing = existingItems.find((it: ExistingCartItem) => it.productId === productId);
  const newQuantity = Math.min(10, (existing?.quantity ?? 0) + quantity);

  return db.cartItem.upsert({
    where: { customerId_productId: { customerId, productId } },
    update: { quantity: newQuantity },
    create: { customerId, productId, quantity: Math.min(10, quantity) },
    include: CART_INCLUDE,
  });
}

export async function updateCartItemQuantity(customerId: string, productId: string, quantity: number) {
  const db = getDb();
  const item = await db.cartItem.findUnique({ where: { customerId_productId: { customerId, productId } } });
  if (!item) throw new NotFoundError("This item is not in your cart.");

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: item.id } });
    return null;
  }
  return db.cartItem.update({
    where: { id: item.id },
    data: { quantity: Math.min(10, quantity) },
    include: CART_INCLUDE,
  });
}

export async function removeCartItem(customerId: string, productId: string) {
  const db = getDb();
  await db.cartItem.deleteMany({ where: { customerId, productId } });
}

export async function clearCart(customerId: string) {
  const db = getDb();
  await db.cartItem.deleteMany({ where: { customerId } });
}
