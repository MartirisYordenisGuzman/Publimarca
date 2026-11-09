"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Brain, Palette, Rocket, Video } from "lucide-react";

const STAGES = [
  { key: "s1", color: "text-[#A01318]", Icon: Brain },
  { key: "s2", color: "text-[#00758C]", Icon: Palette },
  { key: "s3", color: "text-[#A01318]", Icon: Video },
  { key: "s4", color: "text-[#00758C]", Icon: Rocket }
] as const;

export function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section
      id="cadence"
      className="w-full bg-[#F4F4F0] px-margin md:px-margin-tablet lg:px-margin-desktop py-20 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00758C] block mb-2">
              {t("kicker")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#101014] tracking-tight">
              {t("title")}
            </h2>
          </div>
          <span
            className="font-mono text-xs text-[#52525B] bg-white px-3.5 py-1.5 rounded-full border border-[#E5E5DF] hidden md:block"
            translate="no"
          >
            {t("code")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map(({ key, color, Icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="bg-white rounded-3xl p-7 flex flex-col justify-between border border-[#E5E5DF] shadow-editorial hover:shadow-editorial-hover transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`font-mono text-xl ${color} font-bold`}
                    translate="no"
                  >
                    {t(`stages.${key}.number`)}
                  </span>
                  <Icon
                    className="w-5 h-5 text-[#52525B]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-[#101014] mb-2">
                  {t(`stages.${key}.title`)}
                </h3>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  {t(`stages.${key}.description`)}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#EBEBE6] text-[#52525B] text-[11px] font-mono font-medium">
                {t(`stages.${key}.deliverable`)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
