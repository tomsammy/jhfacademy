"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Laptop,
  Link as LinkIcon,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteData";

const OCCUPATIONS = [
  "Student",
  "Employed",
  "Self-employed",
  "Business owner",
  "Other",
] as const;

const TRAINING_LEVELS = [
  {
    label: "Foundation – ₦150,000",
    programId: "foundational",
    duration: "3 Months • Complete beginner to core tailoring blocks",
  },
  {
    label: "Intermediate – ₦150,000",
    programId: "intermediate",
    duration: "3 Months • Bustiers, corsetry & advanced skirt/sleeve variations",
  },
  {
    label: "Advanced – ₦200,000",
    programId: "advanced",
    duration: "3 Months • Couture finishing, bridal engineering & blazers",
  },
] as const;

const EXPERIENCE_LEVELS = [
  "No experience",
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const MACHINE_OPTIONS = [
  "Yes, I own one.",
  "Yes, I have access to one.",
  "No, but I am willing to arrange access before training begins.",
] as const;

const INTERNET_OPTIONS = ["Yes", "No"] as const;

const COMMITMENT_CONDITIONS = [
  "Hybrid training attracts the same tuition fees as regular physical training.",
  "I am responsible for watching assigned video tutorials, participating in online lessons and asking questions whenever I need clarification.",
  "I must complete and submit all practical assignments within the stipulated deadlines.",
  "I must attend the academy physically at least once every week for assessment, corrections, supervision and practical work.",
  "I must have access to a functional sewing machine for independent practice.",
  "Falling behind by two practical assignments may result in disqualification from the programme.",
  "Disqualification due to failure to comply with programme requirements will not attract a refund.",
];

interface SubmittedState {
  referenceCode: string;
  fullName: string;
  trainingLevel: string;
  programId: string;
  phoneNumber: string;
  emailAddress: string;
}

function getTodayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function HybridApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [occupationChoice, setOccupationChoice] = useState<string>("Student");
  const [occupationOther, setOccupationOther] = useState("");

  const [trainingLevel, setTrainingLevel] = useState<string>(
    TRAINING_LEVELS[0].label
  );
  const [experienceLevel, setExperienceLevel] =
    useState<string>("No experience");
  const [whyHybrid, setWhyHybrid] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [availabilityNote, setAvailabilityNote] = useState("");

  const [machineAccess, setMachineAccess] = useState<string>(
    MACHINE_OPTIONS[0]
  );
  const [internetAccess, setInternetAccess] = useState<string>("Yes");

  const [agreementChoice, setAgreementChoice] = useState<"yes" | "no" | "">("");
  const [signatureName, setSignatureName] = useState("");
  const [applicationDate, setApplicationDate] = useState(getTodayIso);

  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);

  const shareUrl = `${SITE_CONFIG.domain}/hybrid`;

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch {
      // Ignore clipboard failures
    }
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (sameAsPhone) {
      setWhatsappNumber(value);
    }
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappNumber(phoneNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveOccupation =
      occupationChoice === "Other"
        ? occupationOther.trim()
          ? `Other: ${occupationOther.trim()}`
          : ""
        : occupationChoice;

    if (!effectiveOccupation) {
      setError("6. Please specify your Occupation.");
      return;
    }

    if (selectedWeekdays.length === 0) {
      setError(
        "10. Please select at least one weekday (Monday–Friday) you are available for compulsory weekly physical practical sessions."
      );
      return;
    }

    if (agreementChoice !== "yes") {
      setError(
        "13. You must select 'Yes, I agree and am ready to commit.' to submit your Hybrid Training application."
      );
      return;
    }

    const availableDays = availabilityNote.trim()
      ? `${selectedWeekdays.join(", ")} (${availabilityNote.trim()})`
      : selectedWeekdays.join(", ");

    setSubmitting(true);
    try {
      const response = await fetch("/api/hybrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          whatsappNumber,
          emailAddress,
          residentialAddress,
          occupation: effectiveOccupation,
          trainingLevel,
          experienceLevel,
          whyHybrid,
          availableDays,
          machineAccess,
          internetAccess,
          agreedConditions: true,
          signatureName,
          applicationDate,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(
          data?.error || "Could not submit your application. Please try again."
        );
        return;
      }

      setSubmitted({
        referenceCode: data.referenceCode,
        fullName: data.fullName,
        trainingLevel: data.trainingLevel,
        programId: data.programId,
        phoneNumber,
        emailAddress,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        "Network error while submitting your application. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const registrationHref = `/register?mode=hybrid&program=${encodeURIComponent(
      submitted.programId
    )}&name=${encodeURIComponent(submitted.fullName)}&phone=${encodeURIComponent(
      submitted.phoneNumber
    )}&email=${encodeURIComponent(submitted.emailAddress)}`;

    return (
      <div className="rounded-3xl border-2 border-purple-200 bg-white p-7 shadow-xl shadow-purple-900/10 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
            THANK YOU!
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
            Thank you for choosing Julian House of Fashion.
          </h2>

          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-brand-lavender/50 px-5 py-3 text-sm">
            <span className="font-semibold text-zinc-600">
              Hybrid Application Reference:
            </span>
            <span className="rounded-full bg-brand-purple px-3 py-0.5 font-mono text-xs font-bold text-brand-gold">
              {submitted.referenceCode}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="font-bold text-brand-purple">
              {submitted.trainingLevel}
            </span>
          </div>

          <div className="mt-7 rounded-3xl border-2 border-brand-purple/20 bg-gradient-to-br from-brand-lavender/60 via-white to-brand-cream p-6 text-left sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-purple">
              NEXT STEP: REGISTRATION AND PAYMENT
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-800 sm:text-base">
              Having read and understood the programme requirements, kindly
              proceed and click the registration link to complete your
              registration and make payment.
            </p>
            <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-950 sm:text-sm">
              Please ensure you select the{" "}
              <span className="underline">Hybrid Training Programme</span> when
              registering.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={registrationHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-brand-violet"
              >
                Proceed to Registration &amp; Payment
                <ArrowRight className="h-4 w-4 text-brand-gold" />
              </Link>
              <Link
                href={`/pay?program=${encodeURIComponent(
                  submitted.programId
                )}&name=${encodeURIComponent(submitted.fullName)}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-purple bg-white px-5 py-3 text-xs font-bold text-brand-purple transition hover:bg-brand-lavender"
              >
                <Wallet className="h-4 w-4" />
                Pay Tuition Directly
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-purple-100 pt-6">
            <p className="text-sm font-medium text-zinc-700">
              We look forward to welcoming you to JHF!
            </p>
            <p className="mt-2 font-serif text-lg font-bold tracking-wide text-brand-purple">
              JULIAN HOUSE OF FASHION
            </p>
            <p className="text-xs font-semibold italic text-brand-goldDark">
              Love Lives Here. Welcome Home.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-purple-200 bg-white p-6 shadow-xl shadow-purple-900/10 sm:p-10"
    >
      {/* Quick Shareable Link Strip */}
      <div className="mb-8 flex flex-col justify-between gap-3 rounded-2xl border border-purple-100 bg-brand-lavender/45 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 text-xs text-zinc-700">
          <LinkIcon className="h-4 w-4 shrink-0 text-brand-purple" />
          <span>
            Shareable Application Link:{" "}
            <strong className="font-mono text-brand-purple">{shareUrl}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={copyShareUrl}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-purple transition hover:bg-brand-purple hover:text-white"
        >
          {copiedShareLink ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Link Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Link to Share
            </>
          )}
        </button>
      </div>

      {/* SECTION 1: PERSONAL INFORMATION */}
      <div className="space-y-5">
        <div className="border-b border-purple-100 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-goldDark">
            Section 1
          </p>
          <h2 className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
            SECTION 1: PERSONAL INFORMATION
          </h2>
        </div>

        <div>
          <label
            htmlFor="hybrid-fullName"
            className="block text-sm font-semibold text-zinc-900"
          >
            1. Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="hybrid-fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hybrid-phone"
              className="block text-sm font-semibold text-zinc-900"
            >
              2. Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              id="hybrid-phone"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="e.g. 0803 123 4567"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="hybrid-whatsapp"
                className="block text-sm font-semibold text-zinc-900"
              >
                3. WhatsApp Number <span className="text-red-600">*</span>
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand-purple">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-purple-300 text-brand-purple"
                />
                Same as Phone
              </label>
            </div>
            <input
              id="hybrid-whatsapp"
              type="tel"
              required
              value={whatsappNumber}
              onChange={(e) => {
                setSameAsPhone(false);
                setWhatsappNumber(e.target.value);
              }}
              placeholder="Active WhatsApp number"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="hybrid-email"
            className="block text-sm font-semibold text-zinc-900"
          >
            4. Email Address <span className="text-red-600">*</span>
          </label>
          <input
            id="hybrid-email"
            type="email"
            required
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label
            htmlFor="hybrid-address"
            className="block text-sm font-semibold text-zinc-900"
          >
            5. Residential Address <span className="text-red-600">*</span>
          </label>
          <textarea
            id="hybrid-address"
            required
            rows={2}
            value={residentialAddress}
            onChange={(e) => setResidentialAddress(e.target.value)}
            placeholder="House number, street, area, city & state"
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            6. Occupation <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {OCCUPATIONS.map((occ) => (
              <label
                key={occ}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                  occupationChoice === occ
                    ? "border-brand-purple bg-brand-lavender font-semibold text-brand-purple"
                    : "border-zinc-200 text-zinc-700 hover:border-purple-200"
                }`}
              >
                <input
                  type="radio"
                  name="occupationChoice"
                  value={occ}
                  checked={occupationChoice === occ}
                  onChange={(e) => setOccupationChoice(e.target.value)}
                  className="h-4 w-4 text-brand-purple"
                />
                <span>{occ}</span>
              </label>
            ))}
          </div>
          {occupationChoice === "Other" && (
            <input
              type="text"
              required
              value={occupationOther}
              onChange={(e) => setOccupationOther(e.target.value)}
              placeholder="Please specify your occupation"
              className="mt-2.5 w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* SECTION 2: TRAINING INFORMATION */}
      <div className="mt-10 space-y-5 border-t border-purple-100 pt-8">
        <div className="border-b border-purple-100 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-goldDark">
            Section 2
          </p>
          <h2 className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
            SECTION 2: TRAINING INFORMATION
          </h2>
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            7. Which training level are you applying for?{" "}
            <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 space-y-2.5">
            {TRAINING_LEVELS.map((lvl) => (
              <label
                key={lvl.label}
                className={`flex cursor-pointer flex-col justify-between gap-1 rounded-2xl border px-4 py-3.5 transition sm:flex-row sm:items-center ${
                  trainingLevel === lvl.label
                    ? "border-brand-purple bg-brand-lavender ring-1 ring-brand-purple/25"
                    : "border-zinc-200 hover:border-purple-200"
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-bold text-zinc-950">
                  <input
                    type="radio"
                    name="trainingLevel"
                    value={lvl.label}
                    checked={trainingLevel === lvl.label}
                    onChange={(e) => setTrainingLevel(e.target.value)}
                    className="h-4 w-4 text-brand-purple"
                  />
                  {lvl.label}
                </span>
                <span className="pl-6 text-xs text-zinc-600 sm:pl-0">
                  {lvl.duration}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            8. Do you have previous sewing or fashion design experience?{" "}
            <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCE_LEVELS.map((exp) => (
              <label
                key={exp}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                  experienceLevel === exp
                    ? "border-brand-purple bg-brand-lavender font-semibold text-brand-purple"
                    : "border-zinc-200 text-zinc-700 hover:border-purple-200"
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={exp}
                  checked={experienceLevel === exp}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="h-4 w-4 text-brand-purple"
                />
                <span>{exp}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="hybrid-why"
            className="block text-sm font-semibold text-zinc-900"
          >
            9. Why have you chosen the hybrid training option?{" "}
            <span className="text-red-600">*</span>
          </label>
          <textarea
            id="hybrid-why"
            required
            rows={4}
            value={whyHybrid}
            onChange={(e) => setWhyHybrid(e.target.value)}
            placeholder="Tell us about your work, school, or family schedule and why hybrid learning suits your goals..."
            className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm leading-relaxed text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            10. What days are you available to attend physical practical sessions
            at the academy (Monday–Friday)?{" "}
            <span className="text-red-600">*</span>
          </span>
          <p className="mt-1 text-xs text-zinc-500">
            Select one or more weekdays (studio is closed on weekends).
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const active = selectedWeekdays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekday(day)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    active
                      ? "border-brand-purple bg-brand-purple text-white shadow-sm"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-purple-300"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5 text-brand-gold" />}
                  {day}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={availabilityNote}
            onChange={(e) => setAvailabilityNote(e.target.value)}
            placeholder="Optional: Preferred time window on selected day(s), e.g. 10:00 AM – 2:00 PM"
            className="mt-3 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* SECTION 3: EQUIPMENT AND ACCESSIBILITY */}
      <div className="mt-10 space-y-5 border-t border-purple-100 pt-8">
        <div className="border-b border-purple-100 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-goldDark">
            Section 3
          </p>
          <h2 className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
            SECTION 3: EQUIPMENT AND ACCESSIBILITY
          </h2>
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            11. Do you have access to a functional sewing machine?{" "}
            <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 space-y-2">
            {MACHINE_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                  machineAccess === opt
                    ? "border-brand-purple bg-brand-lavender font-semibold text-brand-purple"
                    : "border-zinc-200 text-zinc-700 hover:border-purple-200"
                }`}
              >
                <input
                  type="radio"
                  name="machineAccess"
                  value={opt}
                  checked={machineAccess === opt}
                  onChange={(e) => setMachineAccess(e.target.value)}
                  className="h-4 w-4 text-brand-purple"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            12. Do you have access to a smartphone or computer and reliable
            internet for online classes and tutorials?{" "}
            <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {INTERNET_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                  internetAccess === opt
                    ? "border-brand-purple bg-brand-lavender font-semibold text-brand-purple"
                    : "border-zinc-200 text-zinc-700 hover:border-purple-200"
                }`}
              >
                <input
                  type="radio"
                  name="internetAccess"
                  value={opt}
                  checked={internetAccess === opt}
                  onChange={(e) => setInternetAccess(e.target.value)}
                  className="h-4 w-4 text-brand-purple"
                />
                <Laptop className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {internetAccess === "No" && (
            <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
              Please note: Reliable internet access on a smartphone or computer
              is essential for watching assigned video tutorials and joining
              online Hybrid sessions.
            </p>
          )}
        </div>
      </div>

      {/* SECTION 4: COMMITMENT AND DECLARATION */}
      <div className="mt-10 space-y-5 border-t border-purple-100 pt-8">
        <div className="border-b border-purple-100 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-goldDark">
            Section 4
          </p>
          <h2 className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
            SECTION 4: COMMITMENT AND DECLARATION
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-zinc-700">
            Please read carefully before agreeing.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-brand-lavender/35 p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-brand-purple">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            I understand and agree that:
          </p>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-800">
            {COMMITMENT_CONDITIONS.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="block text-sm font-semibold text-zinc-900">
            13. Do you fully understand and agree to these conditions?{" "}
            <span className="text-red-600">*</span>
          </span>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                agreementChoice === "yes"
                  ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-900"
                  : "border-zinc-200 text-zinc-800 hover:border-purple-200"
              }`}
            >
              <input
                type="radio"
                name="agreementChoice"
                value="yes"
                checked={agreementChoice === "yes"}
                onChange={() => setAgreementChoice("yes")}
                className="h-4 w-4 text-emerald-700"
              />
              <span>Yes, I agree and am ready to commit.</span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition ${
                agreementChoice === "no"
                  ? "border-red-400 bg-red-50 font-bold text-red-900"
                  : "border-zinc-200 text-zinc-800 hover:border-purple-200"
              }`}
            >
              <input
                type="radio"
                name="agreementChoice"
                value="no"
                checked={agreementChoice === "no"}
                onChange={() => setAgreementChoice("no")}
                className="h-4 w-4 text-red-600"
              />
              <span>No, I do not agree.</span>
            </label>
          </div>

          {agreementChoice === "no" && (
            <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-800">
              Agreement and commitment to the Hybrid Training conditions above
              are mandatory to enroll in the Hybrid Fashion Training Programme.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hybrid-signature"
              className="block text-sm font-semibold text-zinc-900"
            >
              14. Applicant&rsquo;s Full Name:{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              id="hybrid-signature"
              type="text"
              required
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Type your full name as electronic signature"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm italic text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label
              htmlFor="hybrid-date"
              className="block text-sm font-semibold text-zinc-900"
            >
              15. Date: <span className="text-red-600">*</span>
            </label>
            <input
              id="hybrid-date"
              type="date"
              required
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 border-t border-purple-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-purple px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-brand-violet disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4 text-brand-gold" />
          {submitting
            ? "Submitting Application..."
            : "Submit Hybrid Application"}
        </button>

        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Sparkles className="h-3.5 w-3.5 text-brand-goldDark" />
          Need help? Call or WhatsApp{" "}
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="font-bold text-brand-purple hover:underline"
          >
            {SITE_CONFIG.phoneDisplay}
          </a>
        </p>
      </div>
    </form>
  );
}
