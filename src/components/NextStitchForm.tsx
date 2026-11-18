"use client";

import React, { useState } from "react";
import {
  Heart,
  CheckCircle2,
  Send,
  Sparkles,
  UserCheck,
  Users,
  Phone,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";

type SubmissionMode = "nomination" | "self";

interface SubmittedConfirmation {
  referenceCode: string;
  nomineeName: string;
  submissionType: SubmissionMode;
  createdAt: string;
}

const EDUCATION_STAGES = [
  "Finished secondary school & learning tailoring",
  "Still in secondary school & learning tailoring",
  "Learning under a roadside tailor / small shop",
  "Other tailoring apprentice / trainee",
];

const RELATIONSHIPS = [
  "Master Tailor / Trainer",
  "Parent / Guardian",
  "Sister / Brother / Relative",
  "Friend / Neighbour",
  "Teacher / Community Leader",
  "Other",
];

export function NextStitchForm() {
  const [submissionType, setSubmissionType] =
    useState<SubmissionMode>("nomination");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeAge, setNomineeAge] = useState("");
  const [nomineeLocation, setNomineeLocation] = useState("");
  const [educationStage, setEducationStage] = useState(EDUCATION_STAGES[0]);
  const [learningSetup, setLearningSetup] = useState("");
  const [nomineePhone, setNomineePhone] = useState("");

  const [nominatorName, setNominatorName] = useState("");
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [story, setStory] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [truthConfirmed, setTruthConfirmed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedConfirmation | null>(
    null
  );

  const resetForm = () => {
    setNomineeName("");
    setNomineeAge("");
    setNomineeLocation("");
    setEducationStage(EDUCATION_STAGES[0]);
    setLearningSetup("");
    setNomineePhone("");
    setNominatorName("");
    setRelationship(RELATIONSHIPS[0]);
    setContactPhone("");
    setContactEmail("");
    setStory("");
    setAdditionalDetails("");
    setTruthConfirmed(false);
    setError(null);
    setSubmitted(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!truthConfirmed) {
      setError(
        "Please confirm that the story and details shared are true to the best of your knowledge."
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/next-stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType,
          nomineeName,
          nomineeAge,
          nomineeLocation,
          educationStage,
          learningSetup,
          nomineePhone,
          nominatorName:
            submissionType === "self" ? nomineeName : nominatorName,
          relationship:
            submissionType === "self" ? "Self-Application" : relationship,
          contactPhone,
          contactEmail,
          story,
          additionalDetails,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Could not submit story. Please try again.");
        return;
      }

      setSubmitted({
        referenceCode: data.referenceCode,
        nomineeName: data.nomineeName,
        submissionType: data.submissionType,
        createdAt: data.createdAt,
      });
    } catch {
      setError(
        "Network issue while submitting. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border-2 border-purple-200 bg-white p-8 shadow-xl shadow-purple-900/10 sm:p-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
            Story Received Safely
          </span>
          <h3 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
            Thank You for Sharing {submitted.nomineeName}&rsquo;s Story
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
            Your submission for <strong>The Next Stitch Initiative</strong> has
            been securely saved for review by{" "}
            <strong>Julihana Tomori</strong> and the JHF Fashion Empowerment
            Initiative team.
          </p>

          <div className="mt-6 rounded-2xl border border-purple-200 bg-brand-lavender/60 p-5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Reference Code
              </span>
              <span className="rounded-full bg-brand-purple px-3 py-1 font-mono text-sm font-bold text-brand-gold">
                {submitted.referenceCode}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-zinc-700">
              <p>
                <strong>Nominee / Applicant:</strong> {submitted.nomineeName}
              </p>
              <p>
                <strong>Submission Type:</strong>{" "}
                {submitted.submissionType === "nomination"
                  ? "Nomination submitted on her behalf"
                  : "Direct application"}
              </p>
              <p className="pt-1 text-xs text-zinc-600">
                Our team reads every story personally — no social media votes or
                likes required. If selected for follow-up, we will reach out on
                the phone number provided.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppUrl(
                `Hello JHF Fashion Empowerment Initiative! I just submitted a story for The Next Stitch Initiative (Ref: ${submitted.referenceCode}, Nominee: ${submitted.nomineeName}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Phone className="h-4 w-4" />
              Message Team on WhatsApp
            </a>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-lavender"
            >
              <RotateCcw className="h-4 w-4" />
              Submit Another Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-purple-200 bg-white p-6 shadow-xl shadow-purple-900/10 sm:p-9"
    >
      <div className="border-b border-purple-100 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
          <Heart className="h-3.5 w-3.5 text-brand-goldDark" />
          Share Her Story Privately
        </div>
        <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950">
          Tell Us Who Deserves These Two Sewing Machines
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Stories submitted here go privately to the{" "}
          <strong>JHF Fashion Empowerment Initiative</strong> selection team —
          they are <strong>not</strong> posted publicly.
        </p>

        {/* Nomination vs Self Toggle */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSubmissionType("nomination")}
            className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
              submissionType === "nomination"
                ? "border-brand-purple bg-brand-lavender/70"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                submissionType === "nomination"
                  ? "bg-brand-purple text-brand-gold"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-950">
                I Am Nominating Someone
              </p>
              <p className="mt-0.5 text-xs text-zinc-600">
                Tell us about a girl you know (apprentice, student, sister, or
                neighbour)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSubmissionType("self")}
            className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
              submissionType === "self"
                ? "border-brand-purple bg-brand-lavender/70"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                submissionType === "self"
                  ? "bg-brand-purple text-brand-gold"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-950">
                I Am Sharing My Own Story
              </p>
              <p className="mt-0.5 text-xs text-zinc-600">
                Apply directly if you are learning tailoring and need a machine
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Section 1: About the Young Girl */}
      <div className="mt-7 space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-brand-gold">
            1
          </span>
          <h3 className="font-serif text-xl font-bold text-zinc-950">
            {submissionType === "nomination"
              ? "About the Girl You Are Nominating"
              : "Your Details"}
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="nomineeName"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              {submissionType === "nomination"
                ? "Her Full Name *"
                : "Your Full Name *"}
            </label>
            <input
              id="nomineeName"
              type="text"
              required
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              placeholder="e.g. Amina Bello"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label
              htmlFor="nomineeAge"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Age (Optional)
            </label>
            <input
              id="nomineeAge"
              type="text"
              value={nomineeAge}
              onChange={(e) => setNomineeAge(e.target.value)}
              placeholder="e.g. 17 years"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label
              htmlFor="nomineeLocation"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Town / Area &amp; State *
            </label>
            <input
              id="nomineeLocation"
              type="text"
              required
              value={nomineeLocation}
              onChange={(e) => setNomineeLocation(e.target.value)}
              placeholder="e.g. Tanke, Ilorin, Kwara State"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label
              htmlFor="educationStage"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Current Stage *
            </label>
            <select
              id="educationStage"
              value={educationStage}
              onChange={(e) => setEducationStage(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              {EDUCATION_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="learningSetup"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Where Is She Currently Learning Tailoring? (Optional)
            </label>
            <input
              id="learningSetup"
              type="text"
              value={learningSetup}
              onChange={(e) => setLearningSetup(e.target.value)}
              placeholder="e.g. Roadside tailor shop near Challenge Market / local trainer's shop"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {submissionType === "nomination" && (
            <div className="sm:col-span-2">
              <label
                htmlFor="nomineePhone"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
              >
                Her Phone Number (Optional — Leave blank if she doesn&rsquo;t have
                one)
              </label>
              <input
                id="nomineePhone"
                type="tel"
                value={nomineePhone}
                onChange={(e) => setNomineePhone(e.target.value)}
                placeholder="Optional — she does NOT need social media or a smartphone"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Nominator / Contact Person Details */}
      <div className="mt-8 space-y-5 border-t border-purple-100 pt-7">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-brand-gold">
            2
          </span>
          <h3 className="font-serif text-xl font-bold text-zinc-950">
            {submissionType === "nomination"
              ? "Your Contact Details (So We Can Reach You)"
              : "How We Can Reach You"}
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {submissionType === "nomination" && (
            <>
              <div>
                <label
                  htmlFor="nominatorName"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
                >
                  Your Full Name *
                </label>
                <input
                  id="nominatorName"
                  type="text"
                  required
                  value={nominatorName}
                  onChange={(e) => setNominatorName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label
                  htmlFor="relationship"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
                >
                  Relationship to Her *
                </label>
                <select
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="contactPhone"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Best Phone / WhatsApp Number *
            </label>
            <input
              id="contactPhone"
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. 0803 000 0000"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Email Address (Optional)
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Optional email address"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Her Story */}
      <div className="mt-8 space-y-5 border-t border-purple-100 pt-7">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-brand-gold">
            3
          </span>
          <h3 className="font-serif text-xl font-bold text-zinc-950">
            Tell Us Her Story
          </h3>
        </div>

        <div>
          <label
            htmlFor="story"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
          >
            Why Does She Qualify &amp; What Difference Will These Machines Make? *
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Share as much detail as you&rsquo;d like — how she started learning,
            her dedication, her financial situation, and how having both machines
            (manual sewing machine + overlock machine) would change her future.
          </p>
          <textarea
            id="story"
            required
            rows={6}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write her story here..."
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm leading-relaxed text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <p className="mt-1 text-right text-[11px] text-zinc-400">
            {story.trim().length} characters
          </p>
        </div>

        <div>
          <label
            htmlFor="additionalDetails"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
          >
            Any Helpful Location Landmarks or Trainer Contact? (Optional)
          </label>
          <textarea
            id="additionalDetails"
            rows={2}
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="e.g. Address of her tailoring shop or trainer's phone number if we come to verify or deliver"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-purple-100 bg-brand-lavender/40 p-4 text-xs leading-relaxed text-zinc-700">
          <input
            type="checkbox"
            checked={truthConfirmed}
            onChange={(e) => setTruthConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-purple-300 text-brand-purple focus:ring-brand-purple"
          />
          <span>
            I confirm that the story and details shared above are genuine and
            that I consent to the <strong>JHF Fashion Empowerment Initiative</strong>{" "}
            contacting me to verify or follow up.
          </span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-purple px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-brand-violet disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4 text-brand-gold" />
          {submitting ? "Sending Story..." : "Submit Her Story Privately"}
        </button>

        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Sparkles className="h-3.5 w-3.5 text-brand-goldDark" />
          Questions? Call{" "}
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="font-bold text-brand-purple hover:underline"
          >
            08022653399
          </a>
        </p>
      </div>
    </form>
  );
}
