import type { Metadata } from "next";
import React, { Suspense } from "react";
import { GraduationCap } from "lucide-react";
import { StudentRegistrationPortal } from "@/components/StudentRegistrationPortal";
import { SITE_CONFIG } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Online Student Registration & Tuition Payment Portal",
  description:
    "Register online for Julian House of Fashion Academy Ilorin (₦10,000 Registration Fee), print your Official Receipt & Acknowledgement Slip with full course outline, and pay tuition in 25% installments via Paystack.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/register`,
  },
};

export default function RegisterPage() {
  return (
    <>
      <section className="no-print lavender-glow border-b border-purple-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <GraduationCap className="h-3.5 w-3.5" />
              Student Admissions &amp; Paystack Portal
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-5xl">
              Online Registration &amp; Flexible 25% Tuition Payment
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
              Fill out your admission form and pay the{" "}
              <strong className="text-brand-purple">₦10,000</strong>{" "}
              registration fee online to instantly print your official Receipt
              and Admission Acknowledgement Slip with your complete course
              outline.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-purple-100 bg-white p-8 text-center text-sm text-zinc-500">
                Loading Julian House of Fashion Academy registration portal...
              </div>
            }
          >
            <StudentRegistrationPortal />
          </Suspense>
        </div>
      </section>
    </>
  );
}
