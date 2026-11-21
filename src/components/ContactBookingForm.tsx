"use client";

import React, { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import {
  TRAINING_PROGRAMS,
  SITE_CONFIG,
  buildWhatsAppUrl,
} from "@/data/siteData";

export function ContactBookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Academy Admission");
  const [programme, setProgramme] = useState(TRAINING_PROGRAMS[0].title);
  const [accommodation, setAccommodation] = useState("No");
  const [message, setMessage] = useState("");

  const compiledText = [
    `Hello Julian House of Fashion Academy!`,
    `Inquiry Type: ${inquiryType}`,
    `Full Name: ${name.trim() || "Not provided"}`,
    `Phone / WhatsApp: ${phone.trim() || "Not provided"}`,
    inquiryType === "Academy Admission" ? `Programme: ${programme}` : null,
    inquiryType === "Academy Admission"
      ? `Needs Accommodation (₦50,000 / 3 mos): ${accommodation}`
      : null,
    `Message: ${message.trim() || "Please share admission / booking details."}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = buildWhatsAppUrl(compiledText);
  const mailtoUrl = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
    `[jhfacademy.com.ng] ${inquiryType} — ${name || "New Inquiry"}`
  )}&body=${encodeURIComponent(compiledText)}`;

  return (
    <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-zinc-900 sm:text-3xl">
        Book an Appointment or Send an Inquiry
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        All studio visits and consultations are strictly{" "}
        <strong className="text-brand-purple">by appointment</strong> (Mon – Fri,
        9:00 AM – 5:00 PM; closed on weekends). Fill in your details below to
        message our studio desk (+234 802 265 3399).
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0803 000 0000"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Inquiry Type
            </label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
            >
              <option value="Academy Admission">Academy Admission</option>
              <option value="Bespoke Outfit / Bridal">
                Bespoke Outfit / Bridal
              </option>
              <option value="Studio Tour in Ilorin">Studio Tour in Ilorin</option>
            </select>
          </div>

          {inquiryType === "Academy Admission" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Course Track
              </label>
              <select
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
              >
                {TRAINING_PROGRAMS.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title} ({p.priceFormatted})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {inquiryType === "Academy Admission" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Need Student Accommodation (₦50,000 / 3 Months)?
            </label>
            <div className="flex gap-3">
              {["No", "Yes"].map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setAccommodation(choice)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                    accommodation === choice
                      ? "bg-brand-purple text-white"
                      : "border border-zinc-200 bg-white text-zinc-700"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Questions or Measurements Note
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us when you'd like to resume, or describe the bespoke outfit you want..."
            className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-violet"
          >
            <MessageCircle className="h-4 w-4 text-brand-gold" />
            Send Inquiry via WhatsApp
          </a>
          <a
            href={mailtoUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-3.5 text-sm font-semibold text-brand-purple transition hover:bg-brand-lavender"
          >
            <Mail className="h-4 w-4" />
            Send via Email
          </a>
        </div>
      </div>
    </div>
  );
}
