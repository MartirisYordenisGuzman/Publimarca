"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

type FilterCategory = "all" | "motion" | "identity" | "spatial";
type ProjectId = "p1" | "p2" | "p3";

const PROJECT_META: Record<
  ProjectId,
  {
    image: string;
    categories: FilterCategory[];
    badgeColorClass: string;
    hoverTitleClass: string;
    capabilityKey: string;
  }
> = {
  p1: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIwIZmv43bbeNfq9F2A8zdxlm5t5yE7Vy89Dg7mx0H4ZzYEi0dN9SCG5pKa0eNFsiQPzaG96vbhz4jXRDQ_CZOr8LG2AljBdzL3hU83CVaLBDkXvrAHduBA4LnbFqyJVuNJu6mZwlfYM0NvTvlv2oZwZMG-QXETcPDrGhlv9-n1bDHlT-1ArKEuMrfWlr2Pt5LthbeZHwWp1a99lG9zqCxKZhnBulp2yxnFAhfzGQ4",
    categories: ["all", "motion"],
    badgeColorClass: "text-[#00758C]",
    hoverTitleClass: "group-hover:text-[#A01318]",
    capabilityKey: "Audiovisual Production"
  },
  p2: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASda-Il1ENca_NnkmFrS5Zc_1aeqA7HKeB8OcmhYW-vJ13cdotL5ZW8a_HmK4eU0rQeDeJv5a4uXxnp2EQ5G94EyFHVHNS8-KE33RX44iSQSWyQt9W7-tieHYVnVgId9Vbz0cv2LHYiMK3NXGPokwUYwLmsSC8p-f9nEjMtUqjq7uhPGToHeD0zF23fMPaOynQwJQ23Od-2ptIwpnHoHAyL91DWAQ3nRJIF-OkLcR9",
    categories: ["all", "identity", "spatial"],
    badgeColorClass: "text-[#A01318]",
    hoverTitleClass: "group-hover:text-[#00758C]",
    capabilityKey: "Spatial Scenography"
  },
  p3: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBcgZk-Qko0kePP1Md2JPqEVABdf_auZ69FWYQ_TlljB4mSNC2P8thwXrSvLhgJJX4cLTCS__onFrYv64hnH1Z6IVEpjub8_7g-bocPZYQfovre0ynMBrqo-3v_zEGLKogF7Eazi6sAD7ixa1HRyOSdftGc_QcVKWGYlYuo1Lp0QlTqVX8_L5Y7G4CZAj0NqeL49qv6hsjCZ6lpyt4cCDKXEsfWh-6a_gq8pnRET16",
    categories: ["all", "identity"],
    badgeColorClass: "text-[#00758C]",
    hoverTitleClass: "group-hover:text-[#A01318]",
    capabilityKey: "Brand Identity & Type"
  }
};

const FILTER_OPTIONS: { key: FilterCategory; count: string }[] = [
  { key: "all", count: "[03]" },
  { key: "motion", count: "[01]" },
  { key: "identity", count: "[02]" },
  { key: "spatial", count: "[01]" }
];

