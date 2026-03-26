import { motion } from "framer-motion";
import type { Achievement } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiAward } from "react-icons/fi";
import { formatDate } from "../../utils/helper";
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
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Achievements" subtitle="Recognition and accomplishments" />

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((ach, idx) => (
            <FadeInView key={ach.id} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -4, boxShadow: s.card }}
                className="rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 h-full"
                style={{
                  background: `${colors.neutral800}60`,
                  border: `1px solid ${colors.neutral700}40`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}30`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.neutral700}40`; }}
              >
                {ach.proofUrl && (
                  <div className="h-40 overflow-hidden relative">
                    <img src={ach.proofUrl} alt={ach.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.neutral800}, transparent 70%)` }} />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${colors.primary500}15` }}
                    >
                      <FiAward style={{ color: colors.primary400 }} size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold" style={{ color: colors.neutral50 }}>{ach.title}</h3>
                      <p className="text-sm font-mono" style={{ color: colors.primary400 }}>{ach.issuer}</p>
                      <p className="text-xs font-mono mt-1" style={{ color: colors.neutral500 }}>
                        {formatDate(ach.achievedAt)}
                      </p>
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
