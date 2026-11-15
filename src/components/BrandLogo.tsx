import React from "react";

interface BrandLogoProps {
  variant?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = "dark",
  showTagline = false,
  className = "",
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 76"
        className="h-11 w-10 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Hanger hook & shoulders */}
        <path
          d="M32 6C32 4.34315 33.3431 3 35 3C36.6569 3 38 4.34315 38 6C38 7.30622 37.1652 8.41746 36 8.82929V11.5L47 17.5C47.8 17.9 48.2 18.8 47.9 19.6L47.3 21"
          stroke={isLight ? "#EDE9FE" : "#4C1D95"}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M36 11.5L21 17.5C20.2 17.9 19.8 18.8 20.1 19.6L20.7 21"
          stroke={isLight ? "#EDE9FE" : "#4C1D95"}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Couture gown silhouette */}
        <path
          d="M27 16.5C29.5 18 38.5 18 41 16.5L42.5 22.5C40.5 26 39 28.5 39 31.5C42 38 46.5 48 48 59.5C44.5 55.5 41.5 54 39.5 54C41.5 60 40 66.5 36.5 70C35.5 64 34 60.5 31.5 59C28.5 63.5 25 68 18.5 71C21.5 65 21.5 61 19.5 58.5C15.5 62.5 10.5 64.5 5 64.5C13.5 57.5 19.5 46 25 32.5C25.5 29 24.5 26 23 22.5L27 16.5Z"
          fill={isLight ? "#FFFFFF" : "#4C1D95"}
        />
        {/* Gold waist accent */}
        <path
          d="M25.5 31.5C30 33 35.5 33 39.5 31.5"
          stroke="#D4AF37"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col leading-none">
        <span
          className={`font-serif text-2xl font-bold tracking-tight ${
            isLight ? "text-white" : "text-brand-purple"
          }`}
        >
          Julian
        </span>
        <span
          className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
            isLight
              ? "bg-white/15 text-brand-lavender"
              : "bg-brand-purple text-white"
          }`}
        >
          House of Fashion Academy
        </span>
        {showTagline && (
          <span
            className={`mt-1 text-[10px] tracking-wide ${
              isLight ? "text-purple-200" : "text-zinc-500"
            }`}
          >
            Ilorin, Kwara State • Est. 2018
          </span>
        )}
      </div>
    </div>
  );
}
