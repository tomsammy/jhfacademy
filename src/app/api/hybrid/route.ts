import { NextRequest, NextResponse } from "next/server";
import { createHybridApplication } from "@/lib/db";

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

const VALID_TRAINING_LEVELS: Record<string, string> = {
  "Foundation – ₦150,000": "foundational",
  "Intermediate – ₦150,000": "intermediate",
  "Advanced – ₦200,000": "advanced",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName = cleanText(body?.fullName, 140);
    const phoneNumber = cleanText(body?.phoneNumber, 40);
    const whatsappNumber = cleanText(body?.whatsappNumber, 40);
    const emailAddress = cleanText(body?.emailAddress, 160);
    const residentialAddress = cleanText(body?.residentialAddress, 300);
    const occupation = cleanText(body?.occupation, 120);

    const trainingLevel = cleanText(body?.trainingLevel, 80);
    const programId = VALID_TRAINING_LEVELS[trainingLevel] || "";
    const experienceLevel = cleanText(body?.experienceLevel, 80);
    const whyHybrid = cleanText(body?.whyHybrid, 3000);
    const availableDays = cleanText(body?.availableDays, 300);

    const machineAccess = cleanText(body?.machineAccess, 160);
    const internetAccess = cleanText(body?.internetAccess, 40);

    const agreedConditions = body?.agreedConditions === true;
    const signatureName = cleanText(body?.signatureName, 140);
    const applicationDate = cleanText(body?.applicationDate, 40);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: "1. Please enter your Full Name." },
        { status: 400 }
      );
    }
    if (!phoneNumber || phoneNumber.length < 7) {
      return NextResponse.json(
        { error: "2. Please enter a valid Phone Number." },
        { status: 400 }
      );
    }
    if (!whatsappNumber || whatsappNumber.length < 7) {
      return NextResponse.json(
        { error: "3. Please enter a valid WhatsApp Number." },
        { status: 400 }
      );
    }
    if (!emailAddress || !emailAddress.includes("@")) {
      return NextResponse.json(
        { error: "4. Please enter a valid Email Address." },
        { status: 400 }
      );
    }
    if (!residentialAddress || residentialAddress.length < 4) {
      return NextResponse.json(
        { error: "5. Please enter your Residential Address." },
        { status: 400 }
      );
    }
    if (!occupation) {
      return NextResponse.json(
        { error: "6. Please select your Occupation." },
        { status: 400 }
      );
    }
    if (!programId) {
      return NextResponse.json(
        { error: "7. Please select the training level you are applying for." },
        { status: 400 }
      );
    }
    if (!experienceLevel) {
      return NextResponse.json(
        {
          error:
            "8. Please select your previous sewing or fashion design experience.",
        },
        { status: 400 }
      );
    }
    if (!whyHybrid || whyHybrid.length < 10) {
      return NextResponse.json(
        {
          error:
            "9. Please explain why you chose the hybrid training option (at least 10 characters).",
        },
        { status: 400 }
      );
    }
    if (!availableDays) {
      return NextResponse.json(
        {
          error:
            "10. Please select at least one weekday (Monday–Friday) you are available for physical sessions.",
        },
        { status: 400 }
      );
    }
    if (!machineAccess) {
      return NextResponse.json(
        {
          error:
            "11. Please indicate whether you have access to a functional sewing machine.",
        },
        { status: 400 }
      );
    }
    if (!internetAccess) {
      return NextResponse.json(
        {
          error:
            "12. Please indicate whether you have access to a smartphone or computer and reliable internet.",
        },
        { status: 400 }
      );
    }
    if (!agreedConditions) {
      return NextResponse.json(
        {
          error:
            "13. You must select 'Yes, I agree and am ready to commit.' to apply for the Hybrid Training Programme.",
        },
        { status: 400 }
      );
    }
    if (!signatureName || signatureName.length < 2) {
      return NextResponse.json(
        { error: "14. Please enter the Applicant's Full Name." },
        { status: 400 }
      );
    }
    if (!applicationDate) {
      return NextResponse.json(
        { error: "15. Please select today's Date." },
        { status: 400 }
      );
    }

    const created = await createHybridApplication({
      fullName,
      phoneNumber,
      whatsappNumber,
      emailAddress,
      residentialAddress,
      occupation,
      trainingLevel,
      programId,
      experienceLevel,
      whyHybrid,
      availableDays,
      machineAccess,
      internetAccess,
      agreedConditions,
      signatureName,
      applicationDate,
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: created.referenceCode,
        fullName: created.fullName,
        trainingLevel: created.trainingLevel,
        programId: created.programId,
        createdAt: created.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit your application right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
