import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { status: false, message: "Paystack secret key is not configured." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "Transaction reference is required." },
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

    if (!verifyRes.ok || !json.status || json.data?.status !== "success") {
      return NextResponse.json(
        {
          status: false,
          message:
            json?.data?.gateway_response ||
            json?.message ||
            "Transaction could not be verified as successful.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: true,
      data: {
        reference: json.data.reference,
        amountNaira: Number(json.data.amount) / 100,
        paidAt: json.data.paid_at,
        channel: json.data.channel || "card",
        currency: json.data.currency || "NGN",
        customerEmail: json.data.customer?.email || "",
        metadata: json.data.metadata || {},
      },
    });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { status: false, message: "Server error verifying payment." },
      { status: 500 }
    );
  }
}
