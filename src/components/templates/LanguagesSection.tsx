import React from "react";
import { motion } from "framer-motion";
import type { LanguageResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { TbLanguage } from "react-icons/tb";
import { useColors } from "../../utils/theme";

interface LanguagesSectionProps {
  languages: LanguageResponse[];
}

const PROFICIENCY_CONFIG: Record<string, { label: string; width: string; color: string }> = {
  NATIVE:       { label: "Native",       width: "100%", color: "#10b981" },
  FLUENT:       { label: "Fluent",        width: "80%",  color: "#3b82f6" },
  INTERMEDIATE: { label: "Intermediate",  width: "55%",  color: "#f59e0b" },
  BASIC:        { label: "Basic",         width: "30%",  color: "#94a3b8" },
};

const LanguagesSection = ({ languages }: LanguagesSectionProps) => {
  const colors = useColors();

  const gridColsClass =
    languages.length === 1 ? "sm:grid-cols-1" :
    languages.length === 2 ? "sm:grid-cols-2" :
    languages.length === 3 ? "sm:grid-cols-2 md:grid-cols-3" :
    "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  const gridWidthClass = languages.length < 4 ? "max-w-4xl mx-auto" : "";

  return (
    <section id="languages" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Languages" subtitle="Communication across cultures" />

        <div className={`grid ${gridColsClass} gap-4 ${gridWidthClass}`}>
          {languages.map((lang, idx) => {
            const config = PROFICIENCY_CONFIG[lang.proficiency] ?? PROFICIENCY_CONFIG.BASIC;

            return (
              <FadeInView key={lang.id} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-300"
                  style={{
                    background: `linear-gradient(145deg, ${colors.neutral800}70, ${colors.neutral900}80)`,
                    border: `1px solid ${colors.neutral700}40`,
                    backdropFilter: "blur(8px)",
                    boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${config.color}45`;
                    e.currentTarget.style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px ${config.color}35`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                    e.currentTarget.style.boxShadow = `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`;
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${config.color}18`,
                        border: `1px solid ${config.color}30`,
                      }}
                    >
                      <TbLanguage size={16} style={{ color: config.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight" style={{ color: colors.neutral50 }}>
                        {lang.languageName}
                      </p>
                      <p className="text-xs font-mono" style={{ color: config.color }}>
                        {config.label}
                      </p>
                    </div>
                  </div>

                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: `${colors.neutral700}50` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: config.width }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                      style={{ background: config.color }}
                    />
                  </div>
                </motion.div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(LanguagesSection);
