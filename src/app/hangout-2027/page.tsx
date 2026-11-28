import type { Metadata } from "next";
import React, { Suspense } from "react";
import {
  ArrowDown,
  Award,
  Briefcase,
  Calendar,
  Cpu,
  Gamepad2,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { HangoutRegistrationPortal } from "@/components/HangoutRegistrationPortal";
import { SITE_CONFIG } from "@/data/siteData";

export const metadata: Metadata = {
  title:
    "JHF Hangout 2027 — AI & Technology Integration in Fashion | Julian House of Fashion",
  description:
    "Register for JHF Hangout 2027 on Saturday, January 9, 2027 in Ilorin or Online! Theme: AI & Technology Integration in Fashion and Positioning for Profit in 2027. Physical ₦10,000, Online ₦5,000.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/hangout-2027`,
  },
  openGraph: {
    title: "JHF Hangout 2027 — AI & Technology Integration in Fashion",
    description:
      "Saturday, January 9, 2027 • Ilorin & Online. With Special Guest Speaker Johnson (Oluwagbenga) Aluko & Host Tomori Toluwase Julihana. Physical ₦10k | Online ₦5k.",
    images: ["/images/hangout-2027/hangout-2027-main.jpg"],
  },
};

const HIGHLIGHTS = [
  {
    icon: Cpu,
    title: "AI & Fashion Technology",
    description:
      "Discover practical ways to integrate AI tools into design workflows, styling, customer service, and content creation.",
    cardClass:
      "border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-indigo-50",
    iconClass: "bg-gradient-to-br from-blue-600 to-cyan-500 text-white",
  },
  {
    icon: TrendingUp,
    title: "Positioning for Profit in 2027",
    description:
      "Move beyond just stitching — learn modern business systems, branding, and digital leverage to scale fashion income.",
    cardClass:
      "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    iconClass: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  },
  {
    icon: Users,
    title: "Networking & Connection",
    description:
      "Meet fellow fashion designers, students, tailors, and creative entrepreneurs building thriving businesses.",
    cardClass:
      "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-violet-50",
    iconClass: "bg-gradient-to-br from-purple-700 to-violet-600 text-white",
  },
  {
    icon: Gamepad2,
    title: "Games, Laughter & Vibes",
    description:
      "No boring seminar — just learning made fun! Relax, unwind, win prizes, laugh, and start 2027 inspired.",
    cardClass:
      "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-white to-pink-50",
    iconClass: "bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white",
  },
];

export default function Hangout2027Page() {
  return (
    <>
      {/* Colorful Gradient Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-fuchsia-900 to-indigo-950 py-14 text-white sm:py-20">
        {/* Vibrant Decorative Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-amber-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/3 top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Julian House of Fashion Presents
              </div>

              <h1 className="mt-4 font-serif text-5xl font-extrabold leading-none tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-white">JHF HANGOUT</span>{" "}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  2027
                </span>
              </h1>

              <div className="mt-5 rounded-2xl border border-amber-300/40 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  Theme
                </p>
                <p className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
                  AI &amp; Technology Integration in Fashion and Positioning for
                  Profit in 2027
                </p>
              </div>

              <p className="mt-4 text-base leading-relaxed text-purple-100">
                Fashion people, are we ready for 2027? AI and technology are
                changing the game, and we can&rsquo;t afford to be left behind
                while perfecting our stitches. Join fashion designers,
                entrepreneurs, students, and lovers of fashion for{" "}
                <strong className="text-amber-200">
                  Relax • Connect • Learn
                </strong>
                !
              </p>

              {/* Event Facts Badges */}
              <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-white backdrop-blur">
                  <Calendar className="h-3.5 w-3.5 text-amber-300" />
                  Saturday, January 9, 2027
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-white backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                  Ilorin &amp; Online
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-500 px-3.5 py-2 text-white shadow">
                  Physical: ₦10,000
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-white shadow">
                  Online (AI/Tech): ₦5,000
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="#register-ticket"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-7 py-3.5 text-sm font-extrabold text-zinc-950 shadow-xl shadow-amber-500/25 transition hover:scale-[1.02]"
                >
                  Register &amp; Pay Now
                  <ArrowDown className="h-4 w-4" />
                </a>
                <a
                  href="#guest-speaker"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Meet Speaker &amp; Host
                </a>
              </div>
            </div>

            {/* Right Visual Fliers */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3.5 rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
                <div className="overflow-hidden rounded-2xl border-2 border-amber-300/70 bg-purple-950">
                  <img
                    src="/images/hangout-2027/hangout-2027-main.jpg"
                    alt="JHF Hangout 2027 main event flier with Guest Speaker Johnson Aluko and Host Tomori Toluwase Julihana"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border-2 border-cyan-300/70 bg-purple-950">
                  <img
                    src="/images/hangout-2027/hangout-2027-details.jpg"
                    alt="JHF Hangout 2027 details — Relax Connect Learn, Physical ₦10,000, Online ₦5,000 on Saturday January 9, 2027"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Experience Highlights */}
      <section className="border-b border-purple-100 bg-gradient-to-b from-white via-purple-50/40 to-amber-50/30 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              No Boring Seminar — Just Learning Made Fun!
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-5xl">
              Unwind, Upgrade &amp; Grow Together
            </h2>
            <p className="mt-3 text-base text-zinc-700">
              Let&rsquo;s not just enter 2027 with new designs —{" "}
              <strong className="text-brand-purple">
                let&rsquo;s enter with new knowledge!
              </strong>
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-3xl border-2 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${item.cardClass}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md ${item.iconClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guest Speaker & Host Section */}
      <section id="guest-speaker" className="border-b border-purple-100 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
              Connect • Learn • Grow
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
              Meet Our Special Guest Speaker &amp; Host
            </h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* Guest Speaker Card */}
            <div className="overflow-hidden rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/70 via-white to-cyan-50/60 p-6 shadow-md sm:p-8 lg:col-span-7">
              <div className="grid items-center gap-6 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <div className="aspect-[4/4.3] overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                    <img
                      src="/images/hangout-2027/speaker-johnson-aluko.jpg"
                      alt="Johnson (Oluwagbenga) Aluko — Special Guest Speaker at JHF Hangout 2027"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="sm:col-span-7">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-950">
                    <Briefcase className="h-3.5 w-3.5" />
                    Special Guest Speaker
                  </span>
                  <h3 className="mt-2.5 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
                    Johnson (Oluwagbenga) Aluko
                  </h3>
                  <p className="mt-0.5 text-xs font-bold text-brand-purple">
                    Entrepreneur • Business Leader • Technology Enthusiast
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    Passionate about building platforms that create meaningful
                    impact. Founder &amp; Lead Visionary of{" "}
                    <strong>GiftAGoal</strong> and <strong>9jaTrip</strong>, and
                    Co-Founder &amp; CEO of <strong>Ceresense</strong>, with
                    experience across education, mobility, logistics, and
                    technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Host Card */}
            <div className="overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-fuchsia-50/70 p-6 shadow-md sm:p-8 lg:col-span-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-start">
                <div className="flex items-center gap-4">
                  <div className="aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                    <img
                      src="/images/hangout-2027/host-tomori-julihana.jpg"
                      alt="Tomori Toluwase Julihana — Host of JHF Hangout 2027"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-purple px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                      <Award className="h-3.5 w-3.5" />
                      Event Host
                    </span>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-zinc-950">
                      Tomori Toluwase Julihana
                    </h3>
                    <p className="text-xs font-semibold text-brand-purple">
                      Founder &amp; Creative Director, Julian House of Fashion
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700">
                  Leading Ilorin&rsquo;s creative fashion community into 2027
                  with confidence — blending timeless tailoring craft, business
                  excellence, and modern digital tools so designers profit
                  sustainably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Registration & Paystack Checkout Section */}
      <section
        id="register-ticket"
        className="bg-gradient-to-br from-purple-100/80 via-fuchsia-50/70 to-amber-50/80 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-purple-200 bg-white p-10 text-center text-sm text-zinc-500">
                Loading JHF Hangout 2027 registration form...
              </div>
            }
          >
            <HangoutRegistrationPortal />
          </Suspense>
        </div>
      </section>
    </>
  );
}
