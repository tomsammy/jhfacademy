import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { SITE_CONFIG } from "@/data/siteData";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default:
      "Julian House of Fashion Academy | Fashion Design School & Couture in Ilorin",
    template: "%s | Julian House of Fashion Academy, Ilorin",
  },
  description:
    "Premier fashion design academy & bespoke couture house in Ilorin, Kwara State. Learn pattern drafting, corsetry, bridal gowns & male fashion design. Foundational ₦150k, Intermediate ₦150k, Advanced ₦200k, Full 9-Month Programme ₦500k. Accommodation available.",
  keywords: [
    "Fashion school in Ilorin",
    "Fashion design academy Kwara State",
    "Julian House of Fashion Academy",
    "Best tailoring school in Ilorin",
    "Learn pattern drafting in Ilorin",
    "Male fashion design training Ilorin",
    "Bespoke fashion designer Ilorin",
    "Bridal and Aso-Ebi designer Basin Road Ilorin",
    "jhfacademy.com.ng",
  ],
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    title:
      "Julian House of Fashion Academy | Premier Fashion School in Ilorin, Kwara State",
    description:
      "Building skills. Transforming lives through fashion education. Structured 3-month, 4-month & 9-month hands-on fashion design training off Basin Road, Ilorin.",
    images: [
      {
        url: "/images/editorial/director-navy-atelier-seated.jpg",
        width: 1024,
        height: 1280,
        alt: "Julian House of Fashion Academy Bespoke Couture & Fashion School Ilorin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Julian House of Fashion Academy — Ilorin, Kwara State",
    description:
      "Building skills. Transforming lives through fashion education. Enroll in Foundational, Intermediate, Advanced, 9-Month Full Programme, or Male Fashion Design.",
    images: ["/images/editorial/director-navy-atelier-seated.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans text-zinc-900">
        <JsonLdSchema />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
