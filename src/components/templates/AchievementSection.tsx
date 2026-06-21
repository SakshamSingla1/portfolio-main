import { motion } from "framer-motion";
import type { Achievement } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiAward, FiCalendar, FiExternalLink } from "react-icons/fi";
import { formatDate, getOptimizedImageUrl } from "../../utils/helper";
import { useColors, shadows } from "../../utils/theme";
import React from "react";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const medalConfig = [
  { emoji: "🥇", color: "#f59e0b", glow: "#f59e0b" },   // idx 0 — gold
  { emoji: "🥈", color: "#94a3b8", glow: "#94a3b8" },   // idx 1 — silver
  { emoji: "🥉", color: "#cd7f32", glow: "#cd7f32" },   // idx 2 — bronze
];

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  return (
    <section id="achievements" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Achievements" subtitle="Recognition and accomplishments" />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => {
            const medal = idx < 3 ? medalConfig[idx] : null;
            const hoverBorderColor = medal ? medal.color : colors.primary500;

            return (
              <FadeInView key={ach.id} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: s.card }}
                  className="rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 h-full relative"
                  style={{
                    background: `${colors.neutral800}60`,
                    border: `1px solid ${colors.neutral700}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${hoverBorderColor}45`;
                    e.currentTarget.style.boxShadow = `0 12px 40px ${hoverBorderColor}18`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {/* Top shimmer accent line — gold for #1, primary for rest */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: idx === 0
                        ? `linear-gradient(90deg, transparent, ${colors.warning400}70, transparent)`
                        : `linear-gradient(90deg, transparent, ${colors.primary500}50, transparent)`,
                    }}
                  />

                  {/* Medal badge — top-left corner, overlapping border */}
                  {medal && (
                    <div
                      className="absolute z-10 flex items-center justify-center rounded-full text-sm select-none"
                      style={{
                        top: "-10px",
                        left: "-10px",
                        width: "28px",
                        height: "28px",
                        background: `${medal.color}22`,
                        border: `1.5px solid ${medal.color}55`,
                        boxShadow: `0 0 10px ${medal.glow}40`,
                      }}
                    >
                      {medal.emoji}
                    </div>
                  )}

                  {ach.proofUrl && (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={getOptimizedImageUrl(ach.proofUrl, { width: 800 })}
                        alt={ach.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${colors.neutral900}f0, ${colors.neutral800}80 40%, transparent 80%)`,
                        }}
                      />
                    </div>
                  )}

                  <div className="p-5 relative flex flex-col h-full">
                    <div
                      className="absolute top-3 right-4 font-mono text-2xl font-bold leading-none select-none pointer-events-none"
                      style={{ color: `${colors.primary500}12` }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary500}20, ${colors.primary700}15)`,
                          border: `1px solid ${colors.primary500}25`,
                          boxShadow: `0 4px 16px ${colors.primary500}15`,
                        }}
                      >
                        <FiAward style={{ color: colors.primary400 }} size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold" style={{ color: colors.neutral50 }}>
                          {ach.title}
                        </h3>
                        <p className="text-sm font-mono" style={{ color: colors.primary400 }}>
                          {ach.issuer}
                        </p>
                        <div className="mt-1">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono"
                            style={{
                              background: `${colors.neutral700}40`,
                              border: `1px solid ${colors.neutral700}60`,
                              color: colors.neutral500,
                            }}
                          >
                            <FiCalendar size={10} />
                            {formatDate(ach.achievedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mt-3 leading-relaxed flex-1" style={{ color: colors.neutral300 }}>
                      {ach.description}
                    </p>

                    {/* View Proof button — only when proofUrl AND proofPublicId exist */}
                    {ach.proofUrl && ach.proofPublicId && (
                      <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.neutral700}30` }}>
                        <a
                          href={ach.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-200"
                          style={{
                            color: colors.primary400,
                            border: `1px solid ${colors.primary500}30`,
                            background: `${colors.primary500}08`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${colors.primary500}18`;
                            e.currentTarget.style.borderColor = `${colors.primary500}55`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${colors.primary500}08`;
                            e.currentTarget.style.borderColor = `${colors.primary500}30`;
                          }}
                        >
                          <FiExternalLink size={11} />
                          View Proof
                        </a>
                      </div>
                    )}
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

export default React.memo(AchievementsSection);
