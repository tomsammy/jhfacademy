"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Laptop,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  Search,
  Star,
  Ticket,
  User,
  Users,
} from "lucide-react";
import type {
  HangoutRegistration,
  HangoutRegistrationStatus,
} from "@/lib/db";

const HANGOUT_STATUS_META: Record<
  HangoutRegistrationStatus,
  { label: string; badgeClass: string }
> = {
  paid: {
    label: "Paid",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  checked_in: {
    label: "Checked In",
    badgeClass: "bg-purple-100 text-brand-purple border-purple-200",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function toHangoutWhatsAppHref(
  phone: string,
  fullName: string,
  ticketType: "physical" | "online",
  ticketCode: string
): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0")
    ? `234${digits.slice(1)}`
    : digits.startsWith("234")
    ? digits
    : `234${digits}`;
  const msg = encodeURIComponent(
    `Hello ${fullName}! This is Julian House of Fashion regarding your JHF Hangout 2027 ${
      ticketType === "physical" ? "Physical (Ilorin)" : "Online"
    } pass (${ticketCode}) for Saturday, January 9, 2027.`
  );
  return `https://wa.me/${normalized}?text=${msg}`;
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

interface AdminHangoutPanelProps {
  registrations: HangoutRegistration[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onUpdated: (updated: HangoutRegistration) => void;
  onError: (msg: string) => void;
}

export function AdminHangoutPanel({
  registrations,
  loading,
  error,
  onRefresh,
  onUpdated,
  onError,
}: AdminHangoutPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<
    "all" | "physical" | "online" | "checked_in" | "starred"
  >("all");
  const [selectedId, setSelectedId] = useState<number | null>(
    registrations.length > 0 ? registrations[0].id : null
  );
  const [notesDraft, setNotesDraft] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev && registrations.some((item) => item.id === prev)) return prev;
      return registrations.length > 0 ? registrations[0].id : null;
    });
  }, [registrations]);

  const selectedReg = useMemo(
    () => registrations.find((item) => item.id === selectedId) || null,
    [registrations, selectedId]
  );

  useEffect(() => {
    if (selectedReg) {
      setNotesDraft(selectedReg.adminNotes || "");
      setSaveToast(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReg?.id]);

  const copyEventUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://jhfacademy.com.ng/hangout-2027"
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Ignore
    }
  };

  const patchRegistration = async (
    id: number,
    patch: {
      status?: HangoutRegistrationStatus;
      isStarred?: boolean;
      adminNotes?: string;
    },
    successText: string
  ) => {
    setSavingUpdate(true);
    setSaveToast(null);
    try {
      const res = await fetch("/api/admin/hangout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data?.error || "Could not update Hangout registration.");
        return;
      }
      onUpdated(data.registration as HangoutRegistration);
      setSaveToast(successText);
    } catch {
      onError("Network error while saving changes.");
    } finally {
      setSavingUpdate(false);
    }
  };

  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return registrations.filter((item) => {
      if (filterMode === "physical" && item.ticketType !== "physical")
        return false;
      if (filterMode === "online" && item.ticketType !== "online") return false;
      if (filterMode === "checked_in" && item.status !== "checked_in")
        return false;
      if (filterMode === "starred" && !item.isStarred) return false;
      if (!q) return true;
      const haystack = [
        item.ticketCode,
        item.paystackReference,
        item.fullName,
        item.phoneNumber,
        item.whatsappNumber,
        item.emailAddress,
        item.city,
        item.fashionRole,
        item.questionNote,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [registrations, searchQuery, filterMode]);

  const counts = useMemo(() => {
    const physicalCount = registrations.filter(
      (r) => r.ticketType === "physical"
    ).length;
    const onlineCount = registrations.filter(
      (r) => r.ticketType === "online"
    ).length;
    const checkedInCount = registrations.filter(
      (r) => r.status === "checked_in"
    ).length;
    const totalRevenue = registrations.reduce(
      (sum, r) => sum + Number(r.amountNaira || 0),
      0
    );
    return {
      total: registrations.length,
      physicalCount,
      onlineCount,
      checkedInCount,
      totalRevenue,
    };
  }, [registrations]);

  const exportCsv = () => {
    const headers = [
      "Ticket Code",
      "Paystack Ref",
      "Paid At",
      "Status",
      "Ticket Type",
      "Amount (NGN)",
      "Full Name",
      "Phone",
      "WhatsApp",
      "Email",
      "City",
      "Role",
      "Question / Topic",
      "Admin Notes",
    ];
    const rows = filteredRegistrations.map((r) =>
      [
        r.ticketCode,
        r.paystackReference,
        r.paidAt,
        r.status,
        r.ticketType,
        String(r.amountNaira),
        r.fullName,
        r.phoneNumber,
        r.whatsappNumber,
        r.emailAddress,
        r.city,
        r.fashionRole,
        r.questionNote,
        r.adminNotes,
      ]
        .map((cell) => escapeCsvCell(String(cell || "")))
        .join(",")
    );
    const csv = [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jhf-hangout-2027-attendees-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-xl font-bold text-zinc-950 sm:text-2xl">
            JHF Hangout 2027 — Registered &amp; Paid Guests
          </h2>
          <p className="text-xs text-zinc-500">
            Attendees from{" "}
            <span className="font-mono font-semibold text-brand-purple">
              /hangout-2027
            </span>{" "}
            • Saturday, January 9, 2027 (Physical ₦10,000 / Online ₦5,000)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyEventUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied Event Link
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy /hangout-2027 Link
              </>
            )}
          </button>
          <Link
            href="/hangout-2027"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-purple transition hover:bg-brand-lavender"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Event Page
          </Link>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 transition hover:bg-brand-lavender"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredRegistrations.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-violet disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-brand-gold" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Paid Guests
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-zinc-950">
            {counts.total}
          </p>
        </div>
        <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50/70 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-800">
            Physical (₦10k)
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-fuchsia-700">
            {counts.physicalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
            Online (₦5k)
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-cyan-700">
            {counts.onlineCount}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-brand-lavender/50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-purple">
            Checked In
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-purple">
            {counts.checkedInCount}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm sm:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Total Revenue
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-emerald-700 sm:text-3xl">
            ₦{counts.totalRevenue.toLocaleString("en-NG")}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, ticket code, phone, city, role, or Paystack ref..."
            className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: "All" },
              { id: "physical", label: "Physical (₦10k)" },
              { id: "online", label: "Online (₦5k)" },
              { id: "checked_in", label: "Checked In" },
              { id: "starred", label: "★ Starred" },
            ] as const
          ).map((tab) => {
            const active = filterMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterMode(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-brand-purple text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-purple-200 hover:text-brand-purple"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Master-Detail View */}
      {filteredRegistrations.length === 0 ? (
        <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-zinc-900">
            {registrations.length === 0
              ? "No Paid Hangout Registrations Yet"
              : "No Matching Attendees Found"}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {registrations.length === 0
              ? "Share https://jhfacademy.com.ng/hangout-2027 — every verified Paystack registration appears automatically here."
              : "Try clearing your search input or changing the filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div
            className={`space-y-2.5 lg:col-span-5 ${
              selectedReg ? "hidden lg:block" : "block"
            }`}
          >
            {filteredRegistrations.map((item) => {
              const isSelected = item.id === selectedId;
              const statusInfo =
                HANGOUT_STATUS_META[item.status] || HANGOUT_STATUS_META.paid;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-brand-purple bg-brand-lavender/50 shadow-md ring-2 ring-purple-200"
                      : "border-purple-100 bg-white hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg font-bold text-zinc-950">
                        {item.fullName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-brand-purple">
                        {item.ticketType === "physical" ? (
                          <Users className="h-3.5 w-3.5 text-fuchsia-600" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5 text-cyan-600" />
                        )}
                        {item.ticketType === "physical"
                          ? "Physical • ₦10,000"
                          : "Online • ₦5,000"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {item.isStarred && (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      )}
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-purple-50 pt-2 text-[11px] text-zinc-500">
                    <span>
                      {item.fashionRole} • {item.city}
                    </span>
                    <span className="font-mono font-semibold text-brand-purple">
                      {item.ticketCode}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {selectedReg ? (
              <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-md sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Guests
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-100 pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-purple px-3 py-0.5 font-mono text-xs font-bold text-brand-gold">
                        <Ticket className="h-3 w-3" />
                        {selectedReg.ticketCode}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                          selectedReg.ticketType === "physical"
                            ? "bg-fuchsia-100 text-fuchsia-800"
                            : "bg-cyan-100 text-cyan-800"
                        }`}
                      >
                        {selectedReg.ticketType === "physical"
                          ? "Physical Pass (₦10,000)"
                          : "Online Pass (₦5,000)"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateTime(selectedReg.paidAt)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-3xl font-bold text-zinc-950">
                      {selectedReg.fullName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
                      <MapPin className="h-4 w-4 text-brand-purple" />
                      {selectedReg.city} • {selectedReg.fashionRole}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={savingUpdate}
                    onClick={() =>
                      patchRegistration(
                        selectedReg.id,
                        { isStarred: !selectedReg.isStarred },
                        selectedReg.isStarred
                          ? "Removed from Starred"
                          : "Marked as Starred"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                      selectedReg.isStarred
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        selectedReg.isStarred
                          ? "fill-amber-400 text-amber-500"
                          : "text-zinc-400"
                      }`}
                    />
                    {selectedReg.isStarred ? "Starred" : "Star Guest"}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 rounded-2xl border border-purple-100 bg-brand-lavender/35 p-5 sm:grid-cols-2">
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                      <User className="h-3.5 w-3.5" />
                      Guest Contact
                    </p>
                    <p>
                      <span className="text-zinc-500">Phone:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedReg.phoneNumber}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">WhatsApp:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedReg.whatsappNumber}
                      </strong>
                    </p>
                    {selectedReg.emailAddress && (
                      <p>
                        <span className="text-zinc-500">Email:</span>{" "}
                        <strong className="text-zinc-900">
                          {selectedReg.emailAddress}
                        </strong>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={`tel:${selectedReg.phoneNumber}`}
                        className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-bold text-brand-purple hover:bg-brand-lavender"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                      <a
                        href={toHangoutWhatsAppHref(
                          selectedReg.whatsappNumber || selectedReg.phoneNumber,
                          selectedReg.fullName,
                          selectedReg.ticketType,
                          selectedReg.ticketCode
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Send Venue / Link via WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Payment Details
                    </p>
                    <p>
                      <span className="text-zinc-500">Amount Paid:</span>{" "}
                      <strong className="text-emerald-700">
                        ₦{selectedReg.amountNaira.toLocaleString("en-NG")}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Channel:</span>{" "}
                      <strong className="uppercase text-zinc-900">
                        {selectedReg.channel}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Paystack Ref:</span>{" "}
                      <span className="font-mono text-xs text-zinc-700">
                        {selectedReg.paystackReference}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedReg.questionNote && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Topic / Question for Guest Speaker
                    </p>
                    <div className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-900">
                      {selectedReg.questionNote}
                    </div>
                  </div>
                )}

                {/* Status & Admin Notes */}
                <div className="mt-6 space-y-4 border-t border-purple-100 pt-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Guest Status
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        Object.keys(
                          HANGOUT_STATUS_META
                        ) as HangoutRegistrationStatus[]
                      ).map((statusKey) => {
                        const meta = HANGOUT_STATUS_META[statusKey];
                        const active = selectedReg.status === statusKey;
                        return (
                          <button
                            key={statusKey}
                            type="button"
                            disabled={savingUpdate}
                            onClick={() =>
                              patchRegistration(
                                selectedReg.id,
                                { status: statusKey },
                                `Status updated to ${meta.label}`
                              )
                            }
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                              active
                                ? "border-brand-purple bg-brand-purple text-white shadow-sm"
                                : "border-zinc-200 bg-white text-zinc-700 hover:border-purple-200"
                            }`}
                          >
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="hangoutAdminNotes"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Private Admin Notes
                    </label>
                    <textarea
                      id="hangoutAdminNotes"
                      rows={2}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Note whether venue address or live link has been sent..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={savingUpdate}
                        onClick={() =>
                          patchRegistration(
                            selectedReg.id,
                            { adminNotes: notesDraft },
                            "Admin notes saved"
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple px-5 py-2 text-xs font-bold text-white transition hover:bg-brand-violet disabled:opacity-60"
                      >
                        <Save className="h-3.5 w-3.5 text-brand-gold" />
                        {savingUpdate ? "Saving..." : "Save Notes"}
                      </button>

                      {saveToast && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {saveToast}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden rounded-3xl border border-purple-100 bg-white p-12 text-center lg:block">
                <p className="text-sm text-zinc-500">
                  Select a guest on the left to view full pass details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
