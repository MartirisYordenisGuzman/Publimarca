"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function IndustriesSection() {
  const t = useTranslations("industries");

  return (
    <section
      id="industries"
      className="relative w-full bg-[#FBFBF9] px-margin md:px-margin-tablet lg:px-margin-desktop py-24 scroll-mt-24 border-b border-[#EBEBE6] overflow-hidden"
    >
      {/* Subtle Ambient Editorial Accents */}
      <div
        className="absolute top-16 -right-24 w-96 h-96 rounded-full bg-[#30B4D7]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-24 -left-24 w-96 h-96 rounded-full bg-[#A01318]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Asymmetric Editorial Header Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-14 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <span
                className="w-2 h-2 rounded-full bg-[#A01318]"
                aria-hidden="true"
              />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00758C]">
                {t("label")}
              </span>
              <span className="w-10 h-px bg-[#30B4D7]" aria-hidden="true" />
            </div>
            <h2 className="font-poppins text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold text-[#101014] tracking-[-0.025em] leading-[1.08]">
              <span>{t("headlineMain")}</span>
              <span className="block mt-2 font-serif italic font-normal text-[#A01318] underline decoration-[#30B4D7]/45 decoration-2 underline-offset-8">
                {t("headlineAccent")}
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-end"
          >
            <p className="text-base sm:text-[17px] text-[#52525B] leading-relaxed mb-6">
              {t("intro")}
            </p>
            <div className="pl-4 border-l-2 border-[#30B4D7] py-1">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#101014]">
                {t("supporting")}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Asymmetric 6-Industry Editorial Composition */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7"
        >
          {/* 01 — Construcción e inmobiliaria (Wide 7-Column Architectural Feature Plate) */}
          <a
            href="#commission"
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden bg-[#101014] border border-[#E5E5DF] shadow-editorial hover:shadow-editorial-hover transition-all duration-500 min-h-[380px] sm:min-h-[430px] flex flex-col justify-between p-6 sm:p-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <img
              src="https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=1200&q=85"
              alt={t("items.i1.title")}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#101014]/95 via-[#101014]/45 to-[#101014]/15"
              aria-hidden="true"
            />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#101014] font-mono text-xs font-bold tracking-widest shadow-sm flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#A01318]"
                  aria-hidden="true"
                />
                <span translate="no">{t("items.i1.number")}</span>
              </span>
              <span
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center group-hover:bg-[#A01318] group-hover:border-[#A01318] transition-all duration-300"
                aria-hidden="true"
              >
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            <div className="relative z-10 max-w-xl pt-16">
              <div
                className="w-8 h-0.5 bg-[#30B4D7] mb-3 transition-all duration-300 group-hover:w-14"
                aria-hidden="true"
              />
              <h3 className="font-poppins text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                {t("items.i1.title")}
              </h3>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                {t("items.i1.description")}
              </p>
            </div>
          </a>

          {/* 02 — Distribución y alimentos (5-Column Vertical Editorial Card) */}
          <a
            href="#commission"
            className="lg:col-span-5 group bg-white rounded-3xl border border-[#E5E5DF] hover:border-[#00758C]/40 shadow-editorial hover:shadow-editorial-hover transition-all duration-500 overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#ECECE7]">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85"
                alt={t("items.i2.title")}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#101014]/35 via-transparent to-transparent"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#00758C] font-mono text-xs font-bold tracking-widest shadow-sm"
                translate="no"
              >
                {t("items.i2.number")}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-poppins text-xl sm:text-2xl font-bold text-[#101014] group-hover:text-[#A01318] transition-colors mb-2">
                  {t("items.i2.title")}
                </h3>
                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                  {t("items.i2.description")}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#EBEBE6] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#00758C] font-semibold">
                  {t("items.i2.tag")}
                </span>
                <ArrowRight
                  className="w-4 h-4 text-[#101014] group-hover:text-[#A01318] transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>

          {/* 03 — Motopréstamos y servicios financieros (4-Column High-Contrast Editorial Monolith) */}
          <a
            href="#commission"
            className="lg:col-span-4 group bg-[#101014] text-white rounded-3xl border border-[#101014] hover:border-[#A01318] shadow-editorial hover:shadow-editorial-hover transition-all duration-500 overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <div className="relative h-52 w-full overflow-hidden bg-[#1A1A22]">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85"
                alt={t("items.i3.title")}
                loading="lazy"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/20 to-transparent"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#101014]/90 border border-white/15 backdrop-blur-md text-[#30B4D7] font-mono text-xs font-bold tracking-widest"
                translate="no"
              >
                {t("items.i3.number")}
              </span>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div
                  className="w-6 h-0.5 bg-[#A01318] mb-3 transition-all duration-300 group-hover:w-12"
                  aria-hidden="true"
                />
                <h3 className="font-poppins text-xl font-bold text-white group-hover:text-[#30B4D7] transition-colors mb-2">
                  {t("items.i3.title")}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  {t("items.i3.description")}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#30B4D7]">
                  {t("items.i3.tag")}
                </span>
                <ArrowUpRight
                  className="w-4 h-4 text-white/80 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>

          {/* 04 — Restaurantes y gastronomía (8-Column Horizontal Split Editorial Feature) */}
          <a
            href="#commission"
            className="lg:col-span-8 group bg-white rounded-3xl border border-[#E5E5DF] hover:border-[#A01318]/40 shadow-editorial hover:shadow-editorial-hover transition-all duration-500 overflow-hidden grid grid-cols-1 md:grid-cols-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <div className="md:col-span-7 relative min-h-[260px] md:min-h-full overflow-hidden bg-[#ECECE7]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=85"
                alt={t("items.i4.title")}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#101014]/15 hidden md:block"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#A01318] font-mono text-xs font-bold tracking-widest shadow-sm"
                translate="no"
              >
                {t("items.i4.number")}
              </span>
            </div>

            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#00758C] font-semibold block mb-2">
                  {t("items.i4.tag")}
                </span>
                <h3 className="font-poppins text-xl sm:text-2xl font-bold text-[#101014] group-hover:text-[#A01318] transition-colors mb-3">
                  {t("items.i4.title")}
                </h3>
                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                  {t("items.i4.description")}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EBEBE6] flex items-center justify-between">
                <span className="font-serif italic text-sm text-[#52525B]">
                  {t("items.i4.sub")}
                </span>
                <span
                  className="w-9 h-9 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#101014] group-hover:bg-[#A01318] group-hover:text-white transition-all"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>

          {/* 05 — Equipos y suministros industriales (6-Column Architectural Horizontal Card) */}
          <a
            href="#commission"
            className="lg:col-span-6 group bg-[#F4F4F0] hover:bg-white rounded-3xl border border-[#E5E5DF] hover:border-[#00758C]/50 shadow-editorial hover:shadow-editorial-hover transition-all duration-500 overflow-hidden grid grid-cols-1 sm:grid-cols-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <div className="sm:col-span-5 relative min-h-[220px] sm:min-h-full overflow-hidden bg-[#E5E5DF]">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85"
                alt={t("items.i5.title")}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#101014]/90 text-white font-mono text-xs font-bold tracking-widest"
                translate="no"
              >
                {t("items.i5.number")}
              </span>
            </div>

            <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div
                  className="w-7 h-0.5 bg-[#00758C] mb-3 transition-all duration-300 group-hover:w-12"
                  aria-hidden="true"
                />
                <h3 className="font-poppins text-xl font-bold text-[#101014] group-hover:text-[#00758C] transition-colors mb-2">
                  {t("items.i5.title")}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {t("items.i5.description")}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#E5E5DF] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#52525B]">
                  {t("items.i5.tag")}
                </span>
                <ArrowRight
                  className="w-4 h-4 text-[#00758C] transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>

          {/* 06 — Comercio y servicios (6-Column Architectural Horizontal Card) */}
          <a
            href="#commission"
            className="lg:col-span-6 group bg-white rounded-3xl border border-[#E5E5DF] hover:border-[#A01318]/40 shadow-editorial hover:shadow-editorial-hover transition-all duration-500 overflow-hidden grid grid-cols-1 sm:grid-cols-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
          >
            <div className="sm:col-span-5 relative min-h-[220px] sm:min-h-full overflow-hidden bg-[#ECECE7]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85"
                alt={t("items.i6.title")}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#A01318] font-mono text-xs font-bold tracking-widest shadow-sm"
                translate="no"
              >
                {t("items.i6.number")}
              </span>
            </div>

            <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div
                  className="w-7 h-0.5 bg-[#A01318] mb-3 transition-all duration-300 group-hover:w-12"
                  aria-hidden="true"
                />
                <h3 className="font-poppins text-xl font-bold text-[#101014] group-hover:text-[#A01318] transition-colors mb-2">
                  {t("items.i6.title")}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {t("items.i6.description")}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[#EBEBE6] flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A01318] font-semibold">
                  {t("items.i6.tag")}
                </span>
                <ArrowRight
                  className="w-4 h-4 text-[#101014] group-hover:text-[#A01318] transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>
        </motion.div>

        {/* Editorial Closing Statement & CTA Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-12 lg:mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E5DF] shadow-editorial relative overflow-hidden"
        >
          <div
            className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#30B4D7]/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            <div className="lg:col-span-8">
              <h3 className="font-poppins text-2xl sm:text-3xl font-bold text-[#101014] tracking-tight mb-3">
                {t("closingTitle")}
              </h3>
              <p className="text-base text-[#52525B] leading-relaxed mb-5 max-w-2xl">
                {t("closingBody")}
              </p>
              <p className="font-serif italic text-lg sm:text-xl text-[#A01318] font-medium">
                {t("highlightPhrase")}
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <a
                href="#commission"
                className="w-full sm:w-auto px-8 py-4 bg-[#A01318] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md shadow-[#A01318]/20 hover:bg-[#851014] hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] focus-visible:ring-offset-2 transition-all inline-flex items-center justify-center gap-3 group"
              >
                <span
                  className="w-2 h-2 rounded-full bg-[#30B4D7]"
                  aria-hidden="true"
                />
                <span>{t("cta")}</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
