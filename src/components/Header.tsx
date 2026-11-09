"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname, useRouter, type AppLocale } from "@/i18n/routing";

export function Header() {
  const tTop = useTranslations("topbar");
  const tNav = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const [clock, setClock] = useState<string>("15:42:08");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "America/Santo_Domingo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        setClock(formatter.format(now));
      } catch {
        // Fallback static display if Intl timezone fails
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleLanguageChange = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: nextLocale, scroll: false });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FBFBF9]/90 backdrop-blur-xl border-b border-[#EBEBE6] transition-all duration-300">
      {/* Skip Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-5 focus:py-2.5 focus:bg-[#101014] focus:text-white focus:rounded-full focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:shadow-lg"
      >
        {tNav("skipToContent")}
      </a>

      {/* Primary Navigation Bar */}
      <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-6xl mx-auto h-20 flex items-center justify-between gap-4">
          {/* Studio Identity Mark */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Publimarca Studio Home"
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
            >
              <img
                src="/logo%202.png"
                alt="Publimarca — Diseño, Impresión & Publicidad en General"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation Pill */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#F1F1EB]/90 p-1.5 rounded-full border border-[#E5E5DF] text-xs font-semibold uppercase tracking-wider text-[#404048]"
          >
            <a
              className="px-4 lg:px-5 py-2 rounded-full hover:bg-white hover:text-[#101014] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all"
              href="#selected-works"
            >
              {tNav("work")}
            </a>
            <a
              className="px-4 lg:px-5 py-2 rounded-full hover:bg-white hover:text-[#101014] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all"
              href="#services"
            >
              {tNav("services")}
            </a>
            <a
              className="px-4 lg:px-5 py-2 rounded-full hover:bg-white hover:text-[#101014] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all"
              href="#industries"
            >
              {tNav("industries")}
            </a>
            <a
              className="px-4 lg:px-5 py-2 rounded-full hover:bg-white hover:text-[#101014] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all"
              href="#manifesto"
            >
              {tNav("about")}
            </a>
            <a
              className="px-4 lg:px-5 py-2 rounded-full hover:bg-white hover:text-[#101014] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all"
              href="#cadence"
            >
              {tNav("process")}
            </a>
          </nav>

          {/* Right Controls: Language Switcher, Primary CTA & Mobile Trigger */}
          <div className="flex items-center gap-2.5">
            <div
              className="inline-flex items-center bg-[#F1F1EB]/90 p-1 rounded-full border border-[#E5E5DF] text-[11px] font-bold uppercase tracking-wider"
              role="group"
              aria-label={tNav("langLabel")}
            >
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                aria-pressed={locale === "en"}
                translate="no"
                className={
                  locale === "en"
                    ? "px-2.5 py-1 rounded-full bg-white text-[#101014] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                    : "px-2.5 py-1 rounded-full text-[#52525B] hover:text-[#101014] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                }
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("es")}
                aria-pressed={locale === "es"}
                translate="no"
                className={
                  locale === "es"
                    ? "px-2.5 py-1 rounded-full bg-white text-[#101014] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                    : "px-2.5 py-1 rounded-full text-[#52525B] hover:text-[#101014] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
                }
              >
                ES
              </button>
            </div>

            <a
              href="#commission"
              className="hidden sm:inline-flex items-center gap-2 px-5 lg:px-6 py-3 bg-[#A01318] text-white rounded-full font-semibold text-xs tracking-wider uppercase shadow-md shadow-[#A01318]/15 hover:bg-[#800F13] hover:shadow-lg hover:shadow-[#A01318]/25 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] focus-visible:ring-offset-2 transition-all"
            >
              <span>{tNav("cta")}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileOpen ? tNav("closeMenu") : tNav("openMenu")}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border border-[#E5E5DF] text-[#101014] hover:border-[#101014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden w-full bg-[#FBFBF9] border-b border-[#E5E5DF] px-margin py-6 shadow-editorial-modal"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
              <a
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#101014] hover:bg-[#F4F4F0] transition-colors"
                href="#selected-works"
              >
                {tNav("work")}
              </a>
              <a
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#101014] hover:bg-[#F4F4F0] transition-colors"
                href="#services"
              >
                {tNav("services")}
              </a>
              <a
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#101014] hover:bg-[#F4F4F0] transition-colors"
                href="#industries"
              >
                {tNav("industries")}
              </a>
              <a
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#101014] hover:bg-[#F4F4F0] transition-colors"
                href="#manifesto"
              >
                {tNav("about")}
              </a>
              <a
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-[#101014] hover:bg-[#F4F4F0] transition-colors"
                href="#cadence"
              >
                {tNav("process")}
              </a>
              <div className="pt-3 mt-2 border-t border-[#EBEBE6] flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] px-2">
                  <span translate="no">Higüey, RD [18°37&apos;N]</span>
                  <span className="text-[#A01318] font-sans font-semibold">
                    {tTop("status")}
                  </span>
                </div>
                <a
                  onClick={() => setMobileOpen(false)}
                  href="#commission"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#A01318] text-white rounded-full font-bold text-xs tracking-widest uppercase shadow-md"
                >
                  <span>{tNav("cta")}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
