"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LOCAL_FAQS } from "@/data/siteData";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {LOCAL_FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={faq.question}
            className="overflow-hidden rounded-2xl border border-purple-100 bg-white transition hover:border-purple-200"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-serif text-lg font-bold text-zinc-900 sm:text-xl">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brand-purple transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-purple-50 px-6 pb-5 pt-3 text-sm leading-relaxed text-zinc-600">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
