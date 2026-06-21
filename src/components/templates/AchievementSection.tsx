import { motion } from "framer-motion";
import type { Achievement } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiAward, FiCalendar } from "react-icons/fi";
import { formatDate, getOptimizedImageUrl } from "../../utils/helper";
import { useColors, shadows } from "../../utils/theme";
import React from "react";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  return (
    <section id="achievements" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Achievements" subtitle="Recognition and accomplishments" />

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((ach, idx) => (
            <FadeInView key={ach.id} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -4, boxShadow: s.card }}
                className="rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 h-full relative"
                style={{
                  background: `${colors.neutral800}60`,
                  border: `1px solid ${colors.neutral700}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary500}45`;
                  e.currentTarget.style.boxShadow = `0 12px 40px ${colors.primary500}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Top shimmer accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.primary500}50, transparent)`,
                  }}
                />

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

                <div className="p-5 relative">
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
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: colors.neutral300 }}>
                    {ach.description}
                  </p>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(AchievementsSection);
