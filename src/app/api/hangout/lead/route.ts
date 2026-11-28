import { NextRequest, NextResponse } from "next/server";
import { createHangoutProspectLead, type HangoutTicketType } from "@/lib/db";

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paystackReference = cleanText(body?.reference, 140);
    const fullName = cleanText(body?.fullName, 140);
    const phoneNumber = cleanText(body?.phoneNumber, 40);
    const whatsappNumber = cleanText(body?.whatsappNumber, 40) || phoneNumber;
    const emailAddress = cleanText(body?.emailAddress, 160);
    const city = cleanText(body?.city, 120) || "Ilorin";
    const fashionRole = cleanText(body?.fashionRole, 120) || "Fashion Designer";
    const questionNote = cleanText(body?.questionNote, 1000);
    const ticketType: HangoutTicketType =
      body?.ticketType === "online" ? "online" : "physical";
    const amountNaira = ticketType === "online" ? 5000 : 10000;

    if (!paystackReference || !fullName || !phoneNumber) {
      return NextResponse.json(
        { error: "Reference, name, and phone number are required." },
        { status: 400 }
      );
    }

    const lead = await createHangoutProspectLead({
      paystackReference,
      fullName,
      phoneNumber,
      whatsappNumber,
      emailAddress,
      city,
      fashionRole,
      questionNote,
      ticketType,
      amountNaira,
      channel: "checkout_started",
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to log Hangout prospect.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
