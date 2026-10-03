import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { productFormSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("STORE_OWNER");
    const { id } = await params;
    const body = await req.json();
    const parsed = productFormSchema.partial().safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const product = await updateProduct(session.userId, id, parsed.data);
    return NextResponse.json({ product });
  } catch (err) {
    return handleApiError(err);
  }
}
