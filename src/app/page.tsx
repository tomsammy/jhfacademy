import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  MapPin,
  Scissors,
  Sparkles,
  Star,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { ProgramCards } from "@/components/ProgramCards";
import { TuitionCalculator } from "@/components/TuitionCalculator";
import { LookbookGallery } from "@/components/LookbookGallery";
import { FaqAccordion } from "@/components/FaqAccordion";
import { LocationMapSection } from "@/components/LocationMapSection";
import {
  SITE_CONFIG,
  ADDITIONAL_FEES,
  STUDENT_SPOTLIGHTS,
  buildWhatsAppUrl,
} from "@/data/siteData";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="lavender-glow relative overflow-hidden border-b border-purple-100 pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-purple shadow-sm">
                <MapPin className="h-3.5 w-3.5 text-brand-goldDark" />
                Ilorin’s Trusted Fashion School Since {SITE_CONFIG.foundedYear}
              </div>

              <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                Premier Fashion Design Academy &amp; Bespoke Couture in{" "}
                <span className="text-brand-purple">Ilorin</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-700 sm:text-lg">
                <strong className="font-semibold text-brand-purple">
                  {SITE_CONFIG.tagline}
                </strong>{" "}
                At Julian House of Fashion Academy, go from complete beginner to
                skilled fashion entrepreneur with structured pattern drafting,
                corsetry, bridal engineering, and male fashion design.
              </p>

              {/* Quick Fee Highlights */}
              <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-semibold text-zinc-800">
                <span className="rounded-lg border border-purple-200 bg-white px-3 py-1.5">
                  Tracks from <strong className="text-brand-purple">₦150,000</strong>
                </span>
                <span className="rounded-lg border border-purple-200 bg-white px-3 py-1.5">
                  Reg Fee:{" "}
                  <strong className="text-brand-purple">
                    {ADDITIONAL_FEES.registrationFormatted}
                  </strong>
                </span>
                <span className="rounded-lg border border-purple-200 bg-white px-3 py-1.5">
                  Accommodation:{" "}
                  <strong className="text-brand-purple">
                    {ADDITIONAL_FEES.accommodationFormatted} / 3 mos
                  </strong>
                </span>
              </div>

              {/* Primary CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#programs"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-brand-violet"
                >
                  <GraduationCap className="h-4 w-4 text-brand-gold" />
                  Explore Courses &amp; Fees
                </a>
                <a
                  href={buildWhatsAppUrl(
                    "Hello Julian House of Fashion! I would like to book a bespoke outfit or schedule an academy tour in Ilorin."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-purple bg-white px-6 py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-lavender"
                >
                  Book Bespoke Couture
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-xl">
                <div className="overflow-hidden rounded-3xl border-4 border-white bg-brand-lavender shadow-2xl shadow-purple-900/15">
                  <img
                    src="/images/jhf-banner-showcase.png"
                    alt="Julian House of Fashion bespoke bridal gown, beaded Aso-Ebi lace, and Ankara dresses in Ilorin"
                    className="h-auto w-full object-cover"
                  />
                </div>

                {/* Floating Founder & Craft Badge */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:absolute sm:-bottom-6 sm:left-4 sm:right-4 sm:mt-0">
                  <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/95 p-3.5 shadow-lg backdrop-blur">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-purple text-brand-gold">
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        100% Hands-On Studio
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Pattern drafting &amp; industrial machines
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/95 p-3.5 shadow-lg backdrop-blur">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-purple text-brand-gold">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        Led by {SITE_CONFIG.founder}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Est. {SITE_CONFIG.foundedDateFull} • Ilorin
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:mt-20 sm:grid-cols-4 sm:p-6">
            <div>
              <p className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
                Est. 2018
              </p>
              <p className="mt-0.5 text-xs font-medium text-zinc-600">
                Proven fashion education track record in Kwara State
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
                3 – 9 Mos
              </p>
              <p className="mt-0.5 text-xs font-medium text-zinc-600">
                Flexible Foundational, Intermediate, Advanced &amp; Male tracks
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
                ₦10,000
              </p>
              <p className="mt-0.5 text-xs font-medium text-zinc-600">
                One-time student registration fee
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-brand-purple sm:text-3xl">
                ₦50,000
              </p>
              <p className="mt-0.5 text-xs font-medium text-zinc-600">
                Comfortable accommodation (3 months) near studio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programme & Fees Section */}
      <section id="programs" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
              <Sparkles className="h-3.5 w-3.5" />
              Training Programme &amp; Fees
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-5xl">
              Structured Fashion Education From Beginner to Master
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              At Julian House of Fashion, every course combines precision
              pattern drafting with real industrial machine practice—so you
              graduate ready to earn.
            </p>
          </div>

          <div className="mt-12">
            <ProgramCards />
          </div>

          {/* Tuition Calculator */}
          <div className="mt-14">
            <TuitionCalculator />
          </div>
        </div>
      </section>

      {/* Student Transformations & Studio Proof */}
      <section className="bg-zinc-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Inside Our Ilorin Training Studio
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">
                Real Students. Real Pattern Drafting Mastery.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                From brown craft pattern paper and dress forms to high-speed
                industrial sewing machines, our cohort system (February &amp;
                August intakes) ensures individual attention.
              </p>
            </div>
            <a
              href={SITE_CONFIG.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/40 bg-white/5 px-5 py-3 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-zinc-950"
            >
              <Star className="h-4 w-4 fill-brand-gold" />
              Rate &amp; Review Us on Google
            </a>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STUDENT_SPOTLIGHTS.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/80 p-7"
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-gold" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-200">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-zinc-800 pt-4">
                  <p className="font-serif text-xl font-bold text-white">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-purple-300">
                    {item.cohort}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Focus: {item.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 rounded-3xl border border-purple-800/40 bg-brand-purple/30 p-6 sm:grid-cols-3 sm:p-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <div>
                <p className="font-bold text-white">Cutting Tables &amp; Pattern Paper</p>
                <p className="mt-1 text-xs text-purple-200">
                  Every garment begins with mathematical measurement drafting—zero
                  trial-and-error cutting.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <div>
                <p className="font-bold text-white">Industrial Sewing &amp; Overlock</p>
                <p className="mt-1 text-xs text-purple-200">
                  Train directly on studio-grade industrial machines and dress
                  forms used in luxury fashion houses.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
              <div>
                <p className="font-bold text-white">Batch Graduation Projects</p>
                <p className="mt-1 text-xs text-purple-200">
                  Graduate with portfolio-worthy garments you personally drafted,
                  cut, stitched, and finished.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Couture Lookbook */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
              Bespoke Fashion &amp; Couture
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-5xl">
              Custom Bridal, Aso-Ebi, Aso-Oke &amp; Blazers
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Alongside our academy, Julian House of Fashion creates
              head-turning custom outfits for weddings, celebrations, and
              corporate professionals across Ilorin and Nigeria.
            </p>
          </div>

          <div className="mt-10">
            <LookbookGallery limit={6} />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/couture"
              className="inline-flex items-center gap-2 rounded-full border border-brand-purple px-7 py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-purple hover:text-white"
            >
              Explore Full Bespoke Couture Showcase
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Local SEO FAQ */}
      <section className="border-t border-purple-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="rounded-full bg-brand-lavender px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
              Admissions &amp; Studio FAQs
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Everything you need to know about enrolling at Julian House of
              Fashion Academy in Ilorin, Kwara State.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* Google Maps & NAP Section */}
      <LocationMapSection />
    </>
  );
}
