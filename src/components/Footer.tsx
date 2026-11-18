import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Star,
  ExternalLink,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_CONFIG, ADDITIONAL_FEES, buildWhatsAppUrl } from "@/data/siteData";

export function Footer() {
  return (
    <footer className="border-t border-purple-900/20 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo variant="light" showTagline />
            <p className="text-sm leading-relaxed text-zinc-400">
              {SITE_CONFIG.tagline} A premier fashion design school and bespoke
              couture studio founded by{" "}
              <strong className="text-white">{SITE_CONFIG.founder}</strong> in{" "}
              {SITE_CONFIG.foundedDateFull}.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-brand-gold hover:text-white"
              >
                <Facebook className="h-3.5 w-3.5 text-purple-300" />
                Facebook
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-brand-gold hover:text-white"
              >
                <Instagram className="h-3.5 w-3.5 text-purple-300" />
                Instagram
              </a>
            </div>
          </div>

          {/* Training Programmes */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Academy Programmes
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/academy#foundational-class"
                  className="hover:text-brand-gold"
                >
                  Foundational Class — ₦150,000 (3 mos)
                </Link>
              </li>
              <li>
                <Link
                  href="/academy#intermediate-class"
                  className="hover:text-brand-gold"
                >
                  Intermediate Class — ₦150,000 (3 mos)
                </Link>
              </li>
              <li>
                <Link
                  href="/academy#advanced-class"
                  className="hover:text-brand-gold"
                >
                  Advanced Class — ₦200,000 (3 mos)
                </Link>
              </li>
              <li>
                <Link
                  href="/academy#full-programme"
                  className="font-semibold text-purple-200 hover:text-brand-gold"
                >
                  Full 9-Month Programme — ₦500,000
                </Link>
              </li>
              <li>
                <Link
                  href="/academy#male-fashion-design"
                  className="hover:text-brand-gold"
                >
                  Male Fashion Design — ₦250,000 (4 mos)
                </Link>
              </li>
              <li className="pt-1 text-xs text-zinc-400">
                Reg Fee: {ADDITIONAL_FEES.registrationFormatted} • Accommodation:{" "}
                {ADDITIONAL_FEES.accommodationFormatted} / 3 mos
              </li>
            </ul>
          </div>

          {/* Quick Links & Couture */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Explore JHF
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/academy" className="hover:text-brand-gold">
                  Training Curriculum & Fees
                </Link>
              </li>
              <li>
                <Link
                  href="/next-stitch"
                  className="font-semibold text-brand-gold hover:underline"
                >
                  The Next Stitch Initiative
                </Link>
              </li>
              <li>
                <Link href="/couture" className="hover:text-brand-gold">
                  Bespoke Bridals, Aso-Ebi & Blazers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold">
                  About Julihana Tomori & Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold">
                  Admissions & Ilorin Directions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-400 hover:text-brand-gold">
                  Admin Login
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href={SITE_CONFIG.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline"
                >
                  <Star className="h-3.5 w-3.5 fill-brand-gold" />
                  Review Us on Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Exact NAP for Google Business Profile */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Visit Our Ilorin Studio
            </h3>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{SITE_CONFIG.address.full}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="font-medium text-white hover:text-brand-gold"
                >
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-brand-gold"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <div className="text-xs text-zinc-400">
                  <p>Mon – Fri: 9:00 AM – 5:00 PM</p>
                  <p>Saturday: 10:00 AM – 4:00 PM</p>
                </div>
              </div>
            </address>
            <div className="mt-4">
              <a
                href={buildWhatsAppUrl(
                  "Hello Julian House of Fashion Academy, I would like directions / more info about registering."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-brand-purple px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-violet"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Service Areas & Copyright */}
        <div className="mt-12 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
          <p className="mb-3">
            <strong className="text-zinc-400">Serving Ilorin & Kwara State:</strong>{" "}
            {SITE_CONFIG.landmarks.join(" • ")} • Available across Nigeria with
            on-site student accommodation.
          </p>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {SITE_CONFIG.name} (
              {SITE_CONFIG.shortName}). All rights reserved.
            </p>
            <p>Official Domain: jhfacademy.com.ng</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
