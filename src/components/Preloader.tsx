"use client";

import React, { useEffect, useState } from "react";

export function Preloader() {
  const [phase, setPhase] = useState<"shimmer" | "color" | "exit" | "hidden">(
    "shimmer"
  );

  useEffect(() => {
    const startTime = Date.now();
    const MIN_SHIMMER_MS = 1150;
    const COLOR_HOLD_MS = 650;
    let triggered = false;

    const completeLoading = () => {
      if (triggered) return;
      triggered = true;

      const elapsed = Date.now() - startTime;
      const remainingShimmer = Math.max(0, MIN_SHIMMER_MS - elapsed);

      setTimeout(() => {
        setPhase("color");
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => {
            setPhase("hidden");
          }, 600);
        }, COLOR_HOLD_MS);
      }, remainingShimmer);
    };

    if (document.readyState === "complete") {
      completeLoading();
    } else {
      window.addEventListener("load", completeLoading, { once: true });
      const fallback = setTimeout(completeLoading, 2800);
      return () => {
        window.removeEventListener("load", completeLoading);
        clearTimeout(fallback);
      };
    }
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando Publimarca Studio"
      className={`fixed inset-0 z-[9999] bg-[#FBFBF9] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-500 ${
        phase === "color" ? "preloader-color-active" : ""
      } ${phase === "exit" ? "preloader-color-active opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative flex items-center justify-center px-10 py-8 overflow-hidden rounded-3xl">
        <img
          src="/logo%202.png"
          alt="Publimarca Studio"
          className="preloader-logo-img h-20 sm:h-24 md:h-28 w-auto object-contain relative z-10"
        />
        <div
          className="preloader-light-mask absolute inset-0 z-20 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="preloader-light-beam absolute" />
        </div>
        <div
          className="absolute inset-0 z-30 pointer-events-none overflow-hidden mix-blend-overlay"
          aria-hidden="true"
        >
          <div className="preloader-ambient-beam absolute" />
        </div>
      </div>

      <div
        className="w-36 sm:w-44 h-[2px] bg-[#E5E5DF] rounded-full overflow-hidden mt-4 relative"
        aria-hidden="true"
      >
        <div className="preloader-progress-Thumb w-1/2 h-full bg-gradient-to-r from-[#8A8A93] via-[#30B4D7] to-[#A01318] rounded-full" />
      </div>
    </div>
  );
}
