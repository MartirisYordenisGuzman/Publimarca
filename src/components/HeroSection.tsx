"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video
      .play()
      .then(() => {
        setIsMuted(false);
        setIsPaused(false);
      })
      .catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
  }, []);

  // Clicking on the video itself silences (or activates) audio and continues playback
  const handleVideoSurfaceClick = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    }
  };

  const handleTogglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    }
  };

  return (
    <section className="relative w-full px-margin md:px-margin-tablet lg:px-margin-desktop pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#A01318]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-4 w-96 h-96 rounded-full bg-[#30B4D7]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch relative z-10">
        {/* Left Column: Typographic Statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-between py-2"
        >
          <div className="flex flex-col">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.15rem] font-bold text-[#101014] tracking-[-0.025em] uppercase leading-[1.05] mb-6">
              {t("headlinePrefix")}{" "}
              <span className="font-serif italic font-normal normal-case text-[#A01318] underline decoration-[#30B4D7]/40 decoration-2 underline-offset-8">
                {t("headlineHighlight")}
              </span>{" "}
              {t("headlineSuffix")}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#52525B] font-light leading-relaxed max-w-xl mb-8">
              {t("subheadline")}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
              <a
                href="#commission"
                className="px-7 sm:px-8 py-4 bg-[#A01318] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md shadow-[#A01318]/20 hover:bg-[#851014] hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] focus-visible:ring-offset-2 transition-all flex items-center gap-2 group"
              >
                <span
                  className="w-2 h-2 rounded-full bg-[#30B4D7]"
                  aria-hidden="true"
                />
                <span>{t("ctaPrimary")}</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#selected-works"
                className="px-6 sm:px-7 py-4 bg-white text-[#101014] border border-[#E5E5DF] rounded-full text-xs font-bold uppercase tracking-widest hover:border-[#101014] hover:bg-[#F8F8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101014] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>{t("ctaSecondary")}</span>
              </a>
            </div>

            {/* Metric Ribbon: Soft Light Card */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 p-5 sm:p-6 bg-white rounded-3xl border border-[#E5E5DF] shadow-editorial"
              aria-label="Studio Production Capabilities"
            >
              <div>
                <span className="text-2xl lg:text-3xl font-bold text-[#00758C] block">
                  {t("metric1Val")}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#52525B] font-medium block mt-0.5">
                  {t("metric1Label")}
                </span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-[#EBEBE6] pt-3 sm:pt-0 sm:pl-4">
                <span
                  className="text-2xl lg:text-3xl font-bold text-[#A01318] block"
                  translate="no"
                >
                  {t("metric2Val")}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#52525B] font-medium block mt-0.5">
                  {t("metric2Label")}
                </span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-[#EBEBE6] pt-3 sm:pt-0 sm:pl-4">
                <span
                  className="text-2xl lg:text-3xl font-bold text-[#101014] block"
                  translate="no"
                >
                  {t("metric3Val")}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#52525B] font-medium block mt-0.5">
                  {t("metric3Label")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Studio Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-5 relative flex flex-col justify-end"
        >
          <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[620px] rounded-3xl overflow-hidden bg-[#ECECE7] shadow-xl border border-[#E5E5DF] group cursor-pointer">
            <video
              ref={videoRef}
              onClick={handleVideoSurfaceClick}
              autoPlay
              loop
              playsInline
              preload="auto"
              aria-label={t("imageAlt")}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            >
              <source src="/video_hero_publimarca.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#101014]/75 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Subtle Pause/Play Icon on Hover only */}
            <button
              type="button"
              onClick={handleTogglePlayPause}
              aria-label={isPaused ? "Play video" : "Pause video"}
              className="absolute bottom-5 right-5 z-20 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full text-[#101014] hover:bg-[#A01318] hover:text-white flex items-center justify-center shadow-sm border border-white/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318]"
            >
              {isPaused ? (
                <Play className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Pause className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <div className="absolute top-5 right-5 z-10 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-[#101014] text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-white/60 pointer-events-none">
              <span
                className="w-2 h-2 rounded-full bg-[#A01318] animate-ping"
                aria-hidden="true"
              />
              <span>{t("liveStage")}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Hero Ribbon: Grayish Scrolling Client Logos Marquee */}
      <div className="max-w-6xl mx-auto mt-12 md:mt-16 pt-8 border-t border-[#E5E5DF]/90 relative z-10">
        <div className="flex items-center justify-between gap-4 mb-5">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8A8A93] font-semibold">
            {t("clientsLabel")}
          </span>
          <span
            className="hidden sm:inline-block h-px flex-1 bg-[#EBEBE6]"
            aria-hidden="true"
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
            RD • INTL
          </span>
        </div>

        <div
          className="relative w-full overflow-hidden py-3 select-none"
          aria-label="Client Logos Marquee"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#FBFBF9] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#FBFBF9] to-transparent z-10"
            aria-hidden="true"
          />

          <div className="animate-marquee items-center">
            {[0, 1].map((dupIndex) => (
              <div
                key={dupIndex}
                className="flex items-center gap-14 sm:gap-20 pr-14 sm:pr-20"
                aria-hidden={dupIndex === 1 ? "true" : undefined}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="agmotors"
                  aria-label="AGMOTORS"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/LOGO%20AGMOTORS.png"
                    alt="AGMOTORS"
                    className="client-logo-img h-8 sm:h-9 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="mallascontrol"
                  aria-label="Mallas Control"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/Logo%20mallas%20control.PNG"
                    alt="Mallas Control"
                    className="client-logo-img h-12 sm:h-14 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="cabrari"
                  aria-label="Cabrari Carnes & Lácteos"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/CABRARI%20LOGO%20PNG.png"
                    alt="Cabrari Carnes & Lácteos"
                    className="client-logo-img h-12 sm:h-14 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="inversionesabreu"
                  aria-label="Inversiones Abreu Contreras"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/LOGO%20ABRE%20CONTRERAS.png"
                    alt="Inversiones Abreu Contreras"
                    className="client-logo-img h-12 sm:h-14 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="paralelos"
                  aria-label="Paralelos Ingenieros Arquitectos"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/logo%20paralelos.png"
                    alt="Paralelos Ingenieros Arquitectos"
                    className="client-logo-img h-8 sm:h-9 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="dwillyempanadas"
                  aria-label="D'Willy Empanadas y Más"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/LOGO%20D%20WILLY%20EMPANADAS.png"
                    alt="D'Willy Empanadas y Más"
                    className="client-logo-img h-12 sm:h-14 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    if (e.currentTarget.getAttribute("href") === "#") {
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={dupIndex === 1 ? -1 : undefined}
                  data-brand-slug="gregorioluperon"
                  aria-label="Politécnico Gregorio Luperón"
                  className="group flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] rounded-lg"
                >
                  <img
                    src="/Logos/LOGO%20GREGORIO%20LUPERON.png"
                    alt="Politécnico Gregorio Luperón"
                    className="client-logo-img h-10 sm:h-12 w-auto object-contain grayscale hover:grayscale-0 group-hover:grayscale-0 opacity-65 group-hover:opacity-100 transition-all duration-300 mix-blend-multiply"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
