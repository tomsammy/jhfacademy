import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  Heart,
  CheckCircle2,
  Sparkles,
  Phone,
  MapPin,
  ArrowDown,
  ShieldCheck,
  Download,
} from "lucide-react";
import { NextStitchForm } from "@/components/NextStitchForm";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";

export const metadata: Metadata = {
  title: "The Next Stitch Initiative — JHF Fashion Empowerment Initiative",
  description:
    "Because every talented girl deserves the right tools to sew her dreams. Nominate a deserving young girl or share your story to receive two sewing machines from Julian House of Fashion.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/next-stitch`,
  },
};

const ELIGIBILITY_CRITERIA = [
  "A young girl who has finished secondary school or is still in school and is learning tailoring.",
  "Learning under a roadside tailor or in a small shop.",
  "Has a genuine passion and willingness to learn.",
  "Cannot afford to attend a fashion school or purchase her own machine.",
];

const INITIATIVE_PRINCIPLES = [
  "Not a social media contest.",
  "No tagging or following required.",
  "Tell us the story of a girl you know — a passionate learner, an apprentice, or a secondary school girl with a dream.",
  "Both machines (manual sewing machine + overlock machine) go to ONE deserving girl. We are willing to reach wherever she is.",
];

export default function NextStitchPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="lavender-glow border-b border-purple-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
                <Heart className="h-3.5 w-3.5 text-brand-goldDark" />
                JHF Fashion Empowerment Initiative
              </span>
              <p className="mt-3 text-sm font-semibold italic text-brand-purple">
                &hellip;Sewing Hope. Creating Opportunities.
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                The Next Stitch{" "}
                <span className="text-brand-purple">Initiative</span>
              </h1>

              <p className="mt-4 max-w-2xl font-serif text-xl font-semibold text-zinc-800 sm:text-2xl">
                &ldquo;Because every talented girl deserves the right tools to
                sew her dreams.&rdquo;
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700">
                We are giving out{" "}
                <strong className="text-brand-purple">
                  TWO sewing machines to ONE deserving young girl
                </strong>{" "}
                who is learning fashion design but cannot afford a machine. She
                does not need to be on social media — you can tell us her story
                right here.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-zinc-800">
                {INITIATIVE_PRINCIPLES.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#share-story"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-brand-violet"
                >
                  <Sparkles className="h-4 w-4 text-brand-gold" />
                  Tell Us Her Story Now
                  <ArrowDown className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-purple bg-white px-6 py-3 text-sm font-bold text-brand-purple transition hover:bg-brand-lavender"
                >
                  <Phone className="h-4 w-4" />
                  Enquiries: 08022653399
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl shadow-purple-900/15">
                <img
                  src="/images/next-stitch/next-stitch-flier-qr.png"
                  alt="JHF Fashion Empowerment Initiative — The Next Stitch Initiative giving two sewing machines to one deserving young girl, with QR code"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                <a
                  href="/images/next-stitch/next-stitch-flier-qr.png"
                  download="JHF-Next-Stitch-Initiative-QR-Flier.png"
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-brand-purple shadow-sm transition hover:bg-brand-lavender"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Shareable Flier (QR)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Inspiration Section */}
      <section className="border-b border-purple-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-brand-lavender bg-white shadow-xl">
                <img
                  src="/images/next-stitch/the-inspiration.jpg"
                  alt="The Inspiration behind The Next Stitch Initiative by Julihana Tomori of Julian House of Fashion"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                The Inspiration
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
                How One Stored Sewing Machine Sparked a Purpose
              </h2>

              <div className="mt-5 space-y-4 rounded-3xl border border-purple-100 bg-brand-lavender/40 p-6 text-base leading-relaxed text-zinc-800 sm:p-8">
                <p>
                  Sometimes, the things that shape our journey begin long before
                  we even realise it.
                </p>
                <p>
                  My first sewing machine was bought by my mum. She had bought
                  it and kept it, and interestingly, having access to that
                  machine was one of the things that encouraged me to start
                  learning fashion.
                </p>
                <p className="rounded-xl bg-brand-purple px-4 py-3 font-serif text-lg font-semibold italic text-white">
                  By the time I started learning, she was no longer alive.
                </p>
                <p>
                  It made me realise how much difference the right tool can make
                  in someone&rsquo;s journey. And that is what inspires{" "}
                  <strong className="text-brand-purple">
                    The Next Stitch Initiative by JHF
                  </strong>
                  .
                </p>
                <p className="pt-1 text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                  — {SITE_CONFIG.founder}, Founder of Julian House of Fashion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is Qualified Section */}
      <section className="border-b border-purple-100 bg-brand-cream/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
                Who Is Qualified?
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
                Know Someone Like This? Tell Us Her Story.
              </h2>
              <p className="mt-3 text-base text-zinc-700">
                We are looking for one deserving young girl who meets the criteria
                below —{" "}
                <strong>she doesn&rsquo;t need to be on social media</strong>{" "}
                or post any video to be selected.
              </p>

              <div className="mt-6 space-y-3">
                {ELIGIBILITY_CRITERIA.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                    <p className="text-sm font-medium text-zinc-800 sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-brand-purple p-5 text-white">
                <MapPin className="h-5 w-5 shrink-0 text-brand-gold" />
                <p className="text-sm font-medium">
                  <strong className="text-brand-gold">
                    Both machines will go to ONE person.
                  </strong>{" "}
                  We are willing to reach wherever she is.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl">
                <img
                  src="/images/next-stitch/who-is-qualified-flier-qr.png"
                  alt="Who is qualified for The Next Stitch Initiative — young girl learning tailoring, with QR code"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                <a
                  href="/images/next-stitch/who-is-qualified-flier-qr.png"
                  download="JHF-Who-Is-Qualified-QR-Flier.png"
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-brand-purple shadow-sm transition hover:bg-brand-lavender"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Eligibility Flier (QR)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Submission Form Section */}
      <section id="share-story" className="lavender-glow py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <NextStitchForm />

          {/* Alternative contact & Admin link note */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-200 bg-white/90 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
              <p className="text-xs leading-relaxed text-zinc-600">
                Need help submitting a story for someone offline? Call or
                WhatsApp{" "}
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="font-bold text-brand-purple hover:underline"
                >
                  08022653399
                </a>{" "}
                or{" "}
                <a
                  href={buildWhatsAppUrl(
                    "Hello! I would like to nominate a deserving young girl for The Next Stitch Initiative."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline"
                >
                  chat with us on WhatsApp
                </a>
                .
              </p>
            </div>
            <Link
              href="/admin"
              className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-brand-purple hover:underline"
            >
              Admin Review Login →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
