import { NextRequest, NextResponse } from "next/server";
import { updateCartItemQuantity, removeCartItem } from "@/lib/services/cart";
import { requireRole } from "@/lib/session";
import { updateCartItemSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { productId } = await params;
    const body = await req.json();
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const item = await updateCartItemQuantity(session.userId, productId, parsed.data.quantity);
    return NextResponse.json({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { productId } = await params;
    await removeCartItem(session.userId, productId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
