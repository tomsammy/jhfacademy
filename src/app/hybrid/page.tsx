import type { Metadata } from "next";
import React from "react";
import {
  CalendarCheck,
  GraduationCap,
  Laptop,
  Scissors,
  Sparkles,
} from "lucide-react";
import { HybridApplicationForm } from "@/components/HybridApplicationForm";
import { SITE_CONFIG } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Hybrid Training Application Form | Julian House of Fashion",
  description:
    "Apply for Julian House of Fashion (JHF) Hybrid Fashion Training Programme: online lessons, video tutorials, independent practical assignments & compulsory weekly physical sessions in Ilorin.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/hybrid`,
  },
};

export default function HybridTrainingPage() {
  return (
    <>
      {/* Hero & Verbatim Programme Introduction */}
      <section className="lavender-glow border-b border-purple-100 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-purple ring-1 ring-purple-200">
              <GraduationCap className="h-3.5 w-3.5 text-brand-goldDark" />
              JULIAN HOUSE OF FASHION (JHF)
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              HYBRID TRAINING APPLICATION FORM
            </h1>

            <p className="mt-3 font-serif text-xl font-semibold italic text-brand-purple sm:text-2xl">
              Learn flexibly. Practise consistently. Become skilled.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-purple-200 bg-white/95 p-6 shadow-md sm:p-8">
            <p className="font-serif text-xl font-bold text-zinc-950">
              Welcome to Julian House of Fashion!
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-700 sm:text-base">
              This application form is exclusively for applicants interested in
              our <strong>Hybrid Fashion Training Programme</strong>.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
              The programme combines online lessons, video tutorials,
              independent practical assignments and compulsory weekly physical
              sessions at our academy.
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-purple sm:text-sm">
              Please provide accurate information and carefully read the
              requirements before submitting your application.
            </p>

            {/* 4 Pillars Summary */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-2.5 rounded-2xl border border-purple-100 bg-brand-lavender/45 p-3.5">
                <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">
                    Online Lessons
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    Live guidance &amp; structured theory
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-purple-100 bg-brand-lavender/45 p-3.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">
                    Video Tutorials
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    Assigned lessons on your schedule
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-purple-100 bg-brand-lavender/45 p-3.5">
                <Scissors className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">
                    Practical Tasks
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    Hands-on assignments with deadlines
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-purple-100 bg-brand-lavender/45 p-3.5">
                <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">
                    Weekly Studio Day
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    Compulsory Mon–Fri assessment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 4-Section Application Form */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <HybridApplicationForm />
        </div>
      </section>
    </>
  );
}
