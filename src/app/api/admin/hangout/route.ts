import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  getStorageMode,
  listHangoutRegistrations,
  updateHangoutRegistration,
  type HangoutRegistrationStatus,
} from "@/lib/db";

const VALID_STATUSES: HangoutRegistrationStatus[] = [
  "pending_payment",
  "paid",
  "checked_in",
  "archived",
];

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const registrations = await listHangoutRegistrations();
    return NextResponse.json({
      registrations,
      storageMode: getStorageMode(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database query failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid registration ID." },
        { status: 400 }
      );
    }

    const patch: {
      status?: HangoutRegistrationStatus;
      isStarred?: boolean;
      adminNotes?: string;
    } = {};

    if (typeof body?.status === "string") {
      if (!VALID_STATUSES.includes(body.status as HangoutRegistrationStatus)) {
        return NextResponse.json(
          { error: "Invalid status value." },
          { status: 400 }
        );
      }
      patch.status = body.status as HangoutRegistrationStatus;
    }

    if (typeof body?.isStarred === "boolean") {
      patch.isStarred = body.isStarred;
    }

    if (typeof body?.adminNotes === "string") {
      patch.adminNotes = body.adminNotes.slice(0, 3000);
    }

    const updated = await updateHangoutRegistration(id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: "Hangout registration not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ registration: updated });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update Hangout registration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
