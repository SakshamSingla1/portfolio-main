import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import { toTitleCase, getOptimizedImageUrl } from "../../utils/helper";
import { useColors } from "../../utils/theme";
import React from "react";
import SkillsAutoScrollBar from "../molecules/SkillsAutoScrollBar/SkillsAutoScrollBar";

interface SkillsSectionProps {
  skills: SkillResponse[];
}

const LEVELS = ["Expert", "Advanced", "Intermediate", "Beginner"] as const;

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => [...new Set(skills.map((sk) => sk.category))],
    [skills]
  );

  const categoryCounts = useMemo(() => {
    return skills.reduce<Record<string, number>>((acc, sk) => {
      acc[sk.category] = (acc[sk.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [skills]);

  const levelColor = (level: string) => {
    switch (level) {
      case "Expert": return colors.primary300;
      case "Advanced": return colors.primary400;
      case "Intermediate": return colors.primary500;
      default: return colors.primary600;
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

  const filteredSkills = useMemo(() => {
    const query = search.toLowerCase();
    return skills
      .filter((sk) => !activeCategory || sk.category === activeCategory)
      .filter((sk) => sk.logoName.toLowerCase().includes(query));
  }, [skills, activeCategory, search]);

  // Proficiency counts from full skills array
  const levelCounts = useMemo(() => {
    return LEVELS.reduce<Record<string, number>>((acc, lvl) => {
      acc[lvl] = skills.filter((sk) => sk.level === lvl).length;
      return acc;
    }, {});
  }, [skills]);

  // Featured skills: Expert level, or top 4 if none
  const { featuredSkills, showFeatured } = useMemo(() => {
    const expertSkills = skills.filter((sk) => sk.level === "Expert");
    return {
      featuredSkills: expertSkills.length > 0 ? expertSkills : skills.slice(0, 4),
      showFeatured: expertSkills.length > 0,
    };
  }, [skills]);

  return (
    <section
      id="skills"
      className="section-padding relative"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Tech Stack" subtitle="Technologies I work with on a daily basis" />

        <SkillsAutoScrollBar skills={skills} />

        {/* Featured Skills Row */}
        {showFeatured && (
          <div className="mb-8">
            <p
              className="text-xs font-mono font-semibold uppercase tracking-widest mb-3"
              style={{ color: colors.primary400 }}
            >
              Featured
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {featuredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  whileHover={{ y: -6, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl p-4 flex flex-col items-center gap-2 shrink-0 w-24 cursor-default backdrop-blur-md"
                  style={{
                    background: `linear-gradient(145deg, ${colors.primary500}12, ${colors.neutral900}60)`,
                    border: `1px solid ${colors.primary500}25`,
                    boxShadow: `0 1px 0 0 rgba(255,255,255,0.05) inset, 0 16px 32px -20px ${colors.primary500}35`,
                  }}
                >
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img
                      src={getOptimizedImageUrl(skill.logoUrl, { width: 120 })}
                      alt={skill.logoName}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <p
                    className="text-xs font-medium text-center leading-tight"
                    style={{ color: colors.neutral100 }}
                  >
                    {skill.logoName}
                  </p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full"
                    style={{
                      color: levelColor(skill.level),
                      background: `${levelColor(skill.level)}18`,
                      border: `1px solid ${levelColor(skill.level)}30`,
                    }}
                  >
                    {skill.level}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Proficiency Overview Mini-Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {LEVELS.map((lvl) => (
            <motion.div
              key={lvl}
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="stat-tile flex flex-col items-center gap-1 py-4"
            >
              <span
                className="text-2xl font-mono font-bold"
                style={{ color: levelColor(lvl) }}
              >
                {levelCounts[lvl]}
              </span>
              <span
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: colors.neutral400 }}
              >
                {lvl}
              </span>
              <div
                className="w-2 h-2 rounded-full mt-0.5"
                style={{ background: levelColor(lvl) }}
              />
            </motion.div>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="rounded-xl px-4 py-2 font-mono text-sm w-full"
              style={{
                background: `${colors.neutral800}60`,
                border: `1px solid ${colors.neutral700}40`,
                color: colors.neutral100,
                outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono leading-none"
                style={{ color: colors.neutral400 }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className="rounded-full font-mono text-xs transition-all duration-300 flex items-center gap-1.5"
            style={{
              padding: !activeCategory ? "0.5rem 1.25rem" : "0.375rem 1rem",
              color: !activeCategory ? colors.primary300 : colors.neutral400,
              background: !activeCategory ? `${colors.primary500}15` : `${colors.neutral700}30`,
              border: `1px solid ${!activeCategory ? colors.primary500 + "30" : colors.neutral700 + "20"}`,
              fontWeight: !activeCategory ? 600 : undefined,
              boxShadow: !activeCategory ? `0 4px 12px ${colors.primary500}20` : undefined,
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== null) {
                e.currentTarget.style.background = `${colors.primary500}08`;
                e.currentTarget.style.color = colors.neutral300;
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== null) {
                e.currentTarget.style.background = `${colors.neutral700}30`;
                e.currentTarget.style.color = colors.neutral400;
              }
            }}
          >
            All
            <span
              className="inline-flex items-center justify-center rounded-full text-[9px] px-1 min-w-[16px]"
              style={{
                background: !activeCategory ? `${colors.primary500}30` : `${colors.neutral700}50`,
                color: !activeCategory ? colors.primary300 : colors.neutral600,
              }}
            >
              {skills.length}
            </span>
          </button>
          {categories.map((cat) => {
            const count = categoryCounts[cat] ?? 0;
            return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full font-mono text-xs transition-all duration-300 flex items-center gap-1.5"
              style={{
                padding: activeCategory === cat ? "0.5rem 1.25rem" : "0.375rem 1rem",
                color: activeCategory === cat ? colors.primary300 : colors.neutral400,
                background: activeCategory === cat ? `${colors.primary500}15` : `${colors.neutral700}30`,
                border: `1px solid ${activeCategory === cat ? colors.primary500 + "30" : colors.neutral700 + "20"}`,
                fontWeight: activeCategory === cat ? 600 : undefined,
                boxShadow: activeCategory === cat ? `0 4px 12px ${colors.primary500}20` : undefined,
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.background = `${colors.primary500}08`;
                  e.currentTarget.style.color = colors.neutral300;
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.background = `${colors.neutral700}30`;
                  e.currentTarget.style.color = colors.neutral400;
                }
              }}
            >
              {cat}
              <span
                className="inline-flex items-center justify-center rounded-full text-[9px] px-1 min-w-[16px]"
                style={{
                  background: activeCategory === cat ? `${colors.primary500}30` : `${colors.neutral700}50`,
                  color: activeCategory === cat ? colors.primary300 : colors.neutral600,
                }}
              >
                {count}
              </span>
            </button>
            );
          })}
        </div>

        {/* No `layout`/popLayout FLIP animation here: with an unpaginated,
            live-filterable grid, every keystroke in the search box or
            category click would force a getBoundingClientRect measurement
            pass across every visible card just to animate the reflow. A
            plain fade/scale on mount/unmount keeps the transition without
            that per-interaction layout cost. */}
        <AnimatePresence>
        <motion.div className="flex flex-wrap justify-center gap-3">
          {filteredSkills.map((skill) => {
            const cardHoverShadow = `0 12px 30px ${levelColor(skill.level)}25`;
            return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              whileHover={{ y: -6, boxShadow: cardHoverShadow }}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(25%-0.5625rem)] md:w-[calc(16.6667%-0.625rem)] lg:w-[calc(10%-0.675rem)] rounded-xl p-4 flex flex-col items-center gap-3 group cursor-default transition-all duration-300 backdrop-blur-md relative overflow-hidden"
              style={{
                background: `${colors.neutral800}55`,
                border: `1px solid ${colors.neutral700}30`,
                boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 32px -24px rgba(0,0,0,0.7)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${levelColor(skill.level)}40`;
                e.currentTarget.style.background = `${colors.neutral800}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.neutral700}30`;
                e.currentTarget.style.background = `${colors.neutral800}55`;
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${levelColor(skill.level)}50, transparent)` }}
              />

              <div className="w-11 h-11 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src={getOptimizedImageUrl(skill.logoUrl, { width: 100 })} alt={skill.logoName} className="w-9 h-9 object-contain" />
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
                <p className="text-[9px] font-bold uppercase tracking-wider font-mono mt-1.5" style={{ color: levelColor(skill.level) }}>
                  {toTitleCase(skill.level)}
                </p>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default React.memo(SkillsSection);
