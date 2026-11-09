"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function ManifestoSection() {
  const t = useTranslations("manifesto");

  return (
    <section
      id="manifesto"
      className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-14 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-6xl mx-auto bg-white rounded-3xl p-8 md:p-14 border border-[#E5E5DF] shadow-editorial relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-[#30B4D7]/5 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#A01318] font-bold">
            {t("kicker")}
          </span>
          <span className="h-px flex-1 bg-[#EBEBE6]" aria-hidden="true" />
          <span
            className="text-xs uppercase tracking-widest text-[#52525B] font-mono"
            translate="no"
          >
            {t("code")}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00758C] block mb-3">
              {t("sub")}
            </span>
            <p className="text-base text-[#52525B] leading-relaxed">
              {t("body")}
            </p>
          </div>
          <div className="lg:col-span-8">
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl text-[#101014] leading-tight font-serif italic mb-6">
              {t("quote")}
            </blockquote>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-[#52525B] text-xs font-semibold uppercase tracking-wider">
              <span className="text-[#101014]">{t("author")}</span>
              <span>{t("location")}</span>
              <span className="text-[#A01318] font-mono" translate="no">
                {t("revision")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
