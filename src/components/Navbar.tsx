"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MapPin, CreditCard } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE_CONFIG, ADDITIONAL_FEES } from "@/data/siteData";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/academy", label: "Academy & Fees" },
  { href: "/register", label: "Register Online" },
  { href: "/pay", label: "Pay Fees" },
  { href: "/couture", label: "Bespoke Couture" },
  { href: "/about", label: "About & Studio" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 backdrop-blur-md">
      {/* Top Announcement & Local SEO Strip */}
      <div className="bg-brand-purple px-4 py-2 text-center text-xs text-white sm:text-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-medium text-purple-100">
            <MapPin className="h-3.5 w-3.5 text-brand-gold" />
            12 Alarape Street, off Basin Road, Ilorin
          </span>
          <span className="hidden text-purple-300 md:inline">•</span>
          <span className="font-medium">
            Admissions Open • Reg: {ADDITIONAL_FEES.registrationFormatted} •
            Accommodation Available ({ADDITIONAL_FEES.accommodationFormatted}/3 mos)
          </span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300"
          >
            Register Online →
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Julian House of Fashion Academy Home"
          className="shrink-0"
        >
          <BrandLogo />
        </Link>

        <nav
          className="hidden items-center gap-3.5 lg:flex xl:gap-4 2xl:gap-6"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-xs font-semibold transition xl:text-[13px] 2xl:text-sm ${
                  active
                    ? "text-brand-purple underline decoration-brand-gold decoration-2 underline-offset-8"
                    : "text-zinc-700 hover:text-brand-purple"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            title={SITE_CONFIG.phoneDisplay}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-purple-200 px-3 py-2 text-xs font-semibold text-brand-purple transition hover:bg-brand-lavender"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden 2xl:inline">{SITE_CONFIG.phoneDisplay}</span>
            <span className="2xl:hidden">Call Studio</span>
          </a>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-purple px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-violet 2xl:px-4 2xl:text-sm"
          >
            <CreditCard className="h-4 w-4 text-brand-gold" />
            Register (₦10k)
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-purple-200 p-2 text-brand-purple lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-purple-100 bg-white px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-brand-lavender text-brand-purple"
                      : "text-zinc-700 hover:bg-purple-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 px-3 py-2.5 text-xs font-semibold text-brand-purple"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Studio
            </a>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-purple px-3 py-2.5 text-xs font-semibold text-white"
            >
              <CreditCard className="h-3.5 w-3.5 text-brand-gold" />
              Register (₦10k)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
