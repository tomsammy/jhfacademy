"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Printer,
  CheckCircle2,
  BookOpen,
  FileText,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Home,
  Link as LinkIcon,
  Copy,
  Check,
  RefreshCw,
  ScrollText,
} from "lucide-react";
import {
  SITE_CONFIG,
  TRAINING_PROGRAMS,
  ADDITIONAL_FEES,
  TrainingProgram,
} from "@/data/siteData";
import { BrandLogo } from "@/components/BrandLogo";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const HEARD_ABOUT_OPTIONS = [
  "Instagram",
  "Facebook",
  "TikTok",
  "Google Search",
  "Referral from a friend/family member",
  "Previous student",
  "Walk-in",
  "Other",
] as const;

const PROGRAMME_CHOICES = [
  { id: "foundational", label: "Foundation", meta: "₦150,000 • 3 months" },
  { id: "intermediate", label: "Intermediate", meta: "₦150,000 • 3 months" },
  { id: "advanced", label: "Advanced", meta: "₦200,000 • 3 months" },
  {
    id: "full-programme",
    label: "Full Programme (Foundation + Intermediate + Advanced)",
    meta: "₦500,000 • 9 months",
  },
  {
    id: "male-fashion",
    label: "Male Fashion Design",
    meta: "₦250,000 • 4 months",
  },
  {
    id: "other",
    label: "Other (please specify)",
    meta: "Custom inquiry / short module",
  },
] as const;

const SCHOOL_RULES = [
  {
    title: "1. Use of Student Pictures",
    body: "Pictures and videos taken during training, practical sessions and school activities may be used on Julian House of Fashion's social media platforms and other promotional materials for documentation and publicity purposes.",
  },
  {
    title: "2. Care of School Property",
    body: "Students are expected to handle all school equipment, tools, furniture and other properties with care. Any damage resulting from negligence or carelessness on the part of a student will be the responsibility of that student, who will be required to repair or replace the damaged property.",
  },
  {
    title: "3. Phone Usage During Classes",
    body: "Making or receiving phone calls during teaching sessions is not permitted. Students are expected to give their full attention to lessons. Phones should be kept on silent mode during classes. Exceptions may be made for emergencies with the tutor's permission.",
  },
  {
    title: "4. Discipline and Respect",
    body: "Discipline, respect and proper conduct are essential. Students are expected to respect their tutors, fellow students, school rules and the general learning environment.",
  },
  {
    title: "5. Cleanliness and Personal Responsibility",
    body: "Every student is responsible for keeping the school environment clean. Workspaces must be properly arranged, and students are expected to clean up after themselves before leaving, including disposing of waste and returning tools and materials to their appropriate places.",
  },
  {
    title: "6. Payment and Refund Policy",
    body: "All payments made towards training are non-refundable once a student has commenced classes. Where a student has made payment but has not commenced training, refund requests will be treated separately and subject to management's consideration.",
  },
];

interface StudentFormState {
  studentId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  guardianName: string;
  guardianPhone: string;
  heardAbout: string;
  heardAboutOther: string;
  programmeChoice: string;
  programmeOtherText: string;
  wantsAccommodation: boolean;
  agreePolicies: boolean;
  agreePublicity: boolean;
  agreeRefundPolicy: boolean;
  electronicSignature: string;
  registrationDate: string;
}

interface VerifiedPaymentRecord {
  reference: string;
  receiptNo: string;
  purpose: "registration" | "tuition";
  amountNaira: number;
  paidAt: string;
  channel: string;
  installmentsCovered?: number;
  accommodationIncluded?: boolean;
  description: string;
}

interface StoredStudentState {
  form: StudentFormState;
  registrationPayment: VerifiedPaymentRecord | null;
  tuitionPayments: VerifiedPaymentRecord[];
}

const STORAGE_KEY = "jhf_student_portal_v2";
const PENDING_KEY = "jhf_pending_payment_v2";

function getTodayIso() {
  return new Date().toISOString().split("T")[0];
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function generateStudentId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JHF-${year}-${rand}`;
}

function generateReceiptNo(prefix: string) {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${rand}`;
}

const DEFAULT_FORM: StudentFormState = {
  studentId: "",
  fullName: "",
  phoneNumber: "",
  emailAddress: "",
  guardianName: "",
  guardianPhone: "",
  heardAbout: "Instagram",
  heardAboutOther: "",
  programmeChoice: "foundational",
  programmeOtherText: "",
  wantsAccommodation: false,
  agreePolicies: false,
  agreePublicity: false,
  agreeRefundPolicy: false,
  electronicSignature: "",
  registrationDate: getTodayIso(),
};

