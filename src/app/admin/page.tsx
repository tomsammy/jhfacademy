import type { Metadata } from "next";
import React from "react";
import { AdminPortalClient } from "@/components/AdminPortalClient";

export const metadata: Metadata = {
  title: "Admin Portal — JHF Academy & Next Stitch Initiative",
  description:
    "Private admin portal for Julian House of Fashion Academy to review The Next Stitch Initiative nominations and stories.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <section className="lavender-glow min-h-[75vh] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminPortalClient />
      </div>
    </section>
  );
}
