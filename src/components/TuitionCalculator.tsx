"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Home, CheckCircle2, MessageCircle, CreditCard } from "lucide-react";
import {
  TRAINING_PROGRAMS,
  ADDITIONAL_FEES,
  INTAKE_BATCHES,
  buildWhatsAppUrl,
} from "@/data/siteData";

export function TuitionCalculator() {
  const [selectedProgramId, setSelectedProgramId] = useState<string>("foundational");
  const [includeAccommodation, setIncludeAccommodation] = useState<boolean>(false);
  const [accommodationBlocks, setAccommodationBlocks] = useState<number>(1);
  const [studentName, setStudentName] = useState<string>("");
  const [batch, setBatch] = useState<string>(INTAKE_BATCHES[0]);

  const selectedProgram = useMemo(
    () =>
      TRAINING_PROGRAMS.find((p) => p.id === selectedProgramId) ??
      TRAINING_PROGRAMS[0],
    [selectedProgramId]
  );

  // Recommend default accommodation blocks based on programme length when toggled
  const maxRecommendedBlocks =
    selectedProgram.id === "full-programme"
      ? 3
      : selectedProgram.id === "male-fashion"
      ? 2
      : 1;

  const accommodationCost = includeAccommodation
    ? accommodationBlocks * ADDITIONAL_FEES.accommodationFeePerBlock
    : 0;

  const totalNaira =
    selectedProgram.priceNaira +
    ADDITIONAL_FEES.registrationFee +
    accommodationCost;

  const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

  const handleProgramChange = (id: string) => {
    setSelectedProgramId(id);
    if (id === "full-programme") {
      setAccommodationBlocks(3);
    } else if (id === "male-fashion") {
      setAccommodationBlocks(1);
    } else {
      setAccommodationBlocks(1);
    }
  };

  const whatsappUrl = buildWhatsAppUrl(
    [
      `Hello Julian House of Fashion Academy!`,
      `My name is ${studentName.trim() || "[Prospective Student]"}.`,
      `I would like to enroll in:`,
      `• Programme: ${selectedProgram.title} (${selectedProgram.duration}) — ${selectedProgram.priceFormatted}`,
      `• One-Time Registration Fee: ${ADDITIONAL_FEES.registrationFormatted}`,
      includeAccommodation
        ? `• Student Accommodation: ${accommodationBlocks} x 3-month block(s) — ${formatNaira(accommodationCost)}`
        : `• Accommodation: Not needed`,
      `• Estimated Total: ${formatNaira(totalNaira)}`,
      `• Preferred Intake: ${batch}`,
      `Please send me the bank payment details and resumption date for the Ilorin studio.`,
    ].join("\n")
  );

  return (
    <div
      id="tuition-calculator"
      className="rounded-3xl border border-purple-200 bg-white p-6 shadow-xl shadow-purple-900/5 sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
            <Calculator className="h-3.5 w-3.5" />
            Interactive Fee Estimator & Admission
          </span>
          <h3 className="mt-2 font-serif text-2xl font-bold text-zinc-900 sm:text-3xl">
            Calculate Your Training Fee & Apply
          </h3>
        </div>
        <p className="text-xs font-medium text-zinc-500">
          Transparent Naira pricing • No hidden charges
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form Controls */}
        <div className="space-y-5 lg:col-span-7">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">
              1. Select Training Programme
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {TRAINING_PROGRAMS.map((program) => {
                const isSelected = program.id === selectedProgramId;
                return (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => handleProgramChange(program.id)}
                    className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-brand-purple bg-brand-lavender ring-2 ring-brand-purple/20"
                        : "border-zinc-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-bold text-zinc-900">
                        {program.title}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-purple" />
                      )}
                    </div>
                    <span className="mt-1 text-xs text-zinc-600">
                      {program.duration} •{" "}
                      <strong className="text-brand-purple">
                        {program.priceFormatted}
                      </strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accommodation Toggle */}
          <div className="rounded-2xl border border-purple-100 bg-brand-lavender/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Home className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                <div>
                  <label
                    htmlFor="accommodation-toggle"
                    className="cursor-pointer text-sm font-bold text-zinc-900"
                  >
                    Include Comfortable Student Accommodation
                  </label>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    ₦50,000 per 3 months — ideal for students relocating to
                    Ilorin.
                  </p>
                </div>
              </div>
              <input
                id="accommodation-toggle"
                type="checkbox"
                checked={includeAccommodation}
                onChange={(e) => setIncludeAccommodation(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded border-purple-300 text-brand-purple focus:ring-brand-purple"
              />
            </div>

            {includeAccommodation && (
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-purple-200/70 pt-3">
                <span className="text-xs font-semibold text-zinc-700">
                  Accommodation Duration:
                </span>
                {[1, 2, 3].map((blocks) => (
                  <button
                    key={blocks}
                    type="button"
                    onClick={() => setAccommodationBlocks(blocks)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      accommodationBlocks === blocks
                        ? "bg-brand-purple text-white"
                        : "bg-white text-zinc-700 ring-1 ring-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    {blocks * 3} Months ({formatNaira(blocks * 50000)})
                    {blocks === maxRecommendedBlocks && " • Recommended"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name & Batch */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="student-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Your Full Name
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Zainab Adeyemi"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              />
            </div>
            <div>
              <label
                htmlFor="intake-batch"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600"
              >
                Preferred Intake Batch
              </label>
              <select
                id="intake-batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              >
                {INTAKE_BATCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-brand-purple p-6 text-white lg:col-span-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Fee Summary
            </p>
            <h4 className="mt-1 font-serif text-2xl font-bold">
              {selectedProgram.title}
            </h4>
            <p className="mt-1 text-xs text-purple-200">
              Duration: {selectedProgram.duration} • {selectedProgram.level}
            </p>

            <div className="mt-6 space-y-3 border-t border-white/15 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Tuition Fee</span>
                <span className="font-semibold">
                  {selectedProgram.priceFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100">
                  Registration Fee (One-time)
                </span>
                <span className="font-semibold">
                  {ADDITIONAL_FEES.registrationFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100">
                  Accommodation (
                  {includeAccommodation
                    ? `${accommodationBlocks * 3} months`
                    : "Optional"}
                  )
                </span>
                <span className="font-semibold">
                  {includeAccommodation ? formatNaira(accommodationCost) : "₦0"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-white/20 pt-4">
              <span className="text-sm font-semibold text-purple-100">
                Total Estimate
              </span>
              <span className="font-serif text-3xl font-bold text-brand-gold">
                {formatNaira(totalNaira)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <Link
              href={`/register?program=${selectedProgram.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-amber-300"
            >
              <CreditCard className="h-4 w-4" />
              Register &amp; Pay ₦10,000 Online Now
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Or Send Estimate on WhatsApp
            </a>
            <p className="text-center text-[11px] text-purple-200">
              Tuition can be paid in 4 × 25% installments via Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