export function PortfolioSection() {
  const t = useTranslations("works");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [activeModalProject, setActiveModalProject] =
    useState<ProjectId | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModalProject) {
        setActiveModalProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModalProject]);

  const handleCommissionSimilar = (projectId: ProjectId) => {
    const cap = PROJECT_META[projectId].capabilityKey;
    setActiveModalProject(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("publimarca:select-capability", {
          detail: { capability: cap }
        })
      );
    }
  };

  const showP1 = PROJECT_META.p1.categories.includes(activeFilter);
  const showP2 = PROJECT_META.p2.categories.includes(activeFilter);
  const showP3 = PROJECT_META.p3.categories.includes(activeFilter);

  return (
    <section
      id="selected-works"
      className="w-full bg-[#FBFBF9] px-margin md:px-margin-tablet lg:px-margin-desktop py-20 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-[#A01318] font-bold">
                {t("kicker")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4F4F0] border border-[#E5E5DF] text-[10px] font-mono uppercase tracking-wider text-[#52525B]">
                {t("placeholderBadge")}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#101014] tracking-tight">
              {t("title")}
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div
            className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold uppercase tracking-wider"
            role="group"
            aria-label={t("filterLabel")}
          >
            {FILTER_OPTIONS.map((item) => {
              const isSelected = activeFilter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveFilter(item.key)}
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? "px-4 py-2 rounded-full bg-[#101014] text-white border border-[#101014] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                      : "px-4 py-2 rounded-full bg-white text-[#52525B] border border-[#E5E5DF] hover:border-[#101014] hover:text-[#101014] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                  }
                >
                  <span>{t(`filters.${item.key}`)}</span>{" "}
                  <span className="font-mono" translate="no">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical Rounded Case Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Project 01: Hero Feature */}
          {showP1 && (
            <motion.article
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className={`${
                activeFilter === "all" ? "lg:col-span-7" : "lg:col-span-12"
              } flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E5E5DF] shadow-editorial hover:shadow-editorial-hover transition-all duration-500 group`}
            >
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[460px] overflow-hidden bg-[#ECECE7]">
                <Image
                  src={PROJECT_META.p1.image}
                  alt={t("projects.p1.alt")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#00758C] shadow-sm">
                  {t("projects.p1.badge")}
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between text-[#52525B] text-xs font-semibold uppercase mb-2 gap-2">
                    <span>{t("projects.p1.client")}</span>
                    <span className="font-mono">{t("projects.p1.meta")}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#101014] group-hover:text-[#A01318] transition-colors mb-3">
                    {t("projects.p1.title")}
                  </h3>
                  <p className="text-sm text-[#52525B] leading-relaxed mb-6">
                    {t("projects.p1.summary")}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EBEBE6] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalProject("p1")}
                    className="text-xs uppercase text-[#00758C] font-bold tracking-widest inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-md py-1"
                  >
                    <span>{t("inspectBtn")}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="font-mono text-xs text-[#52525B]"
                    translate="no"
                  >
                    {t("projects.p1.location")}
                  </span>
                </div>
              </div>
            </motion.article>
          )}

          {/* Project 02 & 03: Vertical Stacker */}
          {(showP2 || showP3) && (
            <div
              className={
                activeFilter === "all"
                  ? "lg:col-span-5 flex flex-col gap-8 justify-between"
                  : activeFilter === "identity"
                  ? "lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8"
                  : "lg:col-span-12 flex flex-col gap-8"
              }
            >
              {(["p2", "p3"] as const).map((pid) => {
                const isVisible = pid === "p2" ? showP2 : showP3;
                if (!isVisible) return null;
                const meta = PROJECT_META[pid];

                return (
                  <motion.article
                    key={pid}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5E5DF] shadow-editorial hover:shadow-editorial-hover transition-all duration-500 group flex flex-col flex-1"
                  >
                    <div className="relative w-full h-56 overflow-hidden bg-[#ECECE7]">
                      <Image
                        src={meta.image}
                        alt={t(`projects.${pid}.alt`)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-wider ${meta.badgeColorClass} shadow-sm`}
                      >
                        {t(`projects.${pid}.badge`)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between text-[#52525B] text-xs font-semibold uppercase mb-1 gap-2">
                          <span>{t(`projects.${pid}.client`)}</span>
                          <span className="font-mono">
                            {t(`projects.${pid}.meta`)}
                          </span>
                        </div>
                        <h3
                          className={`font-display text-lg font-bold uppercase text-[#101014] ${meta.hoverTitleClass} transition-colors mb-2`}
                        >
                          {t(`projects.${pid}.title`)}
                        </h3>
                        <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed mb-4">
                          {t(`projects.${pid}.summary`)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[#EBEBE6] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveModalProject(pid)}
                          className="text-[11px] uppercase text-[#00758C] font-bold tracking-widest inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-md"
                        >
                          <span>{t("inspectBtn")}</span>
                          <ArrowRight
                            className="w-3.5 h-3.5"
                            aria-hidden="true"
                          />
                        </button>
                        <span
                          className="font-mono text-[11px] text-[#52525B]"
                          translate="no"
                        >
                          {t(`projects.${pid}.location`)}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Case Study Inspection Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalProject(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 bg-[#101014]/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 border border-[#E5E5DF] shadow-editorial-modal relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#EBEBE6]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#F4F4F0] text-[#00758C] text-xs font-bold uppercase tracking-wider">
                    {t(`projects.${activeModalProject}.badge`)}
                  </span>
                  <span className="text-xs font-mono text-[#52525B]">
                    {t("placeholderBadge")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  aria-label={t("closeModal")}
                  className="w-9 h-9 rounded-full bg-[#F4F4F0] hover:bg-[#101014] text-[#101014] hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-[#52525B]">
                  <span>{t(`projects.${activeModalProject}.client`)}</span>
                  <span className="font-mono">
                    {t(`projects.${activeModalProject}.meta`)}
                  </span>
                </div>
                <h3
                  id="modal-project-title"
                  className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#101014]"
                >
                  {t(`projects.${activeModalProject}.title`)}
                </h3>
                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                  {t(`projects.${activeModalProject}.fullDescription`)}
                </p>
                <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E5DF] text-xs font-mono text-[#52525B]">
                  {t(`projects.${activeModalProject}.specs`)}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[#EBEBE6] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#52525B]">
                  {t("modalNote")}
                </span>
                <a
                  href="#commission"
                  onClick={() => handleCommissionSimilar(activeModalProject)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#A01318] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#851014] transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>{t("modalCta")}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
