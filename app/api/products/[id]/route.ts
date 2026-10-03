import { NextResponse } from "next/server";
import { getProductDetail } from "@/lib/services/catalogue";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductDetail(id);
    return NextResponse.json({ product });
  } catch (err) {
    return handleApiError(err);
  }
}
