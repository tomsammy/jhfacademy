import React from "react";
import Link from "next/link";
import { Check, Clock, Sparkles, Home, FileCheck2 } from "lucide-react";
import {
  TRAINING_PROGRAMS,
  ADDITIONAL_FEES,
  buildWhatsAppUrl,
} from "@/data/siteData";

export function ProgramCards({ showFullDetails = false }: { showFullDetails?: boolean }) {
  const coreTracks = TRAINING_PROGRAMS.filter(
    (p) => p.category === "Core Track"
  );
  const fullProgram = TRAINING_PROGRAMS.find(
    (p) => p.category === "Full Programme"
  );
  const specialised = TRAINING_PROGRAMS.find(
    (p) => p.category === "Specialised Training"
  );

  return (
    <div className="space-y-10">
      {/* 3 Core Tracks */}
      <div className="grid gap-6 lg:grid-cols-3">
        {coreTracks.map((program) => (
          <div
            key={program.id}
            id={program.slug}
            className="flex flex-col justify-between rounded-3xl border border-purple-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold text-brand-purple">
                  {program.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500">
                  <Clock className="h-3.5 w-3.5 text-brand-purple" />
                  {program.duration}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-bold text-zinc-900">
                {program.title}
              </h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-bold text-brand-purple">
                  {program.priceFormatted}
                </span>
                <span className="text-xs font-medium text-zinc-500">
                  / {program.duration}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {program.summary}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-purple-50 pt-5">
                {(showFullDetails
                  ? program.curriculum
                  : program.curriculum.slice(0, 4)
                ).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-zinc-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-col gap-2">
              <Link
                href={`/register?program=${program.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-purple px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-violet"
              >
                Register &amp; Pay Online (₦10k) →
              </Link>
              <div className="flex items-center justify-between gap-2 pt-1">
                {!showFullDetails ? (
                  <Link
                    href={`/academy#${program.slug}`}
                    className="text-xs font-semibold text-brand-purple hover:underline"
                  >
                    View Full Syllabus
                  </Link>
                ) : (
                  <span className="text-[11px] font-medium text-zinc-500">
                    25% × 4 installments available
                  </span>
                )}
                <a
                  href={buildWhatsAppUrl(
                    `Hello JHF Academy! I have a question about enrolling in the ${program.title} (${program.priceFormatted} for ${program.duration}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-600 hover:text-brand-purple"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Programme & Specialised Male Fashion Design */}
      <div className="grid gap-6 lg:grid-cols-12">
        {fullProgram && (
          <div
            id={fullProgram.slug}
            className="couture-gradient relative overflow-hidden rounded-3xl p-7 text-white shadow-xl lg:col-span-7 sm:p-9"
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-zinc-950">
                    <Sparkles className="h-3.5 w-3.5" />
                    Full Programme Option • All 3 Levels
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
                    {fullProgram.duration} Intensive
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
                  {fullProgram.title}
                </h3>
                <div className="mt-3 flex flex-wrap items-baseline gap-3">
                  <span className="font-serif text-4xl font-bold text-brand-gold sm:text-5xl">
                    {fullProgram.priceFormatted}
                  </span>
                  <span className="text-sm text-purple-100">
                    Total for Foundational + Intermediate + Advanced consecutively
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-purple-100">
                  {fullProgram.summary}
                </p>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {fullProgram.curriculum.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-xl bg-white/10 p-3 text-xs leading-relaxed text-purple-50"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/register?program=${fullProgram.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-gold px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
                >
                  Register Online for 9-Month Programme →
                </Link>
                <a
                  href={buildWhatsAppUrl(
                    `Hello JHF Academy! I am interested in the 9-Month Full Programme Option (${fullProgram.priceFormatted}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Inquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {specialised && (
          <div
            id={specialised.slug}
            className="flex flex-col justify-between rounded-3xl border-2 border-brand-purple/20 bg-brand-lavender/70 p-7 lg:col-span-5 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-purple px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {specialised.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-purple">
                  <Clock className="h-3.5 w-3.5" />
                  {specialised.duration}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-3xl font-bold text-zinc-900">
                {specialised.title}
              </h3>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-bold text-brand-purple">
                  {specialised.priceFormatted}
                </span>
                <span className="text-xs font-medium text-zinc-600">
                  / {specialised.duration}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {specialised.summary}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-purple-200/70 pt-4">
                {specialised.curriculum.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-zinc-800"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={`/register?program=${specialised.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-purple"
              >
                Register Online for Male Fashion Design →
              </Link>
              <a
                href={buildWhatsAppUrl(
                  `Hello JHF Academy! I would like to inquire about Specialised Male Fashion Design (${specialised.priceFormatted} for ${specialised.duration}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs font-semibold text-brand-purple hover:underline"
              >
                Ask Questions on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Registration Fee & Accommodation Callout Strip */}
      <div className="grid gap-4 rounded-2xl border border-purple-200 bg-purple-50/70 p-5 sm:grid-cols-2 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-brand-purple p-2.5 text-white">
            <FileCheck2 className="h-5 w-5 text-brand-gold" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">
              Registration Fee: {ADDITIONAL_FEES.registrationFormatted}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              {ADDITIONAL_FEES.registrationNote}. Covers student onboarding,
              admission documentation, and studio scheduling.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-brand-purple p-2.5 text-white">
            <Home className="h-5 w-5 text-brand-gold" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">
              Student Accommodation: {ADDITIONAL_FEES.accommodationFormatted} for{" "}
              {ADDITIONAL_FEES.accommodationDuration}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              {ADDITIONAL_FEES.accommodationNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
