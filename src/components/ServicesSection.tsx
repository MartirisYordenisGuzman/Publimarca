"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const SERVICE_KEYS = ["s1", "s2", "s3", "s4"] as const;

export function ServicesSection() {
  const t = useTranslations("services");

  const handleSelectCapability = (capabilityKey: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("publimarca:select-capability", {
          detail: { capability: capabilityKey }
        })
      );
    }
  };

  return (
    <section
      id="services"
      className="w-full bg-[#F4F4F0] px-margin md:px-margin-tablet lg:px-margin-desktop py-20 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00758C] block mb-2">
              {t("kicker")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#101014] tracking-tight">
              {t("title")}
            </h2>
          </div>
          <p className="text-base text-[#52525B] max-w-md">{t("subtitle")}</p>
        </div>

        {/* Rounded Interactive Service Cards */}
        <div className="flex flex-col gap-4">
          {SERVICE_KEYS.map((key, index) => {
            const capabilityKey = t(`items.${key}.capabilityKey`);
            return (
              <motion.a
                key={key}
                href="#commission"
                onClick={() => handleSelectCapability(capabilityKey)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group p-6 sm:p-8 bg-white hover:bg-[#FFFFFF] rounded-3xl border border-[#E5E5DF] hover:border-[#A01318]/40 shadow-editorial hover:shadow-editorial-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01318] transition-all block"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div
                    className="lg:col-span-1 font-mono text-sm font-bold text-[#00758C]"
                    translate="no"
                  >
                    {t(`items.${key}.number`)}
                  </div>
                  <div className="lg:col-span-5">
                    <h3 className="font-display text-xl font-bold uppercase text-[#101014] group-hover:text-[#A01318] transition-colors">
                      {t(`items.${key}.title`)}
                    </h3>
                    <span className="text-xs uppercase text-[#52525B] font-mono font-medium">
                      {t(`items.${key}.tags`)}
                    </span>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex justify-start lg:justify-end">
                    <span
                      className="w-11 h-11 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#101014] group-hover:bg-[#A01318] group-hover:text-white transition-all shadow-sm"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
