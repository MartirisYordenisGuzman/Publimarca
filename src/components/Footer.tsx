"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="w-full bg-[#F4F4F0] border-t border-[#E5E5DF]">
      <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
            {/* Brand Summary & Coordinates */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/logo%202.png"
                    alt="Publimarca — Diseño, Impresión & Publicidad en General"
                    className="h-10 sm:h-11 w-auto object-contain"
                  />
                </div>
                <p className="text-sm text-[#52525B] max-w-sm leading-relaxed">
                  {t("summary")}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00758C]">
                  {t("coordTitle")}
                </span>
                <p className="text-xs text-[#101014] font-medium leading-relaxed">
                  {t("coordLine1")}
                  <br />
                  <span className="text-[#52525B]">{t("coordLine2")}</span>
                </p>
                <span
                  className="text-[11px] text-[#52525B] font-mono"
                  translate="no"
                >
                  {t("coordGeo")}
                </span>
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A01318]">
                {t("capTitle")}
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#52525B] font-medium">
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#101014] transition-colors"
                  >
                    {t("cap1")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#101014] transition-colors"
                  >
                    {t("cap2")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#101014] transition-colors"
                  >
                    {t("cap3")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#101014] transition-colors"
                  >
                    {t("cap4")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#101014] transition-colors"
                  >
                    {t("cap5")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Section Index */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00758C]">
                {t("indexTitle")}
              </span>
              <ul className="flex flex-col gap-2 text-xs uppercase tracking-wider font-semibold text-[#404048]">
                <li>
                  <a
                    className="hover:text-[#A01318] transition-colors"
                    href="#selected-works"
                  >
                    {tNav("work")}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#A01318] transition-colors"
                    href="#services"
                  >
                    {tNav("services")}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#A01318] transition-colors"
                    href="#manifesto"
                  >
                    {t("manifesto")}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#A01318] transition-colors"
                    href="#cadence"
                  >
                    {tNav("process")}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#A01318] transition-colors"
                    href="#commission"
                  >
                    {t("commission")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Transmission & Social Channels */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A01318]">
                {t("transmissionTitle")}
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <a
                  href="mailto:dispatch@publimarca.do"
                  className="text-[#101014] font-semibold hover:text-[#A01318] transition-colors break-all"
                  translate="no"
                >
                  dispatch@publimarca.do
                </a>
                <span className="text-[#52525B]">{t("phoneNote")}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px] uppercase tracking-wider text-[#52525B] mt-2 font-medium">
                <span className="text-[10px] font-mono text-[#00758C]">
                  {t("socialPending")}
                </span>
                <span translate="no">Instagram / @publimarca</span>
                <span translate="no">Vimeo / @publimarcastudio</span>
                <span translate="no">Behance / publimarcado</span>
                <span translate="no">LinkedIn / publimarca</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E0E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-wider text-[#52525B]">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span>{t("copyright")}</span>
              <span aria-hidden="true">•</span>
              <span translate="no">Higüey, RD</span>
            </div>
            <div className="flex items-center gap-6">
              <span translate="no">Code: DO-HIG-01</span>
              <a
                href="#commission"
                className="hover:text-[#101014] underline decoration-[#D1D1C7] transition-colors"
              >
                {t("terms")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
