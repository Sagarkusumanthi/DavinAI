import { NextResponse } from "next/server";
import { getOrderForAdmin } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    const order = await getOrderForAdmin(id);
    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
