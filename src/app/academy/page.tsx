import type { Metadata } from "next";
import React from "react";
import { CheckCircle2, GraduationCap, Home, FileCheck2 } from "lucide-react";
import { ProgramCards } from "@/components/ProgramCards";
import { TuitionCalculator } from "@/components/TuitionCalculator";
import { FaqAccordion } from "@/components/FaqAccordion";
import {
  TRAINING_PROGRAMS,
  ADDITIONAL_FEES,
  INTAKE_BATCHES,
  SITE_CONFIG,
  buildWhatsAppUrl,
} from "@/data/siteData";

export const metadata: Metadata = {
  title: "Academy Courses, Syllabus & Fees in Ilorin",
  description:
    "Explore Julian House of Fashion Academy training fees in Ilorin: Foundational Class ₦150,000 (3 mos), Intermediate ₦150,000 (3 mos), Advanced ₦200,000 (3 mos), 9-Month Full Programme ₦500,000, Male Fashion Design ₦250,000 (4 mos). Reg Fee ₦10,000. Accommodation ₦50,000/3 mos.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/academy`,
  },
};

export default function AcademyPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="lavender-glow border-b border-purple-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <GraduationCap className="h-3.5 w-3.5" />
              Fashion Design Academy • Ilorin, Kwara State
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold text-zinc-950 sm:text-5xl">
              Training Programme &amp; Tuition Fees
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-700 sm:text-lg">
              At Julian House of Fashion, we provide structured, hands-on fashion
              training designed to take you from complete beginner to confident
              fashion designer and entrepreneur.{" "}
              <strong className="text-brand-purple">
                {SITE_CONFIG.tagline}
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Structured Fee Table */}
      <section className="border-b border-purple-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 sm:text-3xl">
            Official Fee Schedule at a Glance
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-200">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-brand-purple text-white">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Programme / Item</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Duration</th>
                  <th className="px-5 py-3.5 font-semibold">Fee (₦)</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 bg-white">
                {TRAINING_PROGRAMS.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-lavender/40">
                    <td className="px-5 py-4 font-bold text-zinc-900">
                      {p.title}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{p.category}</td>
                    <td className="px-5 py-4 text-zinc-700">{p.duration}</td>
                    <td className="px-5 py-4 font-bold text-brand-purple">
                      {p.priceFormatted}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={buildWhatsAppUrl(
                          `Hello JHF Academy! I would like to register for ${p.title} (${p.priceFormatted} / ${p.duration}).`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-purple hover:underline"
                      >
                        Apply →
                      </a>
                    </td>
                  </tr>
                ))}
                <tr className="bg-purple-50/50">
                  <td className="px-5 py-4 font-bold text-zinc-900">
                    Registration Fee
                  </td>
                  <td className="px-5 py-4 text-zinc-600">Mandatory Fee</td>
                  <td className="px-5 py-4 text-zinc-700">One-time payment</td>
                  <td className="px-5 py-4 font-bold text-brand-purple">
                    {ADDITIONAL_FEES.registrationFormatted}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    Upon admission
                  </td>
                </tr>
                <tr className="bg-purple-50/50">
                  <td className="px-5 py-4 font-bold text-zinc-900">
                    Student Accommodation
                  </td>
                  <td className="px-5 py-4 text-zinc-600">Optional Lodging</td>
                  <td className="px-5 py-4 text-zinc-700">
                    {ADDITIONAL_FEES.accommodationDuration}
                  </td>
                  <td className="px-5 py-4 font-bold text-brand-purple">
                    {ADDITIONAL_FEES.accommodationFormatted}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500">
                    Comfortable &amp; secure
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed Programme Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProgramCards showFullDetails />
        </div>
      </section>

      {/* Cohort Batches & Accommodation Details */}
      <section className="border-y border-purple-100 bg-brand-lavender/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-purple-200 bg-white p-7">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-6 w-6 text-brand-purple" />
                <h3 className="font-serif text-2xl font-bold text-zinc-900">
                  Cohort Intakes &amp; Registration
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Training runs in structured quarterly batches (including our
                popular February and August cohorts) so every student receives
                personalized attention from Julihana Tomori and senior
                instructors.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {INTAKE_BATCHES.slice(1).map((batch) => (
                  <span
                    key={batch}
                    className="rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold text-brand-purple"
                  >
                    {batch}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold text-zinc-700">
                One-time Registration Fee: {ADDITIONAL_FEES.registrationFormatted}
              </p>
            </div>

            <div className="rounded-3xl border border-purple-200 bg-white p-7">
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6 text-brand-purple" />
                <h3 className="font-serif text-2xl font-bold text-zinc-900">
                  Out-of-Town Student Accommodation
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Relocating to Ilorin for your fashion education? Comfortable
                accommodation is available at{" "}
                <strong className="text-brand-purple">
                  {ADDITIONAL_FEES.accommodationFormatted} for{" "}
                  {ADDITIONAL_FEES.accommodationDuration}
                </strong>
                , located close to our Basin Road studio for easy daily access.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-zinc-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                  Convenient access to 12 Alarape Street, off Basin Road
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                  Bookable per 3-month training level or full 9-month stay
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TuitionCalculator />
        </div>
      </section>

      {/* Academy FAQ */}
      <section className="border-t border-purple-100 bg-brand-lavender/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-bold text-zinc-950">
            Admissions FAQs
          </h2>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
