import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, GraduationCap, Home, FileCheck2 } from "lucide-react";
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
                      <Link
                        href={`/register?program=${p.id}`}
                        className="inline-flex items-center rounded-lg bg-brand-purple px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-violet"
                      >
                        Register Online →
                      </Link>
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

      {/* Detailed Official Course Outlines by Level */}
      <section
        id="course-outlines"
        className="border-t border-purple-100 bg-brand-cream/40 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <BookOpen className="h-3.5 w-3.5" />
              Official Academy Syllabus
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
              Detailed Official Course Outlines by Level
            </h2>
            <p className="mt-3 text-base text-zinc-700">
              Review the exact module-by-module training syllabus for
              Foundational (3 months), Intermediate (3 months), Advanced (3
              months), and Male Fashion Design (4 months). Students who register
              online receive their chosen programme&apos;s official outline on
              their printable Admission Acknowledgement Slip.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {TRAINING_PROGRAMS.filter((p) => p.id !== "full-programme").map(
              (program) => (
                <article
                  key={program.id}
                  id={`outline-${program.id}`}
                  className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 bg-brand-purple px-6 py-5 text-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-goldLight">
                        {program.level} • {program.duration}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                        {program.title} Course Outline
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
                        Tuition: {program.priceFormatted}
                      </span>
                      <Link
                        href={`/register?program=${program.id}`}
                        className="rounded-full bg-brand-gold px-5 py-2 text-xs font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-brand-goldLight"
                      >
                        Register for {program.title}
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {program.courseOutline.map((mod, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-purple-100 bg-brand-cream/30 p-5"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                            {mod.title}
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                            {mod.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-goldDark" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                          Expected Outcome
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                          {program.expectedOutcomeText}
                        </p>
                      </div>

                      {program.finalProject ? (
                        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                            Final Project
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                            {program.finalProject}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-zinc-50 p-5">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                              Flexible Tuition &amp; Progression
                            </p>
                            <p className="mt-2 text-sm text-zinc-700">
                              Start with the ₦10,000 Registration &amp; Agreement
                              Form, print your Acknowledgement Slip, and pay{" "}
                              {program.priceFormatted} in 4 installments of 25%
                              via Paystack.
                            </p>
                          </div>
                          <div className="mt-3">
                            <Link
                              href={`/register?program=${program.id}`}
                              className="text-xs font-bold text-brand-purple underline-offset-2 hover:underline"
                            >
                              Start {program.title} Registration →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="mt-10 rounded-3xl border-2 border-brand-gold bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                  9-Month Full Programme Option — ₦500,000
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-zinc-950">
                  Enrolling in Foundational + Intermediate + Advanced Consecutively?
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-zinc-700">
                  The 9-month Full Programme covers every module listed above
                  across Foundational, Intermediate, and Advanced classes plus
                  continuous studio mentorship and the Advanced Final Project.
                </p>
              </div>
              <Link
                href="/register?program=full-programme"
                className="shrink-0 rounded-full bg-brand-purple px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-purpleDark"
              >
                Register for Full Programme →
              </Link>
            </div>
          </div>
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
