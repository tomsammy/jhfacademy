import React from "react";
import { MapPin, Phone, Clock, Navigation, Star } from "lucide-react";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";

export function LocationMapSection() {
  return (
    <section className="bg-brand-lavender/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Local NAP Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-purple-200 bg-white p-7 shadow-sm lg:col-span-5 sm:p-9">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
                <MapPin className="h-3.5 w-3.5" />
                Visit Julian House of Fashion Academy
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-zinc-900 sm:text-4xl">
                Find Our Fashion School in Ilorin
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Walk into our physical training studio off Basin Road to tour
                our industrial sewing floor, view student projects, or take your
                bespoke measurements.
              </p>

              <div className="mt-6 space-y-4 border-t border-purple-100 pt-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <p className="font-bold text-zinc-900">Studio Address</p>
                    <p className="text-zinc-600">{SITE_CONFIG.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <p className="font-bold text-zinc-900">
                      Nearby Ilorin Landmarks
                    </p>
                    <p className="text-zinc-600">
                      Minutes from {SITE_CONFIG.landmarks.join(", ")}.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <p className="font-bold text-zinc-900">
                      Phone & WhatsApp Desk
                    </p>
                    <a
                      href={`tel:${SITE_CONFIG.phoneRaw}`}
                      className="font-semibold text-brand-purple hover:underline"
                    >
                      {SITE_CONFIG.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div>
                    <p className="font-bold text-zinc-900">Studio Hours</p>
                    <p className="text-zinc-600">
                      Mon – Fri: 9:00 AM – 5:00 PM • Weekends: Closed (Bookings by
                      Appointment)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(
                  "Hello JHF Academy! Please share your Google Maps pin and studio visit availability."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-violet"
              >
                Book a Studio Visit
              </a>
              <a
                href={SITE_CONFIG.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-brand-purple transition hover:bg-brand-lavender"
              >
                <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                Google Maps & Reviews
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="min-h-[380px] overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-sm lg:col-span-7">
            <iframe
              title="Julian House of Fashion Academy Location Map — 12 Alarape Street, off Basin Road, Ilorin"
              src={SITE_CONFIG.googleMapsEmbedUrl}
              className="h-full min-h-[380px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
