import { NextRequest, NextResponse } from "next/server";
import { getOwnedStore, updateStoreProfile } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { storeProfileSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireRole("STORE_OWNER");
    const store = await getOwnedStore(session.userId);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole("STORE_OWNER");
    const body = await req.json();
    const parsed = storeProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const store = await updateStoreProfile(session.userId, parsed.data);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}
