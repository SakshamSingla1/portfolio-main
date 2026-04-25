import { useState } from "react";
import { motion } from "framer-motion";
import type { SkillResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import { toTitleCase } from "../../utils/helper";
import { useColors } from "../../utils/theme";
import React from "react";
import SkillsAutoScrollBar from "../molecules/SkillsAutoScrollBar/SkillsAutoScrollBar";

interface SkillsSectionProps {
  skills: SkillResponse[];
}

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const colors = useColors();
  const categories = [...new Set(skills.map((sk) => sk.category))];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const levelColor = (level: string) => {
    switch (level) {
      case "Expert": return colors.primary400;
      case "Advanced": return colors.secondary400;
      case "Intermediate": return colors.accent400;
      default: return colors.neutral400;
    }
  };

  const levelBar = (level: string) => {
    switch (level) {
      case "Expert": return "100%";
      case "Advanced": return "75%";
      case "Intermediate": return "50%";
      default: return "25%";
    }
  };

  const filteredSkills = activeCategory
    ? skills.filter((sk) => sk.category === activeCategory)
    : skills;

  return (
    <section
      id="skills"
      className="section-padding relative"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Tech Stack" subtitle="Technologies I work with on a daily basis" />

        <SkillsAutoScrollBar skills={skills} />

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-300"
            style={{
              color: !activeCategory ? colors.primary300 : colors.neutral400,
              background: !activeCategory ? `${colors.primary500}15` : `${colors.neutral700}30`,
              border: `1px solid ${!activeCategory ? colors.primary500 + "30" : colors.neutral700 + "20"}`,
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-300"
              style={{
                color: activeCategory === cat ? colors.primary300 : colors.neutral400,
                background: activeCategory === cat ? `${colors.primary500}15` : `${colors.neutral700}30`,
                border: `1px solid ${activeCategory === cat ? colors.primary500 + "30" : colors.neutral700 + "20"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -6, boxShadow: `0 12px 30px ${colors.primary500}15` }}
              className="rounded-xl p-4 flex flex-col items-center gap-3 group cursor-default transition-all duration-300 backdrop-blur-md relative overflow-hidden"
              style={{
                background: `${colors.neutral900}70`,
                border: `1px solid ${colors.neutral700}30`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${levelColor(skill.level)}40`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.neutral700}30`; }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${levelColor(skill.level)}40, transparent)` }}
              />

              <div className="w-11 h-11 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src={skill.logoUrl} alt={skill.logoName} className="w-9 h-9 object-contain" />
              </div>
              <div className="text-center w-full">
                <p className="text-sm font-medium" style={{ color: colors.neutral100 }}>
                  {skill.logoName}
                </p>
                <div className="mt-2 h-1 rounded-full w-full" style={{ background: `${colors.neutral700}50` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: levelColor(skill.level), width: levelBar(skill.level) }}
                    initial={{ width: 0 }}
                    whileInView={{ width: levelBar(skill.level) }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <p className="text-[10px] font-mono mt-1.5" style={{ color: levelColor(skill.level) }}>
                  {toTitleCase(skill.level)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(SkillsSection);
