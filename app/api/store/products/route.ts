import { NextRequest, NextResponse } from "next/server";
import { listOwnProducts, createProduct } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { productFormSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireRole("STORE_OWNER");
    const products = await listOwnProducts(session.userId);
    return NextResponse.json({ products });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole("STORE_OWNER");
    const body = await req.json();
    const parsed = productFormSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const product = await createProduct(session.userId, parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
