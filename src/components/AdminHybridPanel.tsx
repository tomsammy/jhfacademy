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
  Scissors,
  Search,
  Star,
  User,
} from "lucide-react";
import type { HybridApplication, HybridApplicationStatus } from "@/lib/db";

const HYBRID_STATUS_META: Record<
  HybridApplicationStatus,
  { label: string; badgeClass: string }
> = {
  new: {
    label: "New",
    badgeClass: "bg-purple-100 text-brand-purple border-purple-200",
  },
  reviewing: {
    label: "Under Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  registered: {
    label: "Registered / Paid",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
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

function toHybridWhatsAppHref(phone: string, applicantName: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0")
    ? `234${digits.slice(1)}`
    : digits.startsWith("234")
    ? digits
    : `234${digits}`;
  const msg = encodeURIComponent(
    `Hello ${applicantName}! This is Julian House of Fashion Academy regarding your Hybrid Training Programme application.`
  );
  return `https://wa.me/${normalized}?text=${msg}`;
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

interface AdminHybridPanelProps {
  applications: HybridApplication[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onUpdated: (updated: HybridApplication) => void;
  onError: (msg: string) => void;
}

export function AdminHybridPanel({
  applications,
  loading,
  error,
  onRefresh,
  onUpdated,
  onError,
}: AdminHybridPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "starred" | HybridApplicationStatus
  >("all");
  const [selectedId, setSelectedId] = useState<number | null>(
    applications.length > 0 ? applications[0].id : null
  );
  const [notesDraft, setNotesDraft] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev && applications.some((item) => item.id === prev)) return prev;
      return applications.length > 0 ? applications[0].id : null;
    });
  }, [applications]);

  const selectedApp = useMemo(
    () => applications.find((item) => item.id === selectedId) || null,
    [applications, selectedId]
  );

  useEffect(() => {
    if (selectedApp) {
      setNotesDraft(selectedApp.adminNotes || "");
      setSaveToast(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp?.id]);

  const copyHybridUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://jhfacademy.com.ng/hybrid"
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Ignore clipboard failures
    }
  };

  const patchApplication = async (
    id: number,
    patch: {
      status?: HybridApplicationStatus;
      isStarred?: boolean;
      adminNotes?: string;
    },
    successText: string
  ) => {
    setSavingUpdate(true);
    setSaveToast(null);
    try {
      const res = await fetch("/api/admin/hybrid", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data?.error || "Could not update Hybrid application.");
        return;
      }
      onUpdated(data.application as HybridApplication);
      setSaveToast(successText);
    } catch {
      onError("Network error while saving changes.");
    } finally {
      setSavingUpdate(false);
    }
  };

  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((item) => {
      if (statusFilter === "starred" && !item.isStarred) return false;
      if (
        statusFilter !== "all" &&
        statusFilter !== "starred" &&
        item.status !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.referenceCode,
        item.fullName,
        item.phoneNumber,
        item.whatsappNumber,
        item.emailAddress,
        item.residentialAddress,
        item.occupation,
        item.trainingLevel,
        item.availableDays,
        item.whyHybrid,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [applications, searchQuery, statusFilter]);

  const counts = useMemo(
    () => ({
      total: applications.length,
      newCount: applications.filter((a) => a.status === "new").length,
      starred: applications.filter((a) => a.isStarred).length,
      approved: applications.filter((a) => a.status === "approved").length,
      registered: applications.filter((a) => a.status === "registered").length,
    }),
    [applications]
  );

  const exportCsv = () => {
    const headers = [
      "Reference",
      "Submitted At",
      "Status",
      "Starred",
      "Full Name",
      "Phone",
      "WhatsApp",
      "Email",
      "Residential Address",
      "Occupation",
      "Training Level",
      "Experience",
      "Why Hybrid",
      "Available Days (Mon-Fri)",
      "Sewing Machine Access",
      "Smartphone/PC & Internet",
      "Agreed Conditions",
      "Signed Name",
      "Form Date",
      "Admin Notes",
    ];
    const rows = filteredApplications.map((a) =>
      [
        a.referenceCode,
        a.createdAt,
        a.status,
        a.isStarred ? "Yes" : "No",
        a.fullName,
        a.phoneNumber,
        a.whatsappNumber,
        a.emailAddress,
        a.residentialAddress,
        a.occupation,
        a.trainingLevel,
        a.experienceLevel,
        a.whyHybrid,
        a.availableDays,
        a.machineAccess,
        a.internetAccess,
        a.agreedConditions ? "Yes, agreed" : "No",
        a.signatureName,
        a.applicationDate,
        a.adminNotes,
      ]
        .map((cell) => escapeCsvCell(String(cell || "")))
        .join(",")
    );
    const csv = [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jhf-hybrid-applications-${new Date()
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
            Hybrid Training Programme Applications
          </h2>
          <p className="text-xs text-zinc-500">
            Applicants from{" "}
            <span className="font-mono font-semibold text-brand-purple">
              /hybrid
            </span>{" "}
            (Learn flexibly. Practise consistently. Become skilled.)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyHybridUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied /hybrid Link
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy /hybrid Link
              </>
            )}
          </button>
          <Link
            href="/hybrid"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-purple transition hover:bg-brand-lavender"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Form
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
            disabled={filteredApplications.length === 0}
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
            Total Applicants
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-zinc-950">
            {counts.total}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-brand-lavender/50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-purple">
            New / Unread
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-purple">
            {counts.newCount}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Starred
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-amber-700">
            {counts.starred}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
            Approved
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-blue-700">
            {counts.approved}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm sm:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Registered / Paid
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-700">
            {counts.registered}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Search & Filter Tabs */}
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by applicant name, phone, level, weekday, address, or reference..."
            className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: "All" },
              { id: "new", label: "New" },
              { id: "starred", label: "★ Starred" },
              { id: "reviewing", label: "Under Review" },
              { id: "approved", label: "Approved" },
              { id: "registered", label: "Registered / Paid" },
              { id: "archived", label: "Archived" },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
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

      {/* Master-Detail Reader */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-zinc-900">
            {applications.length === 0
              ? "No Hybrid Applications Yet"
              : "No Matching Applications Found"}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {applications.length === 0
              ? "Share https://jhfacademy.com.ng/hybrid with interested candidates — every application will appear here."
              : "Try clearing your search input or changing the status filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* List */}
          <div
            className={`space-y-2.5 lg:col-span-5 ${
              selectedApp ? "hidden lg:block" : "block"
            }`}
          >
            {filteredApplications.map((item) => {
              const isSelected = item.id === selectedId;
              const statusInfo =
                HYBRID_STATUS_META[item.status] || HYBRID_STATUS_META.new;
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
                      <p className="mt-0.5 truncate text-xs font-semibold text-brand-purple">
                        {item.trainingLevel}
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

                  <p className="mt-2 truncate text-xs text-zinc-600">
                    Days: <strong>{item.availableDays}</strong> •{" "}
                    {item.occupation}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-purple-50 pt-2 text-[11px] text-zinc-500">
                    <span>{item.experienceLevel}</span>
                    <span className="font-mono font-semibold text-brand-purple">
                      {item.referenceCode}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-md sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Applications
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-100 pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-purple px-3 py-0.5 font-mono text-xs font-bold text-brand-gold">
                        {selectedApp.referenceCode}
                      </span>
                      <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold text-brand-purple">
                        {selectedApp.trainingLevel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateTime(selectedApp.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-3xl font-bold text-zinc-950">
                      {selectedApp.fullName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-600">
                      <MapPin className="h-4 w-4 text-brand-purple" />
                      {selectedApp.residentialAddress}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={savingUpdate}
                    onClick={() =>
                      patchApplication(
                        selectedApp.id,
                        { isStarred: !selectedApp.isStarred },
                        selectedApp.isStarred
                          ? "Removed from Starred"
                          : "Marked as Starred"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                      selectedApp.isStarred
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        selectedApp.isStarred
                          ? "fill-amber-400 text-amber-500"
                          : "text-zinc-400"
                      }`}
                    />
                    {selectedApp.isStarred ? "Starred" : "Star Applicant"}
                  </button>
                </div>

                {/* Personal & Contact Card */}
                <div className="mt-5 grid gap-4 rounded-2xl border border-purple-100 bg-brand-lavender/35 p-5 sm:grid-cols-2">
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                      <User className="h-3.5 w-3.5" />
                      Personal &amp; Contact
                    </p>
                    <p>
                      <span className="text-zinc-500">Phone:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.phoneNumber}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">WhatsApp:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.whatsappNumber}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Email:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.emailAddress}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Occupation:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.occupation}
                      </strong>
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={`tel:${selectedApp.phoneNumber}`}
                        className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-bold text-brand-purple hover:bg-brand-lavender"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                      <a
                        href={toHybridWhatsAppHref(
                          selectedApp.whatsappNumber || selectedApp.phoneNumber,
                          selectedApp.fullName
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Readiness & Schedule Card */}
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                      <Scissors className="h-3.5 w-3.5" />
                      Training &amp; Equipment
                    </p>
                    <p>
                      <span className="text-zinc-500">Experience:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.experienceLevel}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Physical Days:</span>{" "}
                      <strong className="text-brand-purple">
                        {selectedApp.availableDays}
                      </strong>
                    </p>
                    <p>
                      <span className="text-zinc-500">Sewing Machine:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.machineAccess}
                      </strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-zinc-500">Device &amp; Internet:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedApp.internetAccess}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Why Hybrid */}
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    9. Why Applicant Chose the Hybrid Training Option
                  </p>
                  <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 text-sm leading-relaxed text-zinc-900">
                    {selectedApp.whyHybrid}
                  </div>
                </div>

                {/* Commitment Declaration */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-950">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    Agreed &amp; Committed to All Hybrid Rules
                  </span>
                  <span>
                    Signed:{" "}
                    <strong className="italic">
                      {selectedApp.signatureName}
                    </strong>{" "}
                    ({selectedApp.applicationDate})
                  </span>
                </div>

                {/* Status & Admin Notes */}
                <div className="mt-6 space-y-4 border-t border-purple-100 pt-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Application Status
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        Object.keys(
                          HYBRID_STATUS_META
                        ) as HybridApplicationStatus[]
                      ).map((statusKey) => {
                        const meta = HYBRID_STATUS_META[statusKey];
                        const active = selectedApp.status === statusKey;
                        return (
                          <button
                            key={statusKey}
                            type="button"
                            disabled={savingUpdate}
                            onClick={() =>
                              patchApplication(
                                selectedApp.id,
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
                      htmlFor="hybridAdminNotes"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Private Admin Notes
                    </label>
                    <textarea
                      id="hybridAdminNotes"
                      rows={3}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Write physical day assignment, interview follow-up, or registration payment notes..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={savingUpdate}
                        onClick={() =>
                          patchApplication(
                            selectedApp.id,
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
                  Select a Hybrid applicant on the left to view full answers.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
