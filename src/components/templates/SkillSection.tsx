import { motion } from "framer-motion";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { SkillResponse } from "../../utils/types";

interface Props {
  skills: SkillResponse[];
}

export const SkillsSection = ({ skills }: Props) => {
  const colors = useColors();
  const categories = [...new Set(skills.map((s) => s.category))];

  const levelConfig: Record<string, { gradient: string; text: string; border: string; width: string }> = {
    EXPERT: { gradient: `linear-gradient(90deg, ${colors.success400}99, ${colors.success400})`, text: colors.success400, border: `${colors.success500}33`, width: "95%" },
    ADVANCED: { gradient: `linear-gradient(90deg, ${colors.primary400}99, ${colors.primary400})`, text: colors.primary400, border: `${colors.primary500}33`, width: "80%" },
    INTERMEDIATE: { gradient: `linear-gradient(90deg, ${colors.warning400}99, ${colors.warning400})`, text: colors.warning400, border: `${colors.warning500}33`, width: "60%" },
    BEGINNER: { gradient: `linear-gradient(90deg, ${colors.neutral500}99, ${colors.neutral500})`, text: colors.neutral400, border: `${colors.neutral600}33`, width: "35%" },
  };

  return (
    <section id="skills" className="section-container relative">
      <SectionHeading title="Skills & Technologies" subtitle="The tools and technologies I use to bring ideas to life" />

      <div className="space-y-14">
        {categories.map((cat, catIdx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: catIdx * 0.1, duration: 0.5 }}
          >
            {/* Category header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${colors.primary500}26, transparent)` }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
                style={{
                  color: colors.primary400,
                  backgroundColor: `${colors.primary500}0A`,
                  border: `1px solid ${colors.primary500}15`,
                }}
              >
                {cat}
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${colors.primary500}26, transparent)` }} />
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills
                .filter((s) => s.category === cat)
                .map((skill, i) => {
                  const lc = levelConfig[skill.level] || levelConfig.BEGINNER;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      className="glass-card-premium p-5 flex flex-col items-center gap-3 cursor-default group"
                    >
                      {/* Icon */}
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ backgroundColor: `${colors.primary500}0A` }}
                        />
                        <img src={skill.logoUrl} alt={skill.logoName} className="w-9 h-9 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <span className="text-sm font-medium text-center" style={{ color: colors.neutral200 }}>
                        {skill.logoName}
                      </span>

                      {/* Progress bar */}
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.neutral700}40` }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: lc.width }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          style={{ background: lc.gradient }}
                        />
                      </div>

                      {/* Level badge */}
                      <span
                        className="text-[9px] px-2.5 py-0.5 rounded-full font-semibold tracking-wider uppercase"
                        style={{ backgroundColor: `${lc.text}12`, color: lc.text, border: `1px solid ${lc.border}` }}
                      >
                        {skill.level}
                      </span>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
