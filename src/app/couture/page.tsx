import type { Metadata } from "next";
import React from "react";
import { Sparkles, CheckCircle2, MessageCircle } from "lucide-react";
import { LookbookGallery } from "@/components/LookbookGallery";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Bespoke Couture, Bridals, Aso-Ebi & Menswear in Ilorin",
  description:
    "Commission bespoke bridal gowns, beaded lace Aso-Ebi, Aso-Oke couture, structured women's blazers, and Senator menswear at Julian House of Fashion, 12 Alarape Street, off Basin Road, Ilorin.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/couture`,
  },
};

const COMMISSION_STEPS = [
  {
    step: "01",
    title: "Style Consultation",
    description:
      "Share your occasion, fabric preference, or inspiration photos with Creative Director Julihana Tomori via WhatsApp or at our Ilorin studio.",
  },
  {
    step: "02",
    title: "Exact Measurements & Pattern",
    description:
      "We take comprehensive anatomical measurements and draft a custom couture pattern engineered specifically for your body silhouette.",
  },
  {
    step: "03",
    title: "Structured Fitting",
    description:
      "Try on your garment before final beading and hem sealing so corsetry, sleeves, and waist balance sit with effortless poise.",
  },
  {
    step: "04",
    title: "Couture Delivery",
    description:
      "Pick up at our Basin Road studio or arrange dispatch across Nigeria—crisp, pressed, and ready for your celebration.",
  },
];

export default function CouturePage() {
  return (
    <>
      <section className="lavender-glow border-b border-purple-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <Sparkles className="h-3.5 w-3.5" />
              Bespoke Fashion Designer • Ilorin, Kwara State
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold text-zinc-950 sm:text-5xl">
              Bespoke Bridal, Aso-Ebi, Blazers &amp; Menswear
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-700 sm:text-lg">
              Every Julian House of Fashion garment is built on precision
              pattern architecture—combining Nigerian traditional elegance with
              crisp modern couture structure.
            </p>
            <div className="mt-7">
              <a
                href={buildWhatsAppUrl(
                  "Hello Julian House of Fashion! I would like to book a bespoke outfit consultation."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-violet"
              >
                <MessageCircle className="h-4 w-4 text-brand-gold" />
                Book Bespoke Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LookbookGallery />
        </div>
      </section>

      {/* Bespoke Process */}
      <section className="border-t border-purple-100 bg-brand-lavender/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
              Our 4-Step Bespoke Commission Process
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Whether you are in Ilorin or ordering remotely, your custom fit
              is handled with atelier care.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COMMISSION_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm"
              >
                <span className="font-serif text-3xl font-bold text-brand-goldDark">
                  {item.step}
                </span>
                <h3 className="mt-3 font-serif text-xl font-bold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-purple p-7 text-white sm:p-9">
            <div className="max-w-xl">
              <h3 className="font-serif text-2xl font-bold sm:text-3xl">
                Ordering Bridal Train or Aso-Ebi for an Event?
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-purple-100">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                Group bookings &amp; nationwide measurements accommodated.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(
                "Hello Julian House of Fashion! I would like to discuss bridal/Aso-Ebi group outfits."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              Chat With Us on WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
