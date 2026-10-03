import { NextResponse } from "next/server";
import { archiveProduct } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("STORE_OWNER");
    const { id } = await params;
    const product = await archiveProduct(session.userId, id);
    return NextResponse.json({ product });
  } catch (err) {
    return handleApiError(err);
  }
}
