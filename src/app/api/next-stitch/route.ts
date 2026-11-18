import { NextRequest, NextResponse } from "next/server";
import { createNextStitchStory, type SubmissionType } from "@/lib/db";

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const submissionType: SubmissionType =
      body?.submissionType === "self" ? "self" : "nomination";
    const nomineeName = cleanText(body?.nomineeName, 120);
    const nomineeAge = cleanText(body?.nomineeAge, 30);
    const nomineeLocation = cleanText(body?.nomineeLocation, 180);
    const educationStage = cleanText(body?.educationStage, 120);
    const learningSetup = cleanText(body?.learningSetup, 200);
    const nomineePhone = cleanText(body?.nomineePhone, 40);
    const nominatorName =
      submissionType === "self"
        ? nomineeName
        : cleanText(body?.nominatorName, 120);
    const relationship =
      submissionType === "self"
        ? "Self-Application"
        : cleanText(body?.relationship, 80);
    const contactPhone = cleanText(body?.contactPhone, 40);
    const contactEmail = cleanText(body?.contactEmail, 140);
    const story = cleanText(body?.story, 6000);
    const additionalDetails = cleanText(body?.additionalDetails, 1500);

    if (!nomineeName || nomineeName.length < 2) {
      return NextResponse.json(
        { error: "Please enter the young girl's full name." },
        { status: 400 }
      );
    }
    if (!nomineeLocation || nomineeLocation.length < 3) {
      return NextResponse.json(
        { error: "Please tell us her town, area, and state." },
        { status: 400 }
      );
    }
    if (!educationStage) {
      return NextResponse.json(
        { error: "Please select her current schooling / training stage." },
        { status: 400 }
      );
    }
    if (submissionType === "nomination" && (!nominatorName || !relationship)) {
      return NextResponse.json(
        {
          error:
            "Please provide your name and your relationship to the nominee.",
        },
        { status: 400 }
      );
    }
    if (!contactPhone || contactPhone.length < 7) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid phone or WhatsApp number where our team can reach you.",
        },
        { status: 400 }
      );
    }
    if (!story || story.length < 30) {
      return NextResponse.json(
        {
          error:
            "Please share a bit more about her story and why she needs these machines (at least 30 characters).",
        },
        { status: 400 }
      );
    }

    const created = await createNextStitchStory({
      submissionType,
      nomineeName,
      nomineeAge,
      nomineeLocation,
      educationStage,
      learningSetup,
      nomineePhone,
      nominatorName,
      relationship,
      contactPhone,
      contactEmail,
      story,
      additionalDetails,
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: created.referenceCode,
        nomineeName: created.nomineeName,
        submissionType: created.submissionType,
        createdAt: created.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit your story right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
