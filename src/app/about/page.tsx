import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Award, Scissors, Users, Sparkles, ArrowRight } from "lucide-react";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";
import { LocationMapSection } from "@/components/LocationMapSection";

export const metadata: Metadata = {
  title: "About Julihana Tomori & Our Ilorin Studio",
  description:
    "Founded in February 2018 by Creative Director Julihana Tomori, Julian House of Fashion Academy in Ilorin equips aspiring designers with practical pattern drafting and couture skills.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="lavender-glow border-b border-purple-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
                <Award className="h-3.5 w-3.5" />
                Established {SITE_CONFIG.foundedDateFull} in Ilorin
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold text-zinc-950 sm:text-5xl">
                Building Skills. Transforming Lives Through Fashion Education.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-zinc-700">
                Founded in {SITE_CONFIG.foundedDateFull} by Creative Director{" "}
                <strong className="text-zinc-950">{SITE_CONFIG.founder}</strong>,{" "}
                <strong>Julian House of Fashion</strong> began with a clear
                mission: bridge the gap between raw creativity and technical
                garment mastery in Kwara State.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">
                Located at{" "}
                <strong>{SITE_CONFIG.address.street}, Ilorin</strong>, our
                atelier operates simultaneously as a high-craft bespoke couture
                house and a structured vocational fashion academy. Students learn
                inside an active, real-world fashion studio equipped with brown
                pattern drafting tables, dress forms, and industrial sewing and
                overlock machines.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/academy"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-violet"
                >
                  View Academy Programmes
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={buildWhatsAppUrl(
                    "Hello Julian House of Fashion! I would like to schedule a studio tour in Ilorin."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-purple bg-white px-6 py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-lavender"
                >
                  Schedule a Studio Visit
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-white bg-brand-lavender shadow-2xl">
                <img
                  src="/images/jhf-profile-gown.png"
                  alt="Julian House of Fashion couture craftsmanship by Julihana Tomori"
                  className="h-auto w-full object-cover"
                />
                <div className="bg-brand-purple p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                    Founder &amp; Creative Director
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold">
                    {SITE_CONFIG.founder}
                  </p>
                  <p className="mt-1 text-xs text-purple-200">
                    Julian House of Fashion &amp; Academy • Ilorin, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Pillars */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lavender text-brand-purple">
                <Scissors className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-zinc-900">
                Pattern Drafting First
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                We teach structured pattern manipulation rather than risky
                guesswork—so our graduates get clean armholes, crisp trouser
                crotch curves, and balanced bustier fits every time.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lavender text-brand-purple">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-zinc-900">
                Cohort Mentorship
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Dedicated intake cohorts keep classes supportive and hands-on,
                giving every trainee direct feedback on stitching accuracy,
                lining techniques, and pressing.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lavender text-brand-purple">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-zinc-900">
                Women &amp; Men’s Tailoring
              </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                From womenswear bridals and corsetry to our specialised 4-month
                Male Fashion Design track (₦250,000), we prepare graduates for
                Nigeria’s highest-paying fashion niches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inside Our Ilorin Studio — Student Showcase */}
      <section className="border-t border-purple-100 bg-brand-cream/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
                <Sparkles className="h-3.5 w-3.5" />
                Studio Proof &amp; Student Outcomes
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
                Inside Our Ilorin Studio — Student Showcase
              </h2>
              <p className="mt-2 text-sm text-zinc-700 sm:text-base">
                Every student presents finished, wearable garments inside our
                Basin Road studio—from structured blazers and crisp crossover
                shirting to pearl-beaded cape couture.
              </p>
            </div>
            <Link
              href="/academy#student-projects"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-purple px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-violet"
            >
              Explore All 12 Student Pictorials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <figure className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
              <div className="aspect-[3/4] w-full overflow-hidden bg-brand-lavender">
                <img
                  src="/images/students/student-duo-satin-emerald.jpg"
                  alt="Students showcasing satin wrap top and emerald double-breasted suit in front of Julian House of Fashion wall crest"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                  Blazers, Shirting &amp; Trousers
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-zinc-900">
                  JHF Studio Crest Presentation
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Champagne satin bishop-sleeve wrap blouse &amp; wide-leg
                  trousers alongside an emerald belted blazer suit.
                </p>
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
              <div className="aspect-[3/4] w-full overflow-hidden bg-brand-lavender">
                <img
                  src="/images/students/student-white-crossover-shirt.jpg"
                  alt="Student in crisp white cross-front architectural wrap shirt and charcoal tailored trousers at Julian House of Fashion Ilorin"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                  Foundational Pattern Precision
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-zinc-900">
                  Architectural Crossover Shirting
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Two-piece collar stand converted into a clean pointed wrap hem
                  paired with tailored charcoal trousers.
                </p>
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
              <div className="aspect-[3/4] w-full overflow-hidden bg-brand-lavender">
                <img
                  src="/images/students/student-hotpink-cape-wings.jpg"
                  alt="Student displaying pearl-beaded hot pink midi dress with dramatic split cape sleeves in Ilorin studio"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                  Advanced Structural &amp; Beadwork
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-zinc-900">
                  Split Cape-Sleeve Couture
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Pearl-trimmed square neckline and floor-grazing cape sleeves
                  constructed during Advanced studio showcases.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <LocationMapSection />
    </>
  );
}
