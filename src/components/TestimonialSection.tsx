"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const CARD_KEYS = ["c1", "c2", "c3", "c4"] as const;
const AUTO_ADVANCE_MS = 5200;

export function TestimonialSection() {
  const t = useTranslations("testimonial");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = CARD_KEYS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(nextSlide, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide]);

  const getDeckState = (idx: number) => {
    const offset = ((idx - activeIndex) % total + total) % total;
    if (offset === 0) return "active";
    if (offset === 1) return "next";
    if (offset === total - 1) return "prev";
    return "behind";
  };

  return (
    <section
      id="testimonials"
      className="w-full bg-[#FBFBF9] px-margin md:px-margin-tablet lg:px-margin-desktop py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#00758C] mb-2">
              <Quote className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest font-mono font-semibold">
                {t("kicker")}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101014]">
              {t("sectionTitle")}
            </h2>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#F4F4F0] border border-[#E5E5DF] text-[10px] font-mono uppercase tracking-wider text-[#52525B]">
            {t("badge")}
          </span>
        </div>

        {/* Carousel Row with Left & Right Arrows + Stacked Deck Stage */}
        <div className="relative flex items-center gap-3 sm:gap-6">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Comentario anterior"
            className="shrink-0 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border border-[#E5E5DF] text-[#101014] hover:bg-[#101014] hover:text-white hover:border-[#101014] shadow-sm flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30B4D7]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Stacked Cards Stage */}
          <div className="testimonial-deck-stage flex-1 pb-10">
            {CARD_KEYS.map((key, idx) => {
              const state = getDeckState(idx);
              return (
                <article
                  key={key}
                  data-deck-state={state}
                  aria-hidden={state !== "active"}
                  onClick={() => {
                    if (idx !== activeIndex) setActiveIndex(idx);
                  }}
                  className="testimonial-deck-card bg-white rounded-3xl p-7 sm:p-10 md:p-12 border border-[#E5E5DF] shadow-editorial"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5 text-[#00758C]">
                      <span className="text-xs uppercase tracking-widest font-mono font-semibold">
                        {t(`items.${key}.kicker`)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4F4F0] border border-[#E5E5DF] text-[10px] font-mono uppercase tracking-wider text-[#52525B]">
                        {t(`items.${key}.badge`)}
                      </span>
                    </div>
                    <blockquote className="text-xl sm:text-2xl lg:text-3xl text-[#101014] font-serif italic mb-8 leading-snug">
                      {t(`items.${key}.quote`)}
                    </blockquote>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-[#EBEBE6]">
                    <div>
                      <span className="text-base font-bold text-[#101014] block uppercase">
                        {t(`items.${key}.author`)}
                      </span>
                      <span className="text-xs text-[#52525B]">
                        {t(`items.${key}.role`)}
                      </span>
                    </div>
                    <div
                      className="font-mono text-xs text-[#00758C] font-semibold"
                      translate="no"
                    >
                      {t(`items.${key}.location`)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente comentario"
            className="shrink-0 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border border-[#E5E5DF] text-[#101014] hover:bg-[#101014] hover:text-white hover:border-[#101014] shadow-sm flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30B4D7]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div
          className="flex items-center justify-center gap-2.5 mt-4"
          role="tablist"
          aria-label="Indicadores de comentarios"
        >
          {CARD_KEYS.map((key, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Comentario ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={
                  isActive
                    ? "w-8 h-2.5 rounded-full bg-[#A01318] transition-all duration-300"
                    : "w-2.5 h-2.5 rounded-full bg-[#D1D1C7] hover:bg-[#52525B] transition-all duration-300"
                }
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
