import { NextRequest, NextResponse } from "next/server";
import { markContributorPaid } from "@/lib/services/groupGifts";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string; contributorId: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { id, contributorId } = await params;
    const groupGift = await markContributorPaid(session.userId, id, contributorId);
    return NextResponse.json({ groupGift });
  } catch (err) {
    return handleApiError(err);
  }
}
