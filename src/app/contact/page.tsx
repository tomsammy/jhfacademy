import type { Metadata } from "next";
import React from "react";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { ContactBookingForm } from "@/components/ContactBookingForm";
import { LocationMapSection } from "@/components/LocationMapSection";
import { SITE_CONFIG } from "@/data/siteData";

export const metadata: Metadata = {
  title: "Contact, Admissions & Directions in Ilorin",
  description:
    "Contact Julian House of Fashion Academy at 12 Alarape Street, off Basin Road, Ilorin, Kwara State. Call or WhatsApp +234 802 265 3399 for admissions and bespoke consultations.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="lavender-glow border-b border-purple-100 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple ring-1 ring-purple-200">
              <MapPin className="h-3.5 w-3.5" />
              Contact &amp; Studio Directions
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold text-zinc-950 sm:text-5xl">
              Visit or Contact Julian House of Fashion Academy
            </h1>
            <p className="mt-4 text-base text-zinc-700">
              For enquiries, further information, registration, or bespoke
              fittings, reach our Ilorin studio directly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Contact Info Cards */}
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-900">
                      Physical Studio Address
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      {SITE_CONFIG.address.full}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-900">
                      Call or WhatsApp
                    </h2>
                    <a
                      href={`tel:${SITE_CONFIG.phoneRaw}`}
                      className="mt-1 block text-base font-bold text-brand-purple hover:underline"
                    >
                      {SITE_CONFIG.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-900">
                      Email Desk
                    </h2>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="mt-1 block text-sm font-semibold text-brand-purple hover:underline"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-900">
                      Easy Directions in Ilorin
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Off Basin Road / Taoheed Road axis, easily accessible from{" "}
                      {SITE_CONFIG.landmarks.join(", ")}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-900">
                      Opening Hours
                    </h2>
                    <ul className="mt-1 space-y-1 text-sm text-zinc-600">
                      {SITE_CONFIG.hours.map((h) => (
                        <li key={h.days}>
                          <strong className="text-zinc-800">{h.days}:</strong>{" "}
                          {h.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <ContactBookingForm />
            </div>
          </div>
        </div>
      </section>

      <LocationMapSection />
    </>
  );
}
