"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Eye,
  GraduationCap,
  Layers,
  X,
  ArrowRight,
} from "lucide-react";
import {
  STUDENT_PROJECT_SHOWCASES,
  type StudentProjectShowcase,
} from "@/data/siteData";

const CATEGORIES = [
  "All",
  "Tailored Suits & Separates",
  "Color-Block & Contour Dresses",
  "Jumpsuits & Palazzo Sets",
  "Embellished & Cape Couture",
] as const;

export function StudentProjectsShowcase({
  limit,
  showViewAllLink = false,
}: {
  limit?: number;
  showViewAllLink?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedAngles, setSelectedAngles] = useState<Record<string, number>>(
    {}
  );
  const [modalProject, setModalProject] =
    useState<StudentProjectShowcase | null>(null);
  const [modalAngleIndex, setModalAngleIndex] = useState<number>(0);

  const filtered =
    activeCategory === "All"
      ? STUDENT_PROJECT_SHOWCASES
      : STUDENT_PROJECT_SHOWCASES.filter(
          (item) => item.category === activeCategory
        );

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  useEffect(() => {
    if (!modalProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalProject]);

  function openModal(project: StudentProjectShowcase) {
    const currentIdx = selectedAngles[project.id] ?? 0;
    setModalAngleIndex(currentIdx);
    setModalProject(project);
  }

  return (
    <div>
      {/* Category Filter Pills */}
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

      {/* Showcase Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((project) => {
          const activeAngleIdx = selectedAngles[project.id] ?? 0;
          const activeAngle =
            project.angles[activeAngleIdx] ?? project.angles[0];
          const activeImageUrl = activeAngle?.url ?? project.primaryImage;

          return (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10"
            >
              {/* Upright 3:4 Portrait Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-lavender">
                <img
                  src={activeImageUrl}
                  alt={`${project.title} — ${activeAngle?.label || "Student Showcase"} at Julian House of Fashion Academy Ilorin`}
                  loading="lazy"
                  onClick={() => openModal(project)}
                  className="h-full w-full cursor-pointer object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                />

                {/* Top Badges */}
                <div className="pointer-events-none absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-purple shadow-sm backdrop-blur">
                    {project.levelBadge}
                  </span>
                  {project.angles.length > 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold text-brand-goldLight backdrop-blur">
                      <Camera className="h-3 w-3" />
                      {project.angles.length} Pictorial Angles
                    </span>
                  )}
                </div>

                {/* Interactive Angle Switcher Pills */}
                {project.angles.length > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                    {project.angles.map((angle, idx) => {
                      const isSelected = idx === activeAngleIdx;
                      return (
                        <button
                          key={angle.url + angle.label}
                          type="button"
                          onClick={() =>
                            setSelectedAngles((prev) => ({
                              ...prev,
                              [project.id]: idx,
                            }))
                          }
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition backdrop-blur ${
                            isSelected
                              ? "bg-brand-purple text-white shadow ring-1 ring-brand-gold"
                              : "bg-white/90 text-zinc-800 hover:bg-white"
                          }`}
                        >
                          {angle.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Project Technical Breakdown */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-goldDark">
                      {project.category}
                    </p>
                    <span className="text-[11px] font-semibold text-zinc-500">
                      {project.studentLabel}
                    </span>
                  </div>

                  <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug text-zinc-900">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                    {project.summary}
                  </p>

                  {/* Key Pictorial Highlights */}
                  <div className="mt-4 rounded-2xl border border-purple-100 bg-brand-cream/40 p-3.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-purple">
                      <Layers className="h-3.5 w-3.5" />
                      Pictorial &amp; Construction Details
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-zinc-700">
                      {project.pictorialDetails.slice(0, 3).map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-goldDark" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modules Applied */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.modulesApplied.map((mod) => (
                      <span
                        key={mod}
                        className="rounded-md bg-brand-lavender/70 px-2 py-0.5 text-[10px] font-semibold text-brand-purple"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-purple-50 pt-4">
                  <button
                    type="button"
                    onClick={() => openModal(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple transition hover:text-brand-violet"
                  >
                    <Eye className="h-4 w-4" />
                    View Full Pictorial &amp; Details
                  </button>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand-lavender px-3 py-1 text-[11px] font-bold text-brand-purple transition hover:bg-brand-purple hover:text-white"
                  >
                    Enroll →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* View All Link (optional on Homepage) */}
      {showViewAllLink && (
        <div className="mt-10 text-center">
          <Link
            href="/academy#student-projects"
            className="inline-flex items-center gap-2 rounded-full bg-brand-purple px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/15 transition hover:bg-brand-violet"
          >
            View All 12 Student Project Pictorials (24 Photos)
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Full Pictorial Lightbox Modal */}
      {modalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalProject.title}
          onClick={() => setModalProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setModalProject(null)}
              aria-label="Close pictorial modal"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-white shadow transition hover:bg-brand-purple"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid gap-0 lg:grid-cols-12">
              {/* Left Image + Thumbnails */}
              <div className="bg-zinc-950 p-4 sm:p-6 lg:col-span-6">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-900">
                  <img
                    src={
                      modalProject.angles[modalAngleIndex]?.url ??
                      modalProject.primaryImage
                    }
                    alt={`${modalProject.title} — ${
                      modalProject.angles[modalAngleIndex]?.label ?? "Showcase"
                    }`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {modalProject.angles.length > 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    {modalProject.angles.map((angle, idx) => {
                      const active = idx === modalAngleIndex;
                      return (
                        <button
                          key={angle.url + angle.label}
                          type="button"
                          onClick={() => setModalAngleIndex(idx)}
                          className={`overflow-hidden rounded-xl border-2 text-left transition ${
                            active
                              ? "border-brand-gold ring-2 ring-brand-gold/40"
                              : "border-zinc-700 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                            <img
                              src={angle.url}
                              alt={angle.label}
                              className="h-full w-full object-cover object-top"
                            />
                          </div>
                          <p className="truncate bg-zinc-900 px-2 py-1.5 text-[10px] font-bold text-white">
                            {angle.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Details */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-purple px-3 py-1 text-xs font-bold text-white">
                      {modalProject.levelBadge}
                    </span>
                    <span className="rounded-full bg-brand-lavender px-3 py-1 text-xs font-semibold text-brand-purple">
                      {modalProject.category}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                    {modalProject.studentLabel} • Julian House of Fashion Studio
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-zinc-950 sm:text-3xl">
                    {modalProject.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    {modalProject.summary}
                  </p>

                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Complete Project Pictorial Breakdown
                    </h4>
                    <ul className="mt-3 space-y-2.5 text-sm text-zinc-800">
                      {modalProject.pictorialDetails.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-goldDark" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Course Modules Applied
                    </h4>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {modalProject.modulesApplied.map((mod) => (
                        <span
                          key={mod}
                          className="rounded-lg border border-purple-200 bg-brand-cream/60 px-3 py-1 text-xs font-semibold text-brand-purple"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-purple-100 pt-5">
                  <Link
                    href="/register"
                    onClick={() => setModalProject(null)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-violet"
                  >
                    <GraduationCap className="h-4 w-4 text-brand-gold" />
                    Register to Master These Skills →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
