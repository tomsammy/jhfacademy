"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/siteData";

export function FloatingWhatsApp() {
  const url = buildWhatsAppUrl(
    "Hello Julian House of Fashion Academy! I visited jhfacademy.com.ng and would like to inquire about fashion training / bespoke styling."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Julian House of Fashion Academy on WhatsApp"
      className="no-print fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-zinc-950 shadow-xl ring-4 ring-white transition hover:scale-105 hover:bg-[#20bd5a]"
    >
      <MessageCircle className="h-5 w-5 fill-zinc-950/10" />
      <span className="hidden sm:inline">WhatsApp Studio</span>
    </a>
  );
}
