import { NextRequest, NextResponse } from "next/server";
import { upsertHangoutRegistration, type HangoutTicketType } from "@/lib/db";

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const reference = cleanText(body?.reference, 120);
    if (!reference) {
      return NextResponse.json(
        { error: "Paystack transaction reference is required." },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const json = await verifyRes.json();
    if (!verifyRes.ok || !json?.status || json?.data?.status !== "success") {
      return NextResponse.json(
        {
          error:
            json?.data?.gateway_response ||
            json?.message ||
            "Transaction could not be verified as successful.",
        },
        { status: 400 }
      );
    }

    const amountNaira = Math.round(Number(json.data.amount || 0) / 100);
    const meta = (json.data.metadata || {}) as Record<string, unknown>;

    const rawTicketType = cleanText(
      meta.ticketType ?? body?.ticketType,
      20
    ).toLowerCase();
    const ticketType: HangoutTicketType =
      rawTicketType === "online" ? "online" : "physical";

    const expectedMinimum = ticketType === "online" ? 5000 : 10000;
    if (amountNaira < expectedMinimum) {
      return NextResponse.json(
        {
          error: `Verified payment amount (₦${amountNaira.toLocaleString(
            "en-NG"
          )}) does not match the selected ${ticketType} pass fee (₦${expectedMinimum.toLocaleString(
            "en-NG"
          )}).`,
        },
        { status: 400 }
      );
    }

    const fullName =
      cleanText(meta.fullName ?? body?.fullName, 140) || "JHF Hangout Guest";
    const phoneNumber =
      cleanText(meta.phoneNumber ?? body?.phoneNumber, 40) || "Not provided";
    const whatsappNumber =
      cleanText(meta.whatsappNumber ?? body?.whatsappNumber, 40) || phoneNumber;
    const customerEmail = cleanText(json.data.customer?.email, 160);
    const emailAddress =
      cleanText(meta.emailAddress ?? body?.emailAddress, 160) || customerEmail;
    const city = cleanText(meta.city ?? body?.city, 120) || "Ilorin";
    const fashionRole =
      cleanText(meta.fashionRole ?? body?.fashionRole, 120) ||
      "Fashion Designer";
    const questionNote = cleanText(meta.questionNote ?? body?.questionNote, 1000);

    const record = await upsertHangoutRegistration({
      paystackReference: cleanText(json.data.reference, 140) || reference,
      fullName,
      phoneNumber,
      whatsappNumber,
      emailAddress,
      city,
      fashionRole,
      questionNote,
      ticketType,
      amountNaira,
      channel: cleanText(json.data.channel, 40) || "paystack",
      paidAt: cleanText(json.data.paid_at, 60) || new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      registration: record,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to confirm Hangout registration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
