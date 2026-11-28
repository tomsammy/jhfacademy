"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Lock,
  LogOut,
  Search,
  Star,
  Download,
  RefreshCw,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  AlertTriangle,
  Database,
  ExternalLink,
  GraduationCap,
  Heart,
  Sparkles,
} from "lucide-react";
import type {
  HangoutRegistration,
  HybridApplication,
  NextStitchStatus,
  NextStitchStory,
} from "@/lib/db";
import { AdminHybridPanel } from "@/components/AdminHybridPanel";
import { AdminHangoutPanel } from "@/components/AdminHangoutPanel";

const STATUS_META: Record<
  NextStitchStatus,
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
  shortlisted: {
    label: "Shortlisted",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  contacted: {
    label: "Contacted",
    badgeClass: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  selected: {
    label: "Selected Winner",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function toWhatsAppHref(phone: string, nomineeName: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0")
    ? `234${digits.slice(1)}`
    : digits.startsWith("234")
    ? digits
    : `234${digits}`;
  const msg = encodeURIComponent(
    `Hello! This is Julihana Tomori from Julian House of Fashion regarding The Next Stitch Initiative submission for ${nomineeName}.`
  );
  return `https://wa.me/${normalized}?text=${msg}`;
}

function escapeCsvCell(value: string): string {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

export function AdminPortalClient() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<
    "hangout" | "hybrid" | "next-stitch"
  >("hangout");

  const [stories, setStories] = useState<NextStitchStory[]>([]);
  const [storageMode, setStorageMode] = useState<string>("");
  const [loadingStories, setLoadingStories] = useState(false);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  const [hybridApps, setHybridApps] = useState<HybridApplication[]>([]);
  const [loadingHybrid, setLoadingHybrid] = useState(false);
  const [hybridError, setHybridError] = useState<string | null>(null);

  const [hangoutRegs, setHangoutRegs] = useState<HangoutRegistration[]>([]);
  const [loadingHangout, setLoadingHangout] = useState(false);
  const [hangoutError, setHangoutError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "starred" | NextStitchStatus
  >("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [notesDraft, setNotesDraft] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setLoadingStories(true);
    setStoriesError(null);
    try {
      const res = await fetch("/api/admin/next-stitch", { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) {
        setStoriesError(data?.error || "Failed to load submissions.");
        return;
      }
      const list = Array.isArray(data.stories)
        ? (data.stories as NextStitchStory[])
        : [];
      setStories(list);
      setStorageMode(data.storageMode || "");
      setSelectedId((prev) => {
        if (prev && list.some((s) => s.id === prev)) return prev;
        return list.length > 0 ? list[0].id : null;
      });
    } catch {
      setStoriesError("Network error loading submissions.");
    } finally {
      setLoadingStories(false);
    }
  }, []);

  const fetchHybridApps = useCallback(async () => {
    setLoadingHybrid(true);
    setHybridError(null);
    try {
      const res = await fetch("/api/admin/hybrid", { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) {
        setHybridError(data?.error || "Failed to load Hybrid applications.");
        return;
      }
      const list = Array.isArray(data.applications)
        ? (data.applications as HybridApplication[])
        : [];
      setHybridApps(list);
      if (data.storageMode) setStorageMode(data.storageMode);
    } catch {
      setHybridError("Network error loading Hybrid applications.");
    } finally {
      setLoadingHybrid(false);
    }
  }, []);

  const fetchHangoutRegs = useCallback(async () => {
    setLoadingHangout(true);
    setHangoutError(null);
    try {
      const res = await fetch("/api/admin/hangout", { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) {
        setHangoutError(
          data?.error || "Failed to load JHF Hangout 2027 registrations."
        );
        return;
      }
      const list = Array.isArray(data.registrations)
        ? (data.registrations as HangoutRegistration[])
        : [];
      setHangoutRegs(list);
      if (data.storageMode) setStorageMode(data.storageMode);
    } catch {
      setHangoutError("Network error loading Hangout 2027 registrations.");
    } finally {
      setLoadingHangout(false);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/login", { cache: "no-store" });
        const data = await res.json();
        setConfigured(Boolean(data.configured));
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          await Promise.all([
            fetchStories(),
            fetchHybridApps(),
            fetchHangoutRegs(),
          ]);
        }
      } catch {
        setLoginError("Could not reach server.");
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [fetchStories, fetchHybridApps, fetchHangoutRegs]);

  const selectedStory = useMemo(
    () => stories.find((s) => s.id === selectedId) || null,
    [stories, selectedId]
  );

  useEffect(() => {
    if (selectedStory) {
      setNotesDraft(selectedStory.adminNotes || "");
      setSaveToast(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStory?.id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.error || "Login failed.");
        return;
      }
      setPassword("");
      setAuthenticated(true);
      await Promise.all([
        fetchStories(),
        fetchHybridApps(),
        fetchHangoutRegs(),
      ]);
    } catch {
      setLoginError("Network issue signing in.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setStories([]);
    setHybridApps([]);
    setHangoutRegs([]);
    setSelectedId(null);
  };

  const patchStory = async (
    id: number,
    patch: { status?: NextStitchStatus; isStarred?: boolean; adminNotes?: string },
    successText: string
  ) => {
    setSavingUpdate(true);
    setSaveToast(null);
    try {
      const res = await fetch("/api/admin/next-stitch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStoriesError(data?.error || "Could not update submission.");
        return;
      }
      const updated = data.story as NextStitchStory;
      setStories((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      setSaveToast(successText);
    } catch {
      setStoriesError("Network error while saving changes.");
    } finally {
      setSavingUpdate(false);
    }
  };

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stories.filter((item) => {
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
        item.nomineeName,
        item.nomineeLocation,
        item.nominatorName,
        item.contactPhone,
        item.nomineePhone,
        item.learningSetup,
        item.story,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [stories, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: stories.length,
      newCount: stories.filter((s) => s.status === "new").length,
      shortlisted: stories.filter((s) => s.status === "shortlisted").length,
      starred: stories.filter((s) => s.isStarred).length,
      selected: stories.filter((s) => s.status === "selected").length,
    };
  }, [stories]);

  const exportCsv = () => {
    const headers = [
      "Reference",
      "Date",
      "Type",
      "Status",
      "Starred",
      "Nominee Name",
      "Age",
      "Location",
      "Stage",
      "Learning Setup",
      "Nominee Phone",
      "Nominator Name",
      "Relationship",
      "Contact Phone",
      "Contact Email",
      "Story",
      "Additional Details",
      "Admin Notes",
    ];
    const rows = filteredStories.map((s) =>
      [
        s.referenceCode,
        s.createdAt,
        s.submissionType,
        s.status,
        s.isStarred ? "Yes" : "No",
        s.nomineeName,
        s.nomineeAge,
        s.nomineeLocation,
        s.educationStage,
        s.learningSetup,
        s.nomineePhone,
        s.nominatorName,
        s.relationship,
        s.contactPhone,
        s.contactEmail,
        s.story,
        s.additionalDetails,
        s.adminNotes,
      ]
        .map((cell) => escapeCsvCell(String(cell || "")))
        .join(",")
    );
    const csv = [headers.map(escapeCsvCell).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jhf-next-stitch-stories-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (checkingAuth) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-lg">
        <RefreshCw className="mx-auto h-7 w-7 animate-spin text-brand-purple" />
        <p className="mt-3 text-sm font-medium text-zinc-600">
          Checking admin session...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-purple-200 bg-white p-8 shadow-xl shadow-purple-900/10 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple text-brand-gold">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold text-zinc-950">
            JHF Admin Portal
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Sign in to read <strong>The Next Stitch Initiative</strong> stories,
            review nominee details, shortlist candidates, and export records.
          </p>
        </div>

        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <p className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Admin Password Setup Required
            </p>
            <p className="mt-1">
              Add an environment variable named{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono font-bold">
                ADMIN_PASSWORD
              </code>{" "}
              in your Vercel Project Settings → Environment Variables, then
              redeploy.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="adminPassword"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Admin Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your JHF admin password"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-11 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-purple"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {loginError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loginLoading || !configured}
            className="w-full rounded-full bg-brand-purple px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-violet disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginLoading ? "Signing In..." : "Sign In to Admin Portal"}
          </button>
        </form>

        <div className="mt-6 border-t border-purple-100 pt-4 text-center">
          <Link
            href="/next-stitch"
            className="text-xs font-semibold text-brand-purple hover:underline"
          >
            ← Back to Next Stitch Initiative Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-purple px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
              JHF Admin Dashboard
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <Database className="h-3 w-3" />
              {storageMode === "neon"
                ? "Neon Postgres Connected"
                : "Local Dev Storage"}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
            {activeSection === "hangout"
              ? "JHF Hangout 2027 — Paid Guests & Passes"
              : activeSection === "hybrid"
              ? "Hybrid Training Programme — Applications"
              : "The Next Stitch Initiative — Submissions & Stories"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeSection === "next-stitch" && (
            <>
              <a
                href="/images/next-stitch/next-stitch-flier-qr.png"
                download="JHF-Next-Stitch-Initiative-QR-Flier.png"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
              >
                <Download className="h-3.5 w-3.5" />
                Download QR Flier
              </a>
              <Link
                href="/next-stitch"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-brand-purple transition hover:bg-brand-lavender"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Public Page
              </Link>
              <button
                type="button"
                onClick={fetchStories}
                disabled={loadingStories}
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 transition hover:bg-brand-lavender"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loadingStories ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={filteredStories.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-violet disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5 text-brand-gold" />
                Export CSV
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Portal Section Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSection("hangout")}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeSection === "hangout"
              ? "border-brand-purple bg-brand-purple text-white shadow-md"
              : "border-purple-200 bg-white text-zinc-700 hover:border-brand-purple hover:text-brand-purple"
          }`}
        >
          <Sparkles className="h-4 w-4 text-brand-gold" />
          JHF Hangout 2027
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeSection === "hangout"
                ? "bg-white/20 text-white"
                : "bg-brand-lavender text-brand-purple"
            }`}
          >
            {hangoutRegs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("hybrid")}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeSection === "hybrid"
              ? "border-brand-purple bg-brand-purple text-white shadow-md"
              : "border-purple-200 bg-white text-zinc-700 hover:border-brand-purple hover:text-brand-purple"
          }`}
        >
          <GraduationCap className="h-4 w-4 text-brand-gold" />
          Hybrid Training Applications
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeSection === "hybrid"
                ? "bg-white/20 text-white"
                : "bg-brand-lavender text-brand-purple"
            }`}
          >
            {hybridApps.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("next-stitch")}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeSection === "next-stitch"
              ? "border-brand-purple bg-brand-purple text-white shadow-md"
              : "border-purple-200 bg-white text-zinc-700 hover:border-brand-purple hover:text-brand-purple"
          }`}
        >
          <Heart className="h-4 w-4 text-brand-gold" />
          The Next Stitch Initiative
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeSection === "next-stitch"
                ? "bg-white/20 text-white"
                : "bg-brand-lavender text-brand-purple"
            }`}
          >
            {stories.length}
          </span>
        </button>
      </div>

      {activeSection === "hangout" ? (
        <AdminHangoutPanel
          registrations={hangoutRegs}
          loading={loadingHangout}
          error={hangoutError}
          onRefresh={fetchHangoutRegs}
          onUpdated={(updated) =>
            setHangoutRegs((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            )
          }
          onError={(msg) => setHangoutError(msg)}
        />
      ) : activeSection === "hybrid" ? (
        <AdminHybridPanel
          applications={hybridApps}
          loading={loadingHybrid}
          error={hybridError}
          onRefresh={fetchHybridApps}
          onUpdated={(updated) =>
            setHybridApps((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            )
          }
          onError={(msg) => setHybridError(msg)}
        />
      ) : (
        <>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Total Stories
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
            Shortlisted
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-blue-700">
            {counts.shortlisted}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm sm:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Selected
          </p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-700">
            {counts.selected}
          </p>
        </div>
      </div>

      {storiesError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {storiesError}
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by girl's name, location, phone, nominator, or story keyword..."
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
              { id: "shortlisted", label: "Shortlisted" },
              { id: "contacted", label: "Contacted" },
              { id: "selected", label: "Selected" },
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
      {filteredStories.length === 0 ? (
        <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-zinc-900">
            {stories.length === 0
              ? "No Stories Submitted Yet"
              : "No Matching Stories Found"}
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {stories.length === 0
              ? "Share the /next-stitch link on Instagram, WhatsApp Status, and Facebook — submissions will appear right here immediately."
              : "Try clearing your search box or switching status filter tabs."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* List Column */}
          <div
            className={`space-y-2.5 lg:col-span-5 ${
              selectedStory ? "hidden lg:block" : "block"
            }`}
          >
            {filteredStories.map((item) => {
              const isSelected = item.id === selectedId;
              const statusInfo = STATUS_META[item.status] || STATUS_META.new;
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
                        {item.nomineeName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {item.nomineeLocation}
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

                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-zinc-600">
                    {item.story}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-purple-50 pt-2 text-[11px] text-zinc-500">
                    <span>
                      {item.submissionType === "nomination"
                        ? `By ${item.nominatorName} (${item.relationship})`
                        : "Self-Application"}
                    </span>
                    <span className="font-mono font-semibold text-brand-purple">
                      {item.referenceCode}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Reader Column */}
          <div className="lg:col-span-7">
            {selectedStory ? (
              <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-md sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Stories
                </button>

                {/* Header & Quick Star */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-100 pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-purple px-3 py-0.5 font-mono text-xs font-bold text-brand-gold">
                        {selectedStory.referenceCode}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-semibold text-zinc-700">
                        {selectedStory.submissionType === "nomination"
                          ? "Nomination"
                          : "Self-Application"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(selectedStory.createdAt)}
                      </span>
                    </div>
                    <h2 className="mt-2 font-serif text-3xl font-bold text-zinc-950">
                      {selectedStory.nomineeName}
                      {selectedStory.nomineeAge
                        ? `, ${selectedStory.nomineeAge}`
                        : ""}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-brand-purple">
                      <MapPin className="h-4 w-4" />
                      {selectedStory.nomineeLocation}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={savingUpdate}
                    onClick={() =>
                      patchStory(
                        selectedStory.id,
                        { isStarred: !selectedStory.isStarred },
                        selectedStory.isStarred
                          ? "Removed from Starred"
                          : "Marked as Starred"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                      selectedStory.isStarred
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        selectedStory.isStarred
                          ? "fill-amber-400 text-amber-500"
                          : "text-zinc-400"
                      }`}
                    />
                    {selectedStory.isStarred ? "Starred" : "Star Story"}
                  </button>
                </div>

                {/* Applicant & Contact Grid */}
                <div className="mt-5 grid gap-4 rounded-2xl border border-purple-100 bg-brand-lavender/35 p-5 sm:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                      <User className="h-3.5 w-3.5" />
                      Nominee Profile
                    </p>
                    <p>
                      <span className="text-zinc-500">Stage:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedStory.educationStage}
                      </strong>
                    </p>
                    {selectedStory.learningSetup && (
                      <p>
                        <span className="text-zinc-500">Learning Place:</span>{" "}
                        <strong className="text-zinc-900">
                          {selectedStory.learningSetup}
                        </strong>
                      </p>
                    )}
                    <p>
                      <span className="text-zinc-500">Her Phone:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedStory.nomineePhone || "Not provided"}
                      </strong>
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                      <Users className="h-3.5 w-3.5" />
                      Contact / Nominator
                    </p>
                    <p>
                      <span className="text-zinc-500">Name:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedStory.nominatorName}
                      </strong>{" "}
                      <span className="text-xs text-zinc-500">
                        ({selectedStory.relationship})
                      </span>
                    </p>
                    <p>
                      <span className="text-zinc-500">Phone:</span>{" "}
                      <strong className="text-zinc-900">
                        {selectedStory.contactPhone}
                      </strong>
                    </p>
                    {selectedStory.contactEmail && (
                      <p>
                        <span className="text-zinc-500">Email:</span>{" "}
                        <strong className="text-zinc-900">
                          {selectedStory.contactEmail}
                        </strong>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={`tel:${selectedStory.contactPhone}`}
                        className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-bold text-brand-purple hover:bg-brand-lavender"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                      <a
                        href={toWhatsAppHref(
                          selectedStory.contactPhone,
                          selectedStory.nomineeName
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
                </div>

                {/* Full Story */}
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Her Story
                  </h3>
                  <div className="mt-2 whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 text-sm leading-relaxed text-zinc-900 sm:text-base">
                    {selectedStory.story}
                  </div>
                </div>

                {selectedStory.additionalDetails && (
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Landmarks &amp; Extra Details
                    </h3>
                    <div className="mt-1.5 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                      {selectedStory.additionalDetails}
                    </div>
                  </div>
                )}

                {/* Status & Admin Review Notes */}
                <div className="mt-6 space-y-4 border-t border-purple-100 pt-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Review Status
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(Object.keys(STATUS_META) as NextStitchStatus[]).map(
                        (statusKey) => {
                          const meta = STATUS_META[statusKey];
                          const active = selectedStory.status === statusKey;
                          return (
                            <button
                              key={statusKey}
                              type="button"
                              disabled={savingUpdate}
                              onClick={() =>
                                patchStory(
                                  selectedStory.id,
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
                        }
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="adminNotes"
                      className="block text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Private Selection Team Notes
                    </label>
                    <textarea
                      id="adminNotes"
                      rows={3}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Write interview notes, call follow-up outcome, or verification details..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={savingUpdate}
                        onClick={() =>
                          patchStory(
                            selectedStory.id,
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
                  Select a story on the left to view full details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
