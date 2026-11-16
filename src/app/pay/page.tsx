import type { Metadata } from "next";
import React, { Suspense } from "react";
import { Wallet } from "lucide-react";
import { TrainingFeePaymentPortal } from "@/components/TrainingFeePaymentPortal";
import { SITE_CONFIG } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Pay Training Fees Online (Custom Amount)",
  description:
    "Direct online training fee payment portal for Julian House of Fashion Academy, Ilorin. Enter the exact amount you want to pay via Paystack and print your official receipt.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/pay`,
  },
};

export default function PayPage() {
  return (
    <>
      <section className="no-print lavender-glow border-b border-purple-100 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <Wallet className="h-3.5 w-3.5" />
              Direct Fee Payment Link
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-5xl">
              Quick Training Fee Payment Portal
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
              Enter the exact amount you wish to pay towards your fashion
              training tuition, part-payment, or accommodation and pay securely
              online via Paystack. Your official receipt is generated
              immediately.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-purple-100 bg-white p-8 text-center text-sm text-zinc-500">
                Loading Julian House of Fashion Academy fee payment portal...
              </div>
            }
          >
            <TrainingFeePaymentPortal />
          </Suspense>
        </div>
      </section>
    </>
  );
}
