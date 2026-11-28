"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Laptop,
  Link as LinkIcon,
  MapPin,
  Printer,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { SITE_CONFIG, buildWhatsAppUrl } from "@/data/siteData";
import type { HangoutRegistration, HangoutTicketType } from "@/lib/db";

const TICKET_OPTIONS: {
  id: HangoutTicketType;
  title: string;
  subtitle: string;
  priceNaira: number;
  priceLabel: string;
  badge: string;
  perks: string[];
  accentBorder: string;
  accentBg: string;
}[] = [
  {
    id: "physical",
    title: "Physical Experience (Ilorin)",
    subtitle: "In-person Hangout • All games, networking & AI/Tech session",
    priceNaira: 10000,
    priceLabel: "₦10,000",
    badge: "Full Hangout Pass",
    perks: [
      "Live interactive session with Johnson (Oluwagbenga) Aluko",
      "Networking with fashion designers, students & founders",
      "Games, laughter, refreshments & good vibes",
      "Secret Ilorin venue sent directly after payment",
    ],
    accentBorder: "border-fuchsia-500 ring-2 ring-fuchsia-200",
    accentBg:
      "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-amber-600 text-white",
  },
  {
    id: "online",
    title: "Online Access (AI / Tech Session)",
    subtitle: "Join the live AI & Fashion Technology session from anywhere",
    priceNaira: 5000,
    priceLabel: "₦5,000",
    badge: "Virtual Live Pass",
    perks: [
      "Live stream of the AI & Technology in Fashion keynote",
      "Interactive Q&A with our Guest Tech Pro",
      "Replay / session takeaways shared on WhatsApp",
      "Stream access link sent directly before Jan 9, 2027",
    ],
    accentBorder: "border-cyan-500 ring-2 ring-cyan-200",
    accentBg:
      "bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-600 text-white",
  },
];

const FASHION_ROLES = [
  "Fashion Designer",
  "Aspiring Fashion Student",
  "Tailor / Pattern Maker",
  "Fashion Entrepreneur / Brand Owner",
  "Fashion Lover / Enthusiast",
  "Other",
] as const;

