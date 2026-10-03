import { NextResponse } from "next/server";
import { getStoreDetail } from "@/lib/services/catalogue";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const store = await getStoreDetail(id);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}
