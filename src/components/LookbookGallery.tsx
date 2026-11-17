"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { LOOKBOOK_ITEMS, buildWhatsAppUrl } from "@/data/siteData";

const CATEGORIES = [
  "All",
  "Bridals & Reception",
  "Aso-Ebi & Lace",
  "Aso-Oke & Traditional",
  "Blazers & Suits",
  "Male Fashion",
] as const;

export function LookbookGallery({ limit }: { limit?: number }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? LOOKBOOK_ITEMS
      : LOOKBOOK_ITEMS.filter((item) => item.category === activeCategory);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {/* Filter Pills */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                isActive
                  ? "bg-brand-purple text-white shadow-md"
                  : "border border-purple-200 bg-white text-zinc-700 hover:border-brand-purple hover:text-brand-purple"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-lavender">
              {item.image ? (
                <img
                  src={item.image}
                  alt={`${item.title} by Julian House of Fashion Ilorin`}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-brand-purple via-brand-violet to-zinc-950 p-8 text-center">
                  <BrandLogo variant="light" />
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                    Custom Menswear Atelier
                  </p>
                  <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-purple-100">
                    Senator wear, Kaftans, Agbada &amp; structured male shirts —
                    tailored to exact anatomical measurements.
                  </p>
                </div>
              )}
              <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-purple shadow-sm backdrop-blur">
                {item.category}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-goldDark">
                  {item.techniqueTag}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-purple-50 pt-4">
                <a
                  href={buildWhatsAppUrl(
                    `Hello Julian House of Fashion! I would like to book a bespoke consultation for: ${item.title} (${item.category}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-purple transition hover:text-brand-violet"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book Similar Bespoke Style →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
