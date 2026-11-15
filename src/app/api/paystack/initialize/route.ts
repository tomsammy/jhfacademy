import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { status: false, message: "Paystack secret key is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { email, amountNaira, metadata, callbackUrl } = body ?? {};

    const cleanEmail =
      typeof email === "string" && email.trim().includes("@")
        ? email.trim()
        : `student.${Date.now()}@jhfacademy.com.ng`;

    const numericAmount = Number(amountNaira);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { status: false, message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const amountKobo = Math.round(numericAmount * 100);
    const reference = `JHF-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          amount: amountKobo,
          currency: "NGN",
          reference,
          callback_url: callbackUrl || undefined,
          metadata: metadata ?? {},
        }),
      }
    );

    const data = await paystackRes.json();

    if (!paystackRes.ok || !data.status) {
      return NextResponse.json(
        {
          status: false,
          message: data?.message || "Failed to initialize Paystack transaction.",
        },
        { status: paystackRes.status || 400 }
      );
    }

    return NextResponse.json({
      status: true,
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
        effectiveEmail: cleanEmail,
      },
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { status: false, message: "Server error initializing payment." },
      { status: 500 }
    );
  }
}