export function StudentRegistrationPortal() {
  const searchParams = useSearchParams();
  const tuitionSectionRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<StudentFormState>(DEFAULT_FORM);
  const [registrationPayment, setRegistrationPayment] =
    useState<VerifiedPaymentRecord | null>(null);
  const [tuitionPayments, setTuitionPayments] = useState<
    VerifiedPaymentRecord[]
  >([]);

  const [activeView, setActiveView] = useState<"form" | "slip" | "tuition">(
    "form"
  );
  const [installmentsToPay, setInstallmentsToPay] = useState<number>(1);
  const [includeAccommodationInTuition, setIncludeAccommodationInTuition] =
    useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [paystackReady, setPaystackReady] = useState<boolean>(false);
  const [originUrl, setOriginUrl] = useState<string>(SITE_CONFIG.domain);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOriginUrl(window.location.origin);

    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => setPaystackReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const paramProgram = searchParams.get("program");
    const paramStep = searchParams.get("step");
    const paramRef =
      searchParams.get("reference") || searchParams.get("trxref");

    let loadedState: StoredStudentState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loadedState = JSON.parse(raw) as StoredStudentState;
    } catch {
      loadedState = null;
    }

    if (loadedState?.form) {
      const mergedForm: StudentFormState = {
        ...DEFAULT_FORM,
        ...loadedState.form,
        programmeChoice:
          paramProgram &&
          PROGRAMME_CHOICES.some((p) => p.id === paramProgram) &&
          !loadedState.registrationPayment
            ? paramProgram
            : loadedState.form.programmeChoice,
      };
      setForm(mergedForm);
      setRegistrationPayment(loadedState.registrationPayment);
      setTuitionPayments(loadedState.tuitionPayments || []);
      setIncludeAccommodationInTuition(Boolean(mergedForm.wantsAccommodation));

      if (loadedState.registrationPayment) {
        setActiveView(paramStep === "tuition" ? "tuition" : "slip");
      } else if (paramStep === "tuition") {
        setActiveView("tuition");
      }
    } else {
      setForm((prev) => ({
        ...prev,
        studentId: prev.studentId || generateStudentId(),
        programmeChoice:
          paramProgram && PROGRAMME_CHOICES.some((p) => p.id === paramProgram)
            ? paramProgram
            : prev.programmeChoice,
      }));
      if (paramStep === "tuition") {
        setActiveView("tuition");
      }
    }

    if (paramRef) {
      void verifyRedirectPayment(paramRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !form.studentId) return;
    try {
      const payload: StoredStudentState = {
        form,
        registrationPayment,
        tuitionPayments,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota issues
    }
  }, [form, registrationPayment, tuitionPayments]);

  const selectedProgram: TrainingProgram = useMemo(() => {
    return (
      TRAINING_PROGRAMS.find((p) => p.id === form.programmeChoice) ??
      TRAINING_PROGRAMS[0]
    );
  }, [form.programmeChoice]);

  const programmeDisplayTitle =
    form.programmeChoice === "other"
      ? `Other: ${form.programmeOtherText.trim() || "Custom Training"}`
      : selectedProgram.title;

  const quarterTuition = Math.round(selectedProgram.priceNaira / 4);
  const installmentsPaidCount = useMemo(
    () =>
      Math.min(
        4,
        tuitionPayments.reduce(
          (sum, p) => sum + (p.installmentsCovered ?? 0),
          0
        )
      ),
    [tuitionPayments]
  );
  const tuitionPaidAmount = useMemo(
    () =>
      tuitionPayments.reduce(
        (sum, p) =>
          sum +
          (p.installmentsCovered ? p.installmentsCovered * quarterTuition : 0),
        0
      ),
    [tuitionPayments, quarterTuition]
  );
  const accommodationPaid = useMemo(
    () => tuitionPayments.some((p) => p.accommodationIncluded),
    [tuitionPayments]
  );

  const remainingInstallments = Math.max(0, 4 - installmentsPaidCount);
  const remainingTuitionBalance = Math.max(
    0,
    selectedProgram.priceNaira - tuitionPaidAmount
  );

  useEffect(() => {
    if (remainingInstallments > 0 && installmentsToPay > remainingInstallments) {
      setInstallmentsToPay(remainingInstallments);
    }
  }, [remainingInstallments, installmentsToPay]);

  const tuitionPayLink = `${originUrl}/register?step=tuition&studentId=${encodeURIComponent(
    form.studentId || "JHF-STUDENT"
  )}&program=${encodeURIComponent(selectedProgram.id)}`;

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

      let pendingMeta: {
        purpose?: "registration" | "tuition";
        installmentsCovered?: number;
        accommodationIncluded?: boolean;
        description?: string;
      } = {};
      try {
        const rawPending = localStorage.getItem(PENDING_KEY);
        if (rawPending) pendingMeta = JSON.parse(rawPending);
        localStorage.removeItem(PENDING_KEY);
      } catch {
        // Ignore
      }

      const purpose =
        data.data?.metadata?.purpose || pendingMeta.purpose || "registration";

      if (purpose === "registration") {
        const record: VerifiedPaymentRecord = {
          reference: data.data.reference,
          receiptNo: generateReceiptNo("JHF-REG"),
          purpose: "registration",
          amountNaira: data.data.amountNaira,
          paidAt: data.data.paidAt,
          channel: data.data.channel,
          description: `Student Registration & Agreement Form (${programmeDisplayTitle})`,
        };
        setRegistrationPayment(record);
        setActiveView("slip");
        setStatusSuccess(
          "₦10,000 Registration Payment verified! Your Receipt & Acknowledgement Slip are ready to print."
        );
      } else {
        const installments =
          Number(data.data?.metadata?.installmentsCovered) ||
          pendingMeta.installmentsCovered ||
          1;
        const accIncluded = Boolean(
          data.data?.metadata?.accommodationIncluded ??
            pendingMeta.accommodationIncluded
        );
        const record: VerifiedPaymentRecord = {
          reference: data.data.reference,
          receiptNo: generateReceiptNo("JHF-TUI"),
          purpose: "tuition",
          amountNaira: data.data.amountNaira,
          paidAt: data.data.paidAt,
          channel: data.data.channel,
          installmentsCovered: installments,
          accommodationIncluded: accIncluded,
          description: `${selectedProgram.title} — ${
            installments * 25
          }% Tuition Installment${accIncluded ? " + Accommodation" : ""}`,
        };
        setTuitionPayments((prev) =>
          prev.some((p) => p.reference === record.reference)
            ? prev
            : [...prev, record]
        );
        setActiveView("tuition");
        setStatusSuccess(
          `Course tuition payment of ${formatNaira(
            data.data.amountNaira
          )} verified!`
        );
      }

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("reference");
        url.searchParams.delete("trxref");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      setStatusError("Network error while verifying Paystack transaction.");
    } finally {
      setIsProcessing(false);
    }
  }

  function validateRegistrationForm(): string | null {
    if (!form.fullName.trim()) {
      return "Section 1: Please enter your Full Name.";
    }
    if (!form.phoneNumber.trim()) {
      return "Section 1: Please enter your Phone Number.";
    }
    if (!form.guardianName.trim()) {
      return "Section 1: Please enter your Parent/Guardian's Full Name.";
    }
    if (!form.guardianPhone.trim()) {
      return "Section 1: Please enter your Parent/Guardian's Phone Number (Emergency Contact).";
    }
    if (form.heardAbout === "Other" && !form.heardAboutOther.trim()) {
      return "Section 1: Please specify how you heard about Julian House of Fashion.";
    }
    if (form.programmeChoice === "other" && !form.programmeOtherText.trim()) {
      return "Section 1: Please specify the programme you are enrolling for.";
    }
    if (
      !form.agreePolicies ||
      !form.agreePublicity ||
      !form.agreeRefundPolicy
    ) {
      return "Section 3: Please check all three required agreement & acknowledgement boxes before proceeding to payment.";
    }
    if (!form.electronicSignature.trim()) {
      return "Section 3: Please type your full name as your Electronic Signature.";
    }
    if (!form.registrationDate) {
      return "Section 3: Please select the Date of Registration.";
    }
    return null;
  }

  async function launchPaystackCheckout(options: {
    amountNaira: number;
    purpose: "registration" | "tuition";
    description: string;
    installmentsCovered?: number;
    accommodationIncluded?: boolean;
  }) {
    setStatusError(null);
    setStatusSuccess(null);

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setStatusError("Paystack public key is not configured.");
      return;
    }

    setIsProcessing(true);

    try {
      const assignedStudentId = form.studentId || generateStudentId();
      if (!form.studentId) {
        setForm((prev) => ({ ...prev, studentId: assignedStudentId }));
      }

      const cleanEmail = form.emailAddress.trim();
      const payerEmail = cleanEmail.includes("@")
        ? cleanEmail
        : `${assignedStudentId.toLowerCase()}@jhfacademy.com.ng`;

      const metadata = {
        studentId: assignedStudentId,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        heardAbout:
          form.heardAbout === "Other"
            ? `Other: ${form.heardAboutOther}`
            : form.heardAbout,
        programme: programmeDisplayTitle,
        electronicSignature: form.electronicSignature,
        registrationDate: form.registrationDate,
        purpose: options.purpose,
        installmentsCovered: options.installmentsCovered ?? 0,
        accommodationIncluded: Boolean(options.accommodationIncluded),
      };

      const callbackUrl = `${window.location.origin}/register?step=${
        options.purpose === "tuition" ? "tuition" : "slip"
      }`;

      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payerEmail,
          amountNaira: options.amountNaira,
          callbackUrl,
          metadata,
        }),
      });

      const initData = await initRes.json();

      if (!initRes.ok || !initData.status) {
        setStatusError(
          initData.message || "Unable to start Paystack checkout."
        );
        setIsProcessing(false);
        return;
      }

      const { reference, authorization_url, effectiveEmail } = initData.data;

      try {
        localStorage.setItem(
          PENDING_KEY,
          JSON.stringify({
            purpose: options.purpose,
            installmentsCovered: options.installmentsCovered,
            accommodationIncluded: options.accommodationIncluded,
            description: options.description,
          })
        );
      } catch {
        // Ignore
      }

      if (window.PaystackPop && paystackReady) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: effectiveEmail || payerEmail,
          amount: Math.round(options.amountNaira * 100),
          currency: "NGN",
          ref: reference,
          metadata,
          callback: (response: { reference: string }) => {
            void verifyAndRecordInline(
              response.reference || reference,
              options
            );
          },
          onClose: () => {
            setIsProcessing(false);
            setStatusError(
              "Payment window was closed before completion. You can resume payment anytime."
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

  async function verifyAndRecordInline(
    reference: string,
    options: {
      amountNaira: number;
      purpose: "registration" | "tuition";
      description: string;
      installmentsCovered?: number;
      accommodationIncluded?: boolean;
    }
  ) {
    try {
      const res = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
      );
      const data = await res.json();
      if (!res.ok || !data.status) {
        setStatusError(
          data.message || "Payment verification failed. Contact studio support."
        );
        setIsProcessing(false);
        return;
      }

      try {
        localStorage.removeItem(PENDING_KEY);
      } catch {
        // Ignore
      }

      if (options.purpose === "registration") {
        const record: VerifiedPaymentRecord = {
          reference: data.data.reference,
          receiptNo: generateReceiptNo("JHF-REG"),
          purpose: "registration",
          amountNaira: data.data.amountNaira,
          paidAt: data.data.paidAt,
          channel: data.data.channel,
          description: options.description,
        };
        setRegistrationPayment(record);
        setActiveView("slip");
        setStatusSuccess(
          "₦10,000 Registration Payment verified! Print your Official Receipt & Acknowledgement Slip below."
        );
      } else {
        const record: VerifiedPaymentRecord = {
          reference: data.data.reference,
          receiptNo: generateReceiptNo("JHF-TUI"),
          purpose: "tuition",
          amountNaira: data.data.amountNaira,
          paidAt: data.data.paidAt,
          channel: data.data.channel,
          installmentsCovered: options.installmentsCovered,
          accommodationIncluded: options.accommodationIncluded,
          description: options.description,
        };
        setTuitionPayments((prev) => [...prev, record]);
        setIncludeAccommodationInTuition(false);
        setActiveView("tuition");
        setStatusSuccess(
          `Course tuition payment of ${formatNaira(
            data.data.amountNaira
          )} verified!`
        );
      }
    } catch {
      setStatusError("Could not verify payment with Paystack.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleRegistrationSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateRegistrationForm();
    if (validationError) {
      setStatusError(validationError);
      return;
    }

    void launchPaystackCheckout({
      amountNaira: ADDITIONAL_FEES.registrationFee,
      purpose: "registration",
      description: `Student Registration & Agreement Form (${programmeDisplayTitle})`,
    });
  }

  function handleTuitionSubmit() {
    const tuitionPart =
      installmentsToPay === remainingInstallments
        ? remainingTuitionBalance
        : installmentsToPay * quarterTuition;
    const accPart =
      includeAccommodationInTuition && !accommodationPaid
        ? ADDITIONAL_FEES.accommodationFeePerBlock
        : 0;
    const totalNow = tuitionPart + accPart;

    if (totalNow <= 0) {
      setStatusError("Your course tuition is already paid in full.");
      return;
    }

    void launchPaystackCheckout({
      amountNaira: totalNow,
      purpose: "tuition",
      installmentsCovered: installmentsToPay,
      accommodationIncluded: accPart > 0,
      description: `${selectedProgram.title} — ${
        installmentsToPay * 25
      }% Tuition Payment${accPart > 0 ? " + 3-Month Accommodation" : ""}`,
    });
  }

  function handleCopyTuitionLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(tuitionPayLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }

  function handleStartNewRegistration() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PENDING_KEY);
    } catch {
      // Ignore
    }
    setForm({
      ...DEFAULT_FORM,
      studentId: generateStudentId(),
      registrationDate: getTodayIso(),
    });
    setRegistrationPayment(null);
    setTuitionPayments([]);
    setStatusError(null);
    setStatusSuccess(null);
    setActiveView("form");
  }

  const tuitionSelectedAmount =
    (installmentsToPay === remainingInstallments
      ? remainingTuitionBalance
      : installmentsToPay * quarterTuition) +
    (includeAccommodationInTuition && !accommodationPaid
      ? ADDITIONAL_FEES.accommodationFeePerBlock
      : 0);

  const heardAboutDisplay =
    form.heardAbout === "Other"
      ? `Other (${form.heardAboutOther || "Unspecified"})`
      : form.heardAbout;

  return (
    <div className="space-y-8">
      {/* Top Step Switcher (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveView("form")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
              activeView === "form"
                ? "bg-brand-purple text-white"
                : "text-zinc-700 hover:bg-brand-lavender"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
              1
            </span>
            Registration &amp; Agreement Form (₦10,000)
          </button>

          <button
            type="button"
            disabled={!registrationPayment}
            onClick={() => setActiveView("slip")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
              activeView === "slip"
                ? "bg-brand-purple text-white"
                : registrationPayment
                ? "text-zinc-700 hover:bg-brand-lavender"
                : "cursor-not-allowed text-zinc-400"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/25 text-[11px]">
              2
            </span>
            Receipt &amp; Acknowledgement Slip
          </button>

          <button
            type="button"
            onClick={() => setActiveView("tuition")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
              activeView === "tuition"
                ? "bg-brand-purple text-white"
                : "text-zinc-700 hover:bg-brand-lavender"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/25 text-[11px]">
              3
            </span>
            Pay Course Tuition (25% × 4)
          </button>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secured by Paystack (Test Mode)
        </span>
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

      {/* ==================== STAGE 1: STUDENT REGISTRATION & AGREEMENT FORM ==================== */}
      {activeView === "form" && (
        <form
          onSubmit={handleRegistrationSubmit}
          className="no-print grid gap-8 lg:grid-cols-12"
        >
          <div className="space-y-8 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8">
            {/* Form Title & Welcome Header */}
            <div className="border-b border-purple-100 pb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-purple">
                JULIAN HOUSE OF FASHION
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-zinc-950">
                STUDENT REGISTRATION &amp; AGREEMENT FORM
              </h2>
              <p className="mt-3 text-sm font-semibold text-brand-purple">
                Welcome to Julian House of Fashion!
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">
                We are delighted to have you consider joining our fashion
                training programme. This form is designed to collect your
                registration details and ensure that every student understands
                and agrees to the school&apos;s rules and regulations. Please
                complete the form carefully and read through the policies before
                submitting.
              </p>
            </div>

            {registrationPayment && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    Registration Already Paid ({registrationPayment.receiptNo})
                  </p>
                  <p className="text-xs text-emerald-700">
                    Your Receipt &amp; Acknowledgement Slip are ready to print.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView("slip")}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  View Printable Slip →
                </button>
              </div>
            )}

            {/* SECTION 1: STUDENT INFORMATION */}
            <div className="space-y-5">
              <div className="border-b border-purple-100 pb-2">
                <h3 className="font-serif text-2xl font-bold text-brand-purple">
                  SECTION 1: STUDENT INFORMATION
                </h3>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
                  1. Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
                    2. Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    placeholder="e.g. 0803 123 4567"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
                    3. Email Address{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={form.emailAddress}
                    onChange={(e) =>
                      setForm({ ...form, emailAddress: e.target.value })
                    }
                    placeholder="student@example.com (for e-receipt)"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
                  4. Parent/Guardian&apos;s Full Name{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.guardianName}
                  onChange={(e) =>
                    setForm({ ...form, guardianName: e.target.value })
                  }
                  placeholder="Enter parent or guardian's full name"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
                  5. Parent/Guardian&apos;s Phone Number (Emergency Contact){" "}
                  <span className="text-red-600">*</span>
                </label>
                <p className="mb-2 text-xs leading-relaxed text-zinc-500">
                  Please provide an active phone number belonging to your
                  parent, guardian or a trusted emergency contact. This number
                  will be used to reach someone on your behalf if an emergency
                  arises during your training.
                </p>
                <input
                  required
                  type="tel"
                  value={form.guardianPhone}
                  onChange={(e) =>
                    setForm({ ...form, guardianPhone: e.target.value })
                  }
                  placeholder="Enter active emergency contact phone number"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  6. How did you hear about Julian House of Fashion?{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {HEARD_ABOUT_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                        form.heardAbout === opt
                          ? "border-brand-purple bg-brand-lavender font-semibold text-brand-purple"
                          : "border-zinc-200 text-zinc-700 hover:border-purple-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="heardAbout"
                        value={opt}
                        checked={form.heardAbout === opt}
                        onChange={(e) =>
                          setForm({ ...form, heardAbout: e.target.value })
                        }
                        className="h-4 w-4 text-brand-purple"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {form.heardAbout === "Other" && (
                  <input
                    type="text"
                    value={form.heardAboutOther}
                    onChange={(e) =>
                      setForm({ ...form, heardAboutOther: e.target.value })
                    }
                    placeholder="Please specify how you heard about us"
                    className="mt-2.5 w-full rounded-xl border border-purple-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
                  />
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-900">
                  7. Which programme are you enrolling for?{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="space-y-2">
                  {PROGRAMME_CHOICES.map((prog) => (
                    <label
                      key={prog.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                        form.programmeChoice === prog.id
                          ? "border-brand-purple bg-brand-lavender ring-1 ring-brand-purple/20"
                          : "border-zinc-200 hover:border-purple-200"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 font-semibold text-zinc-900">
                        <input
                          type="radio"
                          name="programmeChoice"
                          value={prog.id}
                          checked={form.programmeChoice === prog.id}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              programmeChoice: e.target.value,
                            })
                          }
                          className="h-4 w-4 text-brand-purple"
                        />
                        {prog.label}
                      </span>
                      <span className="text-xs font-bold text-brand-purple">
                        {prog.meta}
                      </span>
                    </label>
                  ))}
                </div>

                {form.programmeChoice === "other" && (
                  <input
                    type="text"
                    value={form.programmeOtherText}
                    onChange={(e) =>
                      setForm({ ...form, programmeOtherText: e.target.value })
                    }
                    placeholder="Please specify the programme"
                    className="mt-2.5 w-full rounded-xl border border-purple-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
                  />
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-purple-100 bg-brand-lavender/50 p-4">
                <input
                  type="checkbox"
                  checked={form.wantsAccommodation}
                  onChange={(e) => {
                    setForm({ ...form, wantsAccommodation: e.target.checked });
                    setIncludeAccommodationInTuition(e.target.checked);
                  }}
                  className="mt-1 h-4 w-4 rounded border-purple-300 text-brand-purple"
                />
                <span className="text-xs leading-relaxed text-zinc-700">
                  <strong className="block text-sm text-zinc-900">
                    Optional: Reserve Comfortable Student Accommodation (₦50,000
                    for 3 months)
                  </strong>
                  Check this box if you are coming from outside Ilorin and would
                  like accommodation arranged.
                </span>
              </label>
            </div>

            {/* SECTION 2: SCHOOL RULES AND REGULATIONS */}
            <div className="space-y-4 border-t border-purple-100 pt-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-purple">
                  SECTION 2: SCHOOL RULES AND REGULATIONS
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  STUDENT CODE OF CONDUCT AND AGREEMENT
                </p>
                <p className="mt-2 text-sm text-zinc-700">
                  At Julian House of Fashion, we are committed to maintaining a
                  conducive, respectful and disciplined learning environment.
                  All students are expected to understand and abide by the
                  following rules throughout their training.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-purple-200 bg-brand-lavender/35 p-5">
                {SCHOOL_RULES.map((rule) => (
                  <div
                    key={rule.title}
                    className="rounded-xl border border-purple-100 bg-white p-4"
                  >
                    <h4 className="text-sm font-bold text-brand-purple">
                      {rule.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-700 sm:text-sm">
                      {rule.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: STUDENT ACKNOWLEDGEMENT AND SIGNATURE */}
            <div className="space-y-5 border-t border-purple-100 pt-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-purple">
                  SECTION 3: STUDENT ACKNOWLEDGEMENT AND SIGNATURE
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Please read and confirm each statement below.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-200 bg-white p-4 hover:bg-brand-lavender/30">
                  <input
                    required
                    type="checkbox"
                    checked={form.agreePolicies}
                    onChange={(e) =>
                      setForm({ ...form, agreePolicies: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-purple-300 text-brand-purple"
                  />
                  <span className="text-sm text-zinc-800">
                    <strong className="block text-xs font-bold uppercase tracking-wide text-brand-purple">
                      1. Agreement to School Policies *
                    </strong>
                    I have read, understood and agreed to abide by the rules and
                    regulations of Julian House of Fashion.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-200 bg-white p-4 hover:bg-brand-lavender/30">
                  <input
                    required
                    type="checkbox"
                    checked={form.agreePublicity}
                    onChange={(e) =>
                      setForm({ ...form, agreePublicity: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-purple-300 text-brand-purple"
                  />
                  <span className="text-sm text-zinc-800">
                    <strong className="block text-xs font-bold uppercase tracking-wide text-brand-purple">
                      2. Photography and Publicity Acknowledgement *
                    </strong>
                    I understand and acknowledge that my pictures and videos
                    taken during school activities may be used for the
                    school&apos;s publicity and promotional purposes.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-200 bg-white p-4 hover:bg-brand-lavender/30">
                  <input
                    required
                    type="checkbox"
                    checked={form.agreeRefundPolicy}
                    onChange={(e) =>
                      setForm({ ...form, agreeRefundPolicy: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-purple-300 text-brand-purple"
                  />
                  <span className="text-sm text-zinc-800">
                    <strong className="block text-xs font-bold uppercase tracking-wide text-brand-purple">
                      3. Payment Policy Acknowledgement *
                    </strong>
                    I understand and agree to the school&apos;s no-refund policy
                    after commencement of training.
                  </span>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-zinc-900">
                    4. Electronic Signature <span className="text-red-600">*</span>
                  </label>
                  <p className="mb-1.5 text-xs text-zinc-500">
                    Please type your full name below as your electronic
                    signature to confirm your acceptance of these terms.
                  </p>
                  <input
                    required
                    type="text"
                    value={form.electronicSignature}
                    onChange={(e) =>
                      setForm({ ...form, electronicSignature: e.target.value })
                    }
                    placeholder="Type your full name"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 font-serif text-base italic text-zinc-900 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-zinc-900">
                    5. Date of Registration{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <p className="mb-1.5 text-xs text-zinc-500">
                    Confirm today&apos;s registration date.
                  </p>
                  <input
                    required
                    type="date"
                    value={form.registrationDate}
                    onChange={(e) =>
                      setForm({ ...form, registrationDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* FINAL NOTE */}
              <div className="rounded-2xl border border-purple-200 bg-brand-lavender/60 p-5 text-xs leading-relaxed text-zinc-700 sm:text-sm">
                <p className="font-bold uppercase tracking-wider text-brand-purple">
                  FINAL NOTE
                </p>
                <p className="mt-1.5">
                  By submitting this form, I confirm that the information
                  provided is accurate and that I have read, understood and
                  agreed to the rules and regulations guiding students of Julian
                  House of Fashion.
                </p>
                <p className="mt-2">
                  Thank you for choosing Julian House of Fashion. We look
                  forward to having you in class and wish you an exciting and
                  rewarding learning experience.
                </p>
                <p className="mt-2 font-bold text-brand-purple">
                  WELCOME TO JULIAN HOUSE OF FASHION — Where lives are
                  transformed through fashion education.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Summary & Course Preview */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-brand-purple p-6 text-white shadow-xl sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                <GraduationCap className="h-3.5 w-3.5" />
                Step 1 Payment Summary
              </span>

              <h3 className="mt-4 font-serif text-3xl font-bold">
                {programmeDisplayTitle}
              </h3>
              {form.programmeChoice !== "other" && (
                <p className="mt-1 text-xs text-purple-200">
                  Duration: {selectedProgram.duration} • {selectedProgram.level}
                </p>
              )}

              {/* 4-Installment Tuition Preview */}
              {form.programmeChoice !== "other" && (
                <div className="mt-5 rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                    Course Tuition Plan (25% × 4 Installments)
                  </p>
                  <div className="mt-2 flex items-baseline justify-between border-b border-white/15 pb-2 text-sm">
                    <span className="text-purple-100">Total Tuition:</span>
                    <span className="font-bold">
                      {selectedProgram.priceFormatted}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between text-xs text-purple-100">
                    <span>4 Equal Installments (25% each):</span>
                    <span className="font-bold text-white">
                      {formatNaira(quarterTuition)} × 4
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-purple-200">
                    Once you submit &amp; pay the ₦10,000 Registration Form fee,
                    you will print your official Receipt and Acknowledgement
                    Slip with the full Course Outline and a direct link to pay
                    your tuition.
                  </p>
                </div>
              )}

              {/* Payable Now */}
              <div className="mt-6 border-t border-white/20 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-purple-100">
                    Registration Form Due Now
                  </span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">
                    {ADDITIONAL_FEES.registrationFormatted}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-4 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-amber-300 disabled:opacity-60"
                >
                  <CreditCard className="h-4 w-4" />
                  {isProcessing
                    ? "Opening Paystack..."
                    : "Submit Agreement & Pay ₦10,000 via Paystack"}
                </button>

                <p className="mt-3 text-center text-[11px] text-purple-200">
                  Pay securely via Card, Bank Transfer, USSD or Bank App.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ==================== STAGE 2: PRINTABLE RECEIPT & ACKNOWLEDGEMENT SLIP ==================== */}
      {activeView === "slip" && registrationPayment && (
        <div className="space-y-8">
          <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-purple-200 bg-brand-lavender/70 p-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-zinc-950">
                Registration Paid — Print Your Receipt &amp; Acknowledgement Slip
              </h2>
              <p className="text-sm text-zinc-700">
                Both documents below include your signed Agreement, full Course
                Outline for <strong>{programmeDisplayTitle}</strong>, and your
                direct course tuition payment link.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-violet"
              >
                <Printer className="h-4 w-4 text-brand-gold" />
                Print Receipt &amp; Acknowledgement Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("tuition");
                  setTimeout(() => {
                    tuitionSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
              >
                Pay Course Tuition (25% × 4)
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleStartNewRegistration}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-purple-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                New Registration
              </button>
            </div>
          </div>

          {/* PRINTABLE PART 1: OFFICIAL REGISTRATION FEE RECEIPT */}
          <section className="print-card rounded-3xl border-2 border-purple-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-brand-purple pb-6">
              <div>
                <BrandLogo showTagline />
                <p className="mt-2 text-xs text-zinc-600">
                  {SITE_CONFIG.address.full} • Tel: {SITE_CONFIG.phoneDisplay} •{" "}
                  {SITE_CONFIG.domain}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  PAID &amp; VERIFIED
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold uppercase tracking-wide text-brand-purple">
                  Official Registration Receipt
                </h3>
                <p className="text-xs font-semibold text-zinc-600">
                  Receipt No: {registrationPayment.receiptNo}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Student Details
                </p>
                <p className="text-base font-bold text-zinc-950">
                  {form.fullName}
                </p>
                <p className="text-zinc-700">
                  Student ID:{" "}
                  <strong className="text-brand-purple">{form.studentId}</strong>
                </p>
                <p className="text-zinc-700">Phone: {form.phoneNumber}</p>
                <p className="text-zinc-700">
                  Email: {form.emailAddress || "Not provided"}
                </p>
              </div>

              <div className="space-y-1.5 text-sm sm:text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Paystack Payment Record
                </p>
                <p className="text-zinc-700">
                  Reference:{" "}
                  <strong className="font-mono text-xs text-zinc-900">
                    {registrationPayment.reference}
                  </strong>
                </p>
                <p className="text-zinc-700">
                  Date Paid:{" "}
                  {new Date(registrationPayment.paidAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-zinc-700 uppercase">
                  Channel: {registrationPayment.channel}
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-purple-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-lavender text-xs font-bold uppercase text-brand-purple">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Programme Enrolled</th>
                    <th className="px-4 py-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr>
                    <td className="px-4 py-3.5 font-semibold text-zinc-900">
                      Student Registration &amp; Agreement Form (One-Time Fee)
                    </td>
                    <td className="px-4 py-3.5 text-zinc-700">
                      {programmeDisplayTitle} ({selectedProgram.duration})
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-brand-purple">
                      {formatNaira(registrationPayment.amountNaira)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* PRINTABLE PART 2: ADMISSION ACKNOWLEDGEMENT SLIP, AGREEMENT & COURSE OUTLINE */}
          <section className="print-card print-page-break rounded-3xl border-2 border-purple-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-brand-purple pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lavender px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-purple">
                  <FileText className="h-3.5 w-3.5" />
                  Student Registration Acknowledgement Slip
                </span>
                <h3 className="mt-2 font-serif text-3xl font-bold text-zinc-950">
                  Julian House of Fashion Academy
                </h3>
                <p className="text-xs font-medium text-zinc-600">
                  {SITE_CONFIG.tagline} • {SITE_CONFIG.address.full}
                </p>
              </div>
              <div className="text-left sm:text-right text-xs text-zinc-600">
                <p className="font-bold text-brand-purple">
                  Student ID: {form.studentId}
                </p>
                <p>Registration Date: {form.registrationDate}</p>
              </div>
            </div>

            {/* Section 1 Summary */}
            <div className="mt-6 grid gap-4 rounded-2xl border border-purple-100 bg-brand-lavender/30 p-5 text-sm sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Full Name
                </p>
                <p className="font-bold text-zinc-950">{form.fullName}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Phone &amp; Email
                </p>
                <p className="font-semibold text-zinc-800">
                  {form.phoneNumber}
                  {form.emailAddress ? ` • ${form.emailAddress}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Enrolled Programme
                </p>
                <p className="font-bold text-brand-purple">
                  {programmeDisplayTitle} ({selectedProgram.duration})
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Parent / Guardian (Emergency Contact)
                </p>
                <p className="font-semibold text-zinc-800">
                  {form.guardianName} — {form.guardianPhone}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Referral Source
                </p>
                <p className="text-zinc-800">{heardAboutDisplay}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-zinc-500">
                  Accommodation Request
                </p>
                <p className="text-zinc-800">
                  {form.wantsAccommodation
                    ? "Requested (₦50,000 / 3 mos)"
                    : "Not Requested"}
                </p>
              </div>
            </div>

            {/* Course Outline & Training Details */}
            <div className="mt-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2 text-brand-purple">
                  <BookOpen className="h-5 w-5" />
                  <h4 className="font-serif text-2xl font-bold">
                    Official Course Outline — {selectedProgram.title}
                  </h4>
                </div>
                <span className="rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
                  {selectedProgram.level} • {selectedProgram.duration}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-700">
                <strong>Level:</strong> {selectedProgram.level} &nbsp;|&nbsp;{" "}
                <strong>Duration:</strong> {selectedProgram.duration} &nbsp;|&nbsp;{" "}
                <strong>Total Course Tuition:</strong>{" "}
                {selectedProgram.priceFormatted}{" "}
                <span className="text-zinc-500">
                  (4×25% installments of {formatNaira(quarterTuition)})
                </span>
              </p>
              <p className="mt-1.5 text-sm text-zinc-600">
                {selectedProgram.summary}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {selectedProgram.courseOutline.map((mod, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-purple-100 bg-purple-50/20 p-4 break-inside-avoid"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      {mod.title}
                    </p>
                    <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-zinc-800">
                      {mod.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-goldDark" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 break-inside-avoid">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                    Expected Outcome
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-800">
                    {selectedProgram.expectedOutcomeText}
                  </p>
                  {selectedProgram.finalProject && (
                    <div className="mt-3 border-t border-amber-200 pt-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                        Final Project
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-800">
                        {selectedProgram.finalProject}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-purple-100 p-4 break-inside-avoid">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                    Training Venue, Class Hours &amp; Key Rules
                  </p>
                  <p className="mt-2 text-xs font-semibold text-zinc-900">
                    {SITE_CONFIG.address.full}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Mon – Fri: 9:00 AM – 5:00 PM • Sat: 10:00 AM – 4:00 PM
                  </p>
                  <ul className="mt-2.5 space-y-1 text-xs text-zinc-700">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple" />
                      <span>
                        Tuition and registration fees are non-refundable once
                        paid.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple" />
                      <span>
                        Maximum 25% of training days permitted for valid
                        excused absence.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple" />
                      <span>
                        Questions? Call or WhatsApp {SITE_CONFIG.phoneDisplay}.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 25% × 4 Tuition Payment Schedule */}
            <div className="mt-7">
              <h4 className="font-serif text-xl font-bold text-zinc-950">
                Course Tuition Payment Schedule (25% Four Times)
              </h4>
              <p className="mt-1 text-xs text-zinc-600">
                Total Tuition for {selectedProgram.title}:{" "}
                <strong>{selectedProgram.priceFormatted}</strong> — structured
                into four 25% installments of{" "}
                <strong>{formatNaira(quarterTuition)}</strong> each (or payable
                in full).
              </p>

              <div className="mt-3 overflow-hidden rounded-2xl border border-purple-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-purple text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-2.5">Installment</th>
                      <th className="px-4 py-2.5">Share</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {[1, 2, 3, 4].map((num) => {
                      const isPaid = installmentsPaidCount >= num;
                      return (
                        <tr key={num}>
                          <td className="px-4 py-2.5 font-semibold text-zinc-900">
                            Installment {num} of 4
                          </td>
                          <td className="px-4 py-2.5 text-zinc-700">25%</td>
                          <td className="px-4 py-2.5 font-bold text-brand-purple">
                            {formatNaira(quarterTuition)}
                          </td>
                          <td className="px-4 py-2.5">
                            {isPaid ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                Paid
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signed Student Agreement & Electronic Signature Record */}
            <div className="mt-7 rounded-2xl border border-purple-200 bg-purple-50/40 p-5 text-xs text-zinc-700">
              <div className="flex items-center gap-2 text-brand-purple">
                <ScrollText className="h-4 w-4" />
                <h4 className="font-bold uppercase tracking-wider">
                  Signed Code of Conduct &amp; Policy Agreement
                </h4>
              </div>
              <ul className="mt-3 space-y-1.5">
                <li>
                  [✓] Agreed to abide by Julian House of Fashion Rules &amp;
                  Regulations (Student Pictures, Care of Property, Phone Usage,
                  Discipline, Cleanliness, Payment &amp; Refund Policy).
                </li>
                <li>
                  [✓] Acknowledged Photography &amp; Publicity policy for
                  school activities.
                </li>
                <li>
                  [✓] Agreed to the No-Refund Policy after commencement of
                  training.
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-purple-200 pt-3">
                <p>
                  <strong>Electronic Signature:</strong>{" "}
                  <span className="font-serif text-base italic text-zinc-950">
                    {form.electronicSignature}
                  </span>
                </p>
                <p>
                  <strong>Date Signed:</strong> {form.registrationDate}
                </p>
              </div>
            </div>

            {/* Direct Course Payment Link */}
            <div className="mt-7 rounded-2xl border-2 border-dashed border-brand-purple bg-brand-lavender/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Online Course Tuition Payment Link ({selectedProgram.title})
                  </p>
                  <p className="text-xs text-zinc-700">
                    Visit this link whenever you are ready to pay your 25%
                    installments or full course tuition:
                  </p>
                  <p className="break-all font-mono text-xs font-semibold text-brand-purple underline">
                    {tuitionPayLink}
                  </p>
                </div>

                <div className="no-print flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyTuitionLink}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-purple hover:bg-purple-50"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("tuition")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-purple px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-violet"
                  >
                    Pay for {selectedProgram.title} →
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== STAGE 3: COURSE TUITION PAYMENT (25% × 4) ==================== */}
      {activeView === "tuition" && (
        <div ref={tuitionSectionRef} className="space-y-8">
          <div className="no-print grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 rounded-3xl border border-purple-200 bg-white p-6 shadow-sm lg:col-span-7 sm:p-8">
              <div className="border-b border-purple-100 pb-4">
                <span className="rounded-full bg-brand-lavender px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-purple">
                  Step 3 • Flexible 25% × 4 Tuition Payment
                </span>
                <h2 className="mt-2 font-serif text-3xl font-bold text-zinc-950">
                  Pay Course Tuition Online
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Pay for the course you registered for in{" "}
                  <strong>25% installments (4 times)</strong> or pay multiple
                  installments at once via Paystack.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700">
                    Programme Registered For
                  </label>
                  <select
                    value={
                      form.programmeChoice === "other"
                        ? "foundational"
                        : form.programmeChoice
                    }
                    disabled={tuitionPayments.length > 0}
                    onChange={(e) =>
                      setForm({ ...form, programmeChoice: e.target.value })
                    }
                    className="w-full rounded-xl border border-purple-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 disabled:bg-zinc-100"
                  >
                    {TRAINING_PROGRAMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — {p.priceFormatted}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700">
                    Email Address (Optional, for Paystack e-receipt)
                  </label>
                  <input
                    type="email"
                    value={form.emailAddress}
                    onChange={(e) =>
                      setForm({ ...form, emailAddress: e.target.value })
                    }
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="rounded-2xl border border-purple-100 bg-brand-lavender/40 p-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-brand-purple">
                    Tuition Progress: {installmentsPaidCount * 25}% Paid (
                    {installmentsPaidCount} of 4 installments)
                  </span>
                  <span className="text-zinc-700">
                    Balance: {formatNaira(remainingTuitionBalance)}
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-purple-200">
                  <div
                    className="h-full rounded-full bg-brand-purple transition-all"
                    style={{ width: `${installmentsPaidCount * 25}%` }}
                  />
                </div>
              </div>

              {remainingInstallments > 0 ? (
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-900">
                    Select Installments to Pay Now (Each Installment = 25% /{" "}
                    {formatNaira(quarterTuition)})
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((count) => {
                      const disabled = count > remainingInstallments;
                      const isSelected = installmentsToPay === count;
                      const amt =
                        count === remainingInstallments
                          ? remainingTuitionBalance
                          : count * quarterTuition;
                      return (
                        <button
                          key={count}
                          type="button"
                          disabled={disabled}
                          onClick={() => setInstallmentsToPay(count)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            disabled
                              ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-50"
                              : isSelected
                              ? "border-brand-purple bg-brand-lavender ring-2 ring-brand-purple/25"
                              : "border-zinc-200 bg-white hover:border-purple-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                              {count === 1
                                ? "1 Installment (25%)"
                                : count === 4
                                ? "All 4 Installments (100%)"
                                : `${count} Installments (${count * 25}%)`}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-brand-purple" />
                            )}
                          </div>
                          <p className="mt-1 font-serif text-2xl font-bold text-zinc-950">
                            {formatNaira(amt)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-800">
                  Congratulations! Your full tuition for {selectedProgram.title}{" "}
                  ({selectedProgram.priceFormatted}) has been paid 100%.
                </div>
              )}

              {!accommodationPaid && (
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                  <input
                    type="checkbox"
                    checked={includeAccommodationInTuition}
                    onChange={(e) =>
                      setIncludeAccommodationInTuition(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-purple-300 text-brand-purple"
                  />
                  <span className="text-xs leading-relaxed text-zinc-700">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-zinc-900">
                      <Home className="h-4 w-4 text-brand-purple" />
                      Add 3-Month Student Accommodation (+₦50,000)
                    </span>
                    Comfortable accommodation near our Basin Road studio.
                  </span>
                </label>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-3xl bg-brand-purple p-6 text-white shadow-xl sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                  Tuition Payment Summary
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold">
                  {selectedProgram.title}
                </h3>
                <p className="text-xs text-purple-200">
                  Student: {form.fullName || "Prospective Student"} (
                  {form.studentId || "Pending Reg"})
                </p>

                <div className="mt-5 space-y-3 border-t border-white/15 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-100">Total Course Tuition</span>
                    <span className="font-semibold">
                      {selectedProgram.priceFormatted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100">Already Paid</span>
                    <span className="font-semibold text-emerald-300">
                      {formatNaira(tuitionPaidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100">
                      Paying Now ({installmentsToPay * 25}%)
                    </span>
                    <span className="font-semibold">
                      {remainingInstallments > 0
                        ? formatNaira(
                            installmentsToPay === remainingInstallments
                              ? remainingTuitionBalance
                              : installmentsToPay * quarterTuition
                          )
                        : "₦0"}
                    </span>
                  </div>
                  {includeAccommodationInTuition && !accommodationPaid && (
                    <div className="flex justify-between">
                      <span className="text-purple-100">
                        Accommodation (3 Months)
                      </span>
                      <span className="font-semibold">
                        {ADDITIONAL_FEES.accommodationFormatted}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-baseline justify-between border-t border-white/20 pt-4">
                  <span className="text-sm font-semibold text-purple-100">
                    Payable Now
                  </span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">
                    {formatNaira(tuitionSelectedAmount)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing || tuitionSelectedAmount <= 0}
                  onClick={handleTuitionSubmit}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-4 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-amber-300 disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  {isProcessing
                    ? "Connecting to Paystack..."
                    : `Pay ${formatNaira(tuitionSelectedAmount)} via Paystack`}
                </button>

                {registrationPayment && (
                  <button
                    type="button"
                    onClick={() => setActiveView("slip")}
                    className="mt-3 w-full rounded-xl border border-white/25 py-2.5 text-xs font-semibold text-purple-100 hover:bg-white/10"
                  >
                    ← Back to Acknowledgement Slip
                  </button>
                )}
              </div>
            </div>
          </div>

          {tuitionPayments.length > 0 && (
            <section className="print-card rounded-3xl border-2 border-purple-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-5">
                <div>
                  <BrandLogo showTagline />
                  <h3 className="mt-3 font-serif text-2xl font-bold text-zinc-950">
                    Verified Course Tuition Receipts —{" "}
                    {form.fullName || "Registered Student"}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Student ID: {form.studentId} • Course:{" "}
                    {selectedProgram.title} • Remaining Tuition Balance:{" "}
                    <strong>{formatNaira(remainingTuitionBalance)}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-2 rounded-xl bg-brand-purple px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-violet"
                >
                  <Printer className="h-4 w-4 text-brand-gold" />
                  Print Tuition Receipt(s)
                </button>
              </div>

              <div className="mt-5 overflow-x-auto rounded-2xl border border-purple-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-lavender text-xs font-bold uppercase text-brand-purple">
                    <tr>
                      <th className="px-4 py-3">Receipt No</th>
                      <th className="px-4 py-3">Paystack Ref</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100">
                    {tuitionPayments.map((tp) => (
                      <tr key={tp.reference}>
                        <td className="px-4 py-3 font-bold text-zinc-900">
                          {tp.receiptNo}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-700">
                          {tp.reference}
                        </td>
                        <td className="px-4 py-3 text-zinc-700">
                          {tp.description}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600">
                          {new Date(tp.paidAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-brand-purple">
                          {formatNaira(tp.amountNaira)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
