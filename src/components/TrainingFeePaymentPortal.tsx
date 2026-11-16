"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Link as LinkIcon,
  Printer,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  ADDITIONAL_FEES,
  SITE_CONFIG,
  TRAINING_PROGRAMS,
} from "@/data/siteData";
import { BrandLogo } from "@/components/BrandLogo";

interface DirectFeeReceipt {
  reference: string;
  receiptNo: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  studentId: string;
  purposeTitle: string;
  note: string;
  amountNaira: number;
  paidAt: string;
  channel: string;
}

const RECEIPTS_STORAGE_KEY = "jhf_direct_fee_payments_v1";
const PENDING_STORAGE_KEY = "jhf_direct_fee_pending_v1";

function formatNaira(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "₦0";
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

function generateReceiptNo() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `JHF-FEE-${rand}`;
}

export function TrainingFeePaymentPortal() {
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [studentId, setStudentId] = useState("");
  const [programId, setProgramId] = useState("foundational");
  const [amountInput, setAmountInput] = useState("");
  const [note, setNote] = useState("");

  const [receipts, setReceipts] = useState<DirectFeeReceipt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [originUrl, setOriginUrl] = useState<string>(SITE_CONFIG.domain);

  const isLiveKey = Boolean(
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.startsWith("pk_live_")
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOriginUrl(window.location.origin);

    if (window.PaystackPop) {
      setPaystackReady(true);
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );
      if (existing) {
        existing.addEventListener("load", () => setPaystackReady(true));
      } else {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => setPaystackReady(true);
        document.body.appendChild(script);
      }
    }

    try {
      const saved = localStorage.getItem(RECEIPTS_STORAGE_KEY);
      if (saved) setReceipts(JSON.parse(saved) as DirectFeeReceipt[]);
    } catch {
      // Ignore storage read errors
    }

    const pProgram = searchParams.get("program");
    const pAmount = searchParams.get("amount");
    const pName = searchParams.get("name");
    const pPhone = searchParams.get("phone");
    const pStudentId = searchParams.get("studentId");

    if (
      pProgram &&
      (TRAINING_PROGRAMS.some((p) => p.id === pProgram) ||
        pProgram === "accommodation" ||
        pProgram === "registration" ||
        pProgram === "custom-purpose")
    ) {
      setProgramId(pProgram);
    }
    if (pAmount && Number(pAmount) > 0) setAmountInput(pAmount);
    if (pName) setFullName(pName);
    if (pPhone) setPhoneNumber(pPhone);
    if (pStudentId) setStudentId(pStudentId);

    const ref = searchParams.get("reference") || searchParams.get("trxref");
    if (ref) {
      void verifyRedirectPayment(ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    } catch {
      // Ignore storage write errors
    }
  }, [receipts]);

  const selectedProgram = useMemo(
    () => TRAINING_PROGRAMS.find((p) => p.id === programId) ?? null,
    [programId]
  );

  const purposeTitle = useMemo(() => {
    if (selectedProgram) return `${selectedProgram.title} Tuition`;
    if (programId === "accommodation")
      return "Student Accommodation (3 Months)";
    if (programId === "registration")
      return "Student Registration Form Fee (₦10,000)";
    return "Other Training / Studio Fee";
  }, [programId, selectedProgram]);

  const numericAmount = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "").trim();
    const n = Number(cleaned);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amountInput]);

  const directPayUrl = `${originUrl}/pay`;

  function recordVerifiedReceipt(
    verifyData: {
      reference: string;
      amountNaira: number;
      paidAt: string;
      channel: string;
    },
    details: {
      fullName: string;
      phoneNumber: string;
      emailAddress: string;
      studentId: string;
      purposeTitle: string;
      note: string;
    }
  ) {
    const newReceipt: DirectFeeReceipt = {
      reference: verifyData.reference,
      receiptNo: generateReceiptNo(),
      fullName: details.fullName || "Registered Student",
      phoneNumber: details.phoneNumber || "Not provided",
      emailAddress: details.emailAddress || "Not provided",
      studentId: details.studentId || "Direct Payment",
      purposeTitle: details.purposeTitle,
      note: details.note,
      amountNaira: verifyData.amountNaira,
      paidAt: verifyData.paidAt || new Date().toISOString(),
      channel: verifyData.channel || "paystack",
    };

    setReceipts((prev) => {
      if (prev.some((r) => r.reference === newReceipt.reference)) return prev;
      return [newReceipt, ...prev];
    });
    setStatusSuccess(
      `Payment of ${formatNaira(verifyData.amountNaira)} verified! Your Official Training Fee Receipt is ready below.`
    );
  }

  async function verifyRedirectPayment(reference: string) {
    setIsProcessing(true);
    setStatusError(null);
    try {
      const res = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        setStatusError(
          data.message || "Could not verify Paystack payment reference."
        );
        return;
      }

      let pending: Partial<DirectFeeReceipt> = {};
      try {
        const raw = localStorage.getItem(PENDING_STORAGE_KEY);
        if (raw) pending = JSON.parse(raw) as Partial<DirectFeeReceipt>;
        localStorage.removeItem(PENDING_STORAGE_KEY);
      } catch {
        // Ignore
      }

      const meta = data.data?.metadata ?? {};
      recordVerifiedReceipt(data.data, {
        fullName:
          meta.fullName || pending.fullName || "Registered Student",
        phoneNumber: meta.phoneNumber || pending.phoneNumber || "",
        emailAddress: meta.emailAddress || pending.emailAddress || "",
        studentId: meta.studentId || pending.studentId || "",
        purposeTitle: meta.purpose || pending.purposeTitle || purposeTitle,
        note: meta.note || pending.note || "",
      });
    } catch {
      setStatusError("Network error while verifying payment.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusError(null);
    setStatusSuccess(null);

    if (!fullName.trim()) {
      setStatusError("Please enter the student's Full Name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setStatusError("Please enter an active Phone Number.");
      return;
    }
    if (numericAmount < 100) {
      setStatusError(
        "Please enter a valid payment amount in Naira (minimum ₦100)."
      );
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setStatusError("Paystack public key is not configured.");
      return;
    }

    setIsProcessing(true);

    try {
      const cleanEmail = emailAddress.trim();
      const fallbackTag = (studentId.trim() || `fee-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "");
      const payerEmail = cleanEmail.includes("@")
        ? cleanEmail
        : `${fallbackTag}@jhfacademy.com.ng`;

      const metadata = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        emailAddress: cleanEmail,
        studentId: studentId.trim() || "Direct Fee Link",
        purpose: purposeTitle,
        note: note.trim(),
        paymentType: "direct-custom-amount",
      };

      const callbackUrl = `${window.location.origin}/pay`;

      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payerEmail,
          amountNaira: numericAmount,
          callbackUrl,
          metadata,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok || !initData.status) {
        setStatusError(
          initData.message || "Unable to initialize Paystack checkout."
        );
        setIsProcessing(false);
        return;
      }

      const { reference, authorization_url, effectiveEmail } = initData.data;

      try {
        localStorage.setItem(
          PENDING_STORAGE_KEY,
          JSON.stringify({
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            emailAddress: cleanEmail,
            studentId: studentId.trim(),
            purposeTitle,
            note: note.trim(),
          })
        );
      } catch {
        // Ignore
      }

      if (window.PaystackPop && paystackReady) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: effectiveEmail || payerEmail,
          amount: Math.round(numericAmount * 100),
          currency: "NGN",
          ref: reference,
          metadata,
          callback: (response: { reference: string }) => {
            void (async () => {
              try {
                const verifyRes = await fetch(
                  `/api/paystack/verify?reference=${encodeURIComponent(
                    response.reference || reference
                  )}`
                );
                const verifyJson = await verifyRes.json();
                if (!verifyRes.ok || !verifyJson.status) {
                  setStatusError(
                    verifyJson.message ||
                      "Payment could not be verified. Contact studio support."
                  );
                  return;
                }
                try {
                  localStorage.removeItem(PENDING_STORAGE_KEY);
                } catch {
                  // Ignore
                }
                recordVerifiedReceipt(verifyJson.data, {
                  fullName: fullName.trim(),
                  phoneNumber: phoneNumber.trim(),
                  emailAddress: cleanEmail,
                  studentId: studentId.trim(),
                  purposeTitle,
                  note: note.trim(),
                });
              } catch {
                setStatusError("Network error verifying Paystack payment.");
              } finally {
                setIsProcessing(false);
              }
            })();
          },
          onClose: () => {
            setIsProcessing(false);
            setStatusError(
              "Payment window closed before completion. You can try again anytime."
            );
          },
        });
        handler.openIframe();
      } else if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        setStatusError("Paystack script failed to load. Please refresh.");
        setIsProcessing(false);
      }
    } catch {
      setStatusError("Network error connecting to Paystack.");
      setIsProcessing(false);
    }
  }

  function handleCopyLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(directPayUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }

  const quickAmounts = useMemo(() => {
    if (selectedProgram) {
      const q = Math.round(selectedProgram.priceNaira / 4);
      const h = Math.round(selectedProgram.priceNaira / 2);
      return [
        { label: `25% (${formatNaira(q)})`, value: q },
        { label: `50% (${formatNaira(h)})`, value: h },
        {
          label: `Full (${formatNaira(selectedProgram.priceNaira)})`,
          value: selectedProgram.priceNaira,
        },
        { label: "₦50,000", value: 50000 },
      ];
    }
    if (programId === "accommodation") {
      return [{ label: "₦50,000 (3 Mos)", value: 50000 }];
    }
    if (programId === "registration") {
      return [{ label: "₦10,000 (Reg Fee)", value: 10000 }];
    }
    return [
      { label: "₦25,000", value: 25000 },
      { label: "₦50,000", value: 50000 },
      { label: "₦100,000", value: 100000 },
      { label: "₦150,000", value: 150000 },
    ];
  }, [programId, selectedProgram]);

  return (
    <div className="space-y-8">
      {/* Shareable Direct Payment Link Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-200 bg-white p-4 shadow-sm sm:px-6">
        <div className="space-y-0.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
            <LinkIcon className="h-3.5 w-3.5" />
            Direct Training Fee Payment Link
          </p>
          <p className="font-mono text-xs font-semibold text-zinc-800 sm:text-sm">
            {directPayUrl}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-brand-lavender/60 px-3.5 py-2 text-xs font-bold text-brand-purple transition hover:bg-brand-lavender"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Payment Link
              </>
            )}
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isLiveKey ? "Secured by Paystack" : "Secured by Paystack (Test Mode)"}
          </span>
        </div>
      </div>

      {/* Feedback Alerts */}
      {statusError && (
        <div className="no-print rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
          {statusError}
        </div>
      )}
      {statusSuccess && (
        <div className="no-print rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          {statusSuccess}
        </div>
      )}

      {/* Main Payment Form & Summary */}
      <form
        onSubmit={handleSubmit}
        className="no-print grid gap-8 lg:grid-cols-12"
      >
        <div className="space-y-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8">
          <div className="border-b border-purple-100 pb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-purple">
              JULIAN HOUSE OF FASHION ACADEMY
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
              Enter Student Details &amp; Amount to Pay
            </h2>
            <p className="mt-1.5 text-sm text-zinc-600">
              Type any amount you want to pay towards your training tuition,
              part-payment, accommodation, or fees and pay instantly online.
            </p>
          </div>

          {/* Highlighted Custom Amount Input */}
          <div className="rounded-2xl border-2 border-brand-purple/25 bg-brand-lavender/40 p-5">
            <label
              htmlFor="custom-fee-amount"
              className="flex items-center gap-2 text-sm font-bold text-brand-purple"
            >
              <Wallet className="h-4 w-4" />
              Amount You Want to Pay (₦) *
            </label>
            <div className="relative mt-2.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-serif text-2xl font-bold text-brand-purple">
                ₦
              </span>
              <input
                id="custom-fee-amount"
                required
                type="number"
                min={100}
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full rounded-xl border-2 border-purple-200 bg-white py-3.5 pl-11 pr-4 font-serif text-2xl font-bold text-zinc-950 outline-none transition focus:border-brand-purple"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-600">
                Quick-fill:
              </span>
              {quickAmounts.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setAmountInput(String(q.value))}
                  className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-bold text-brand-purple transition hover:bg-brand-purple hover:text-white"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fee-full-name"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Student Full Name *
              </label>
              <input
                id="fee-full-name"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Zainab Musa"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label
                htmlFor="fee-phone"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Phone Number (WhatsApp / Call) *
              </label>
              <input
                id="fee-phone"
                required
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0803 000 0000"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label
                htmlFor="fee-programme"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Training Programme / Fee Purpose *
              </label>
              <select
                id="fee-programme"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-900 outline-none focus:border-brand-purple"
              >
                {TRAINING_PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.priceFormatted} ({p.duration})
                  </option>
                ))}
                <option value="accommodation">
                  Student Accommodation —{" "}
                  {ADDITIONAL_FEES.accommodationFormatted} (3 mos)
                </option>
                <option value="registration">
                  Registration Fee — {ADDITIONAL_FEES.registrationFormatted}
                </option>
                <option value="custom-purpose">
                  Other Training / Studio Fee
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fee-email"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Email Address (Optional, for Paystack e-receipt)
              </label>
              <input
                id="fee-email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="student@example.com"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label
                htmlFor="fee-student-id"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Student ID (Optional)
              </label>
              <input
                id="fee-student-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. JHF-2026-1234"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label
                htmlFor="fee-note"
                className="mb-1.5 block text-xs font-semibold text-zinc-800"
              >
                Payment Note / Remark (Optional)
              </label>
              <input
                id="fee-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. First part payment / Balance"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            New student filling out the Student Registration &amp; Agreement
            Form for the first time?{" "}
            <Link
              href="/register"
              className="font-bold text-brand-purple hover:underline"
            >
              Complete your ₦10,000 Registration Form here →
            </Link>
          </p>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl bg-brand-purple p-6 text-white shadow-xl sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Training Fee Checkout
            </span>

            <h3 className="mt-4 font-serif text-2xl font-bold">
              {purposeTitle}
            </h3>
            <p className="mt-1 text-xs text-purple-200">
              {fullName.trim() || "Enter student name"}
              {phoneNumber.trim() ? ` • ${phoneNumber.trim()}` : ""}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-white/15 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-100">Purpose</span>
                <span className="font-semibold text-right">{purposeTitle}</span>
              </div>
              {selectedProgram && (
                <div className="flex justify-between">
                  <span className="text-purple-100">Full Course Fee</span>
                  <span className="font-semibold">
                    {selectedProgram.priceFormatted}
                  </span>
                </div>
              )}
              {note.trim() && (
                <div className="flex justify-between">
                  <span className="text-purple-100">Note</span>
                  <span className="font-semibold text-right">{note.trim()}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-white/20 pt-4">
              <span className="text-sm font-semibold text-purple-100">
                Amount to Pay Now
              </span>
              <span className="font-serif text-4xl font-bold text-brand-gold">
                {formatNaira(numericAmount)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-4 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-amber-300 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {isProcessing
                ? "Connecting to Paystack..."
                : numericAmount > 0
                ? `Pay ${formatNaira(numericAmount)} Now via Paystack`
                : "Pay Now via Paystack"}
            </button>

            <p className="mt-3 text-center text-[11px] text-purple-200">
              Supports Nigerian Bank Cards, Transfer, USSD, OPAY &amp; Bank Apps.
            </p>
          </div>
        </div>
      </form>

      {/* Printable Receipts */}
      {receipts.length > 0 && (
        <section className="print-card rounded-3xl border-2 border-purple-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-5">
            <div>
              <BrandLogo showTagline />
              <h3 className="mt-3 font-serif text-2xl font-bold text-zinc-950">
                Official Training Fee Payment Receipt(s)
              </h3>
              <p className="text-xs text-zinc-600">
                {SITE_CONFIG.address.full} • Tel: {SITE_CONFIG.phoneDisplay}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-2 rounded-xl bg-brand-purple px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-violet"
            >
              <Printer className="h-4 w-4 text-brand-gold" />
              Print / Save PDF Receipt
            </button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-purple-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-lavender text-xs font-bold uppercase text-brand-purple">
                <tr>
                  <th className="px-4 py-3">Receipt No</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Purpose / Note</th>
                  <th className="px-4 py-3">Paystack Ref</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {receipts.map((r) => (
                  <tr key={r.reference}>
                    <td className="px-4 py-3 font-bold text-zinc-900">
                      {r.receiptNo}
                    </td>
                    <td className="px-4 py-3 text-zinc-800">
                      <p className="font-semibold">{r.fullName}</p>
                      <p className="text-xs text-zinc-500">
                        {r.phoneNumber}
                        {r.studentId ? ` • ${r.studentId}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      <p>{r.purposeTitle}</p>
                      {r.note && (
                        <p className="text-xs text-zinc-500">{r.note}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-700">
                      {r.reference}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {new Date(r.paidAt).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-purple">
                      {formatNaira(r.amountNaira)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