const STORAGE_KEY = "jhf_hangout_2027_ticket_v1";
const PENDING_KEY = "jhf_hangout_2027_pending_v1";

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function HangoutRegistrationPortal() {
  const searchParams = useSearchParams();

  const [ticketType, setTicketType] = useState<HangoutTicketType>("physical");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("Ilorin");
  const [fashionRole, setFashionRole] = useState<string>(FASHION_ROLES[0]);
  const [questionNote, setQuestionNote] = useState("");

  const [paystackReady, setPaystackReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<HangoutRegistration | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedPlan =
    TICKET_OPTIONS.find((t) => t.id === ticketType) ?? TICKET_OPTIONS[0];
  const isLiveKey = Boolean(
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.startsWith("pk_live_")
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.PaystackPop) {
      setPaystackReady(true);
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );
      if (existing) {
        existing.addEventListener("load", () => setPaystackReady(true));
      } else {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => setPaystackReady(true);
        document.body.appendChild(script);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTicket(JSON.parse(saved) as HangoutRegistration);
    } catch {
      // Ignore storage read issues
    }

    const qTicket = searchParams.get("pass");
    if (qTicket === "online" || qTicket === "physical") {
      setTicketType(qTicket);
    }

    const ref = searchParams.get("reference") || searchParams.get("trxref");
    if (ref) {
      void confirmPaidReference(ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmPaidReference(
    reference: string,
    fallbackForm?: {
      ticketType: HangoutTicketType;
      fullName: string;
      phoneNumber: string;
      whatsappNumber: string;
      emailAddress: string;
      city: string;
      fashionRole: string;
      questionNote: string;
    }
  ) {
    setIsProcessing(true);
    setError(null);
    try {
      let pendingMeta = fallbackForm;
      if (!pendingMeta && typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(PENDING_KEY);
          if (raw) pendingMeta = JSON.parse(raw);
          localStorage.removeItem(PENDING_KEY);
        } catch {
          // Ignore
        }
      }

      const res = await fetch("/api/hangout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          ...pendingMeta,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.registration) {
        setError(
          data?.error ||
            "Could not verify Paystack payment yet. Please contact us on WhatsApp if debited."
        );
        return;
      }

      const confirmed = data.registration as HangoutRegistration;
      setTicket(confirmed);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmed));
      } catch {
        // Ignore
      }

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("reference");
        url.searchParams.delete("trxref");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      setError("Network error while confirming your Hangout payment.");
    } finally {
      setIsProcessing(false);
    }
  }

  const copyEventUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE_CONFIG.domain}/hangout-2027`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Ignore
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (sameAsPhone) setWhatsappNumber(val);
  };

  const handleSameAsPhone = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) setWhatsappNumber(phoneNumber);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your Full Name.");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      setError("Please enter a valid Phone Number.");
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 7) {
      setError(
        "Please enter an active WhatsApp Number so we can send your Ilorin venue or online link."
      );
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError("Paystack public key is not configured.");
      return;
    }

    setIsProcessing(true);
    try {
      const cleanEmail = emailAddress.trim();
      const effectiveEmail = cleanEmail.includes("@")
        ? cleanEmail
        : `hangout.${Date.now()}@jhfacademy.com.ng`;

      const formPayload = {
        ticketType,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim(),
        emailAddress: cleanEmail,
        city: city.trim() || "Ilorin",
        fashionRole,
        questionNote: questionNote.trim(),
      };

      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: effectiveEmail,
          amountNaira: selectedPlan.priceNaira,
          callbackUrl: `${window.location.origin}/hangout-2027`,
          metadata: {
            purpose: "hangout-2027",
            event: "JHF Hangout 2027",
            ...formPayload,
          },
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok || !initData.status) {
        setError(initData.message || "Unable to start Paystack payment.");
        setIsProcessing(false);
        return;
      }

      const { reference, authorization_url } = initData.data;

      // Immediately log prospect details into database before opening Paystack modal
      // so abandoned checkouts are still captured in /admin for follow-up.
      try {
        await fetch("/api/hangout/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            ...formPayload,
          }),
        });
      } catch {
        // Non-blocking: do not stop Paystack checkout if lead ping fails
      }

      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify(formPayload));
      } catch {
        // Ignore
      }

      if (paystackReady && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: effectiveEmail,
          amount: selectedPlan.priceNaira * 100,
          currency: "NGN",
          ref: reference,
          metadata: {
            purpose: "hangout-2027",
            ...formPayload,
          },
          callback: (response: { reference: string }) => {
            void confirmPaidReference(response.reference, formPayload);
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });
        handler.openIframe();
      } else if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        setError("Payment modal could not load. Please refresh and try again.");
        setIsProcessing(false);
      }
    } catch {
      setError("Network error while connecting to Paystack. Please try again.");
      setIsProcessing(false);
    }
  };

  if (ticket) {
    const isPhysical = ticket.ticketType === "physical";
    return (
      <div className="print-card overflow-hidden rounded-3xl border-4 border-amber-300 bg-white shadow-2xl shadow-purple-950/20">
        {/* Vibrant Ticket Header */}
        <div
          className={`p-7 text-white sm:p-9 ${
            isPhysical
              ? "bg-gradient-to-r from-purple-950 via-fuchsia-800 to-amber-600"
              : "bg-gradient-to-r from-indigo-950 via-blue-800 to-cyan-600"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-200 backdrop-blur">
                <Ticket className="h-3.5 w-3.5" />
                Official Confirmed Pass
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                JHF HANGOUT 2027
              </h2>
              <p className="mt-1 text-sm text-purple-100">
                AI &amp; Technology Integration in Fashion &amp; Positioning for
                Profit in 2027
              </p>
            </div>

            <div className="rounded-2xl border border-white/30 bg-black/25 px-5 py-3 text-left backdrop-blur sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
                Ticket Pass Code
              </p>
              <p className="font-mono text-2xl font-extrabold text-white">
                {ticket.ticketCode}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid {formatNaira(ticket.amountNaira)}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-9">
          <div className="grid gap-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-amber-50/40 p-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Attendee Name
              </p>
              <p className="mt-0.5 font-serif text-xl font-bold text-zinc-950">
                {ticket.fullName}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Pass Type
              </p>
              <p className="mt-0.5 text-sm font-bold text-brand-purple">
                {isPhysical
                  ? "Physical Experience (₦10,000)"
                  : "Online Live Session (₦5,000)"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Event Date &amp; City
              </p>
              <p className="mt-0.5 text-sm font-bold text-zinc-900">
                Saturday, Jan 9, 2027 • {isPhysical ? "Ilorin" : "Online"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Phone / WhatsApp
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-800">
                {ticket.whatsappNumber}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Role &amp; City
              </p>
              <p className="mt-0.5 text-sm text-zinc-800">
                {ticket.fashionRole} • {ticket.city}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Paystack Reference
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-zinc-600">
                {ticket.paystackReference}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <strong className="block">What Happens Next:</strong>
            {isPhysical
              ? "Your seat for JHF Hangout 2027 in Ilorin is confirmed! Our team will send the exclusive physical venue details directly to your WhatsApp number before the event."
              : "Your online access spot is confirmed! We will send your private live-stream joining link directly to your WhatsApp/email ahead of Saturday, January 9, 2027."}
          </div>

          <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-violet"
              >
                <Printer className="h-4 w-4 text-brand-gold" />
                Print / Save Pass
              </button>
              <a
                href={buildWhatsAppUrl(
                  `Hello JHF! I just registered and paid for JHF Hangout 2027 (${
                    isPhysical ? "Physical ₦10,000" : "Online ₦5,000"
                  }). Ticket Code: ${ticket.ticketCode}, Name: ${ticket.fullName}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Confirm on WhatsApp →
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setTicket(null);
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {
                  // Ignore
                }
              }}
              className="text-xs font-bold text-brand-purple hover:underline"
            >
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handlePaySubmit}
      className="overflow-hidden rounded-3xl border-2 border-purple-200 bg-white shadow-2xl shadow-purple-950/15"
    >
      {/* Colorful Top Ribbon */}
      <div className="bg-gradient-to-r from-purple-900 via-fuchsia-700 to-amber-500 px-6 py-5 text-white sm:px-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Instant Registration + Paystack Checkout
            </span>
            <h2 className="mt-1.5 font-serif text-2xl font-bold sm:text-3xl">
              Reserve Your Spot for Hangout 2027
            </h2>
          </div>

          <button
            type="button"
            onClick={copyEventUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-3.5 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-amber-200" />
                Event Link Copied
              </>
            ) : (
              <>
                <LinkIcon className="h-3.5 w-3.5 text-amber-200" />
                Copy Event Link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-7 p-6 sm:p-9">
        {/* Step 1: Pass Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-purple">
            Step 1 • Choose Your Ticket Pass{" "}
            <span className="text-red-600">*</span>
          </label>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {TICKET_OPTIONS.map((opt) => {
              const selected = ticketType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTicketType(opt.id)}
                  className={`flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition ${
                    selected
                      ? `${opt.accentBorder} bg-gradient-to-br from-white via-purple-50/70 to-amber-50/50 shadow-lg`
                      : "border-zinc-200 bg-white hover:border-purple-300"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          selected
                            ? opt.accentBg
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {opt.id === "physical" ? (
                          <Users className="h-3.5 w-3.5" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5" />
                        )}
                        {opt.badge}
                      </span>
                      <span className="font-serif text-3xl font-extrabold text-zinc-950">
                        {opt.priceLabel}
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-xl font-bold text-zinc-950">
                      {opt.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600">{opt.subtitle}</p>

                    <ul className="mt-3.5 space-y-1.5 text-xs text-zinc-700">
                      {opt.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-purple-100 pt-3 text-xs font-bold text-brand-purple">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        selected
                          ? "border-brand-purple bg-brand-purple text-white"
                          : "border-zinc-300"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {selected ? "Selected Pass" : "Click to Select"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Simple Attendee Details */}
        <div className="space-y-4 border-t border-purple-100 pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-purple">
            Step 2 • Your Details
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="hangout-name"
                className="block text-sm font-semibold text-zinc-900"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="hangout-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label
                htmlFor="hangout-phone"
                className="block text-sm font-semibold text-zinc-900"
              >
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                id="hangout-phone"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 0803 123 4567"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="hangout-whatsapp"
                  className="block text-sm font-semibold text-zinc-900"
                >
                  WhatsApp Number <span className="text-red-600">*</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-brand-purple">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => handleSameAsPhone(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-purple-300 text-brand-purple"
                  />
                  Same as Phone
                </label>
              </div>
              <input
                id="hangout-whatsapp"
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => {
                  setSameAsPhone(false);
                  setWhatsappNumber(e.target.value);
                }}
                placeholder="For venue / stream link delivery"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label
                htmlFor="hangout-email"
                className="block text-sm font-semibold text-zinc-900"
              >
                Email Address{" "}
                <span className="text-xs font-normal text-zinc-500">
                  (Optional, for e-receipt)
                </span>
              </label>
              <input
                id="hangout-email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label
                htmlFor="hangout-city"
                className="block text-sm font-semibold text-zinc-900"
              >
                City / Location <span className="text-red-600">*</span>
              </label>
              <input
                id="hangout-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Ilorin, Kwara State"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="hangout-role"
                className="block text-sm font-semibold text-zinc-900"
              >
                I Am Attending As <span className="text-red-600">*</span>
              </label>
              <select
                id="hangout-role"
                value={fashionRole}
                onChange={(e) => setFashionRole(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                {FASHION_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="hangout-question"
                className="block text-sm font-semibold text-zinc-900"
              >
                What Would You Love to Learn About AI &amp; Tech in Fashion?{" "}
                <span className="text-xs font-normal text-zinc-500">
                  (Optional)
                </span>
              </label>
              <input
                id="hangout-question"
                type="text"
                value={questionNote}
                onChange={(e) => setQuestionNote(e.target.value)}
                placeholder="e.g. How to use AI for design inspiration, pricing, or marketing my brand"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Payment Summary & Paystack CTA */}
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-fuchsia-50/50 to-amber-50/70 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Selected Pass •{" "}
                {isLiveKey ? "Live Paystack" : "Paystack Checkout"}
              </p>
              <p className="mt-0.5 font-serif text-2xl font-bold text-zinc-950">
                {selectedPlan.title} —{" "}
                <span className="text-brand-purple">
                  {selectedPlan.priceLabel}
                </span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                <Calendar className="h-3.5 w-3.5 text-brand-purple" />
                Saturday, January 9, 2027 •{" "}
                <MapPin className="h-3.5 w-3.5 text-fuchsia-600" />
                {selectedPlan.id === "physical" ? "Ilorin" : "Live Online"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-purple via-fuchsia-700 to-amber-500 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-purple-900/25 transition hover:scale-[1.01] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Opening Paystack...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-amber-200" />
                  Pay {selectedPlan.priceLabel} with Paystack →
                </>
              )}
            </button>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-600">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            Secured by Paystack • Card, Bank Transfer &amp; USSD accepted •
            Instant confirmed ticket pass upon payment.
          </p>
        </div>
      </div>
    </form>
  );
}
