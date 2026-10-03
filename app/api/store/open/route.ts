import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setOwnStoreOpen } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

const schema = z.object({ isOpen: z.boolean() });

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole("STORE_OWNER");
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const store = await setOwnStoreOpen(session.userId, parsed.data.isOpen);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}
