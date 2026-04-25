import { motion } from "framer-motion";
import type { ExperienceResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { formatDate, toTitleCase, getOptimizedImageUrl } from "../../utils/helper";
import { useColors } from "../../utils/theme";
import { FiBriefcase, FiMapPin } from "react-icons/fi";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { useIsMobile } from "../../hooks/useIsMobile";

interface ExperienceSectionProps {
  experiences: ExperienceResponse[];
}

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  return (
    <section id="experience" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Experience"
          subtitle="Where I've worked and what I've built"
        />

        <div className="relative">

          {!isMobile && (
            <>
              <div
                className="absolute left-5 md:left-7 top-0 bottom-0 w-[2px]"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary500}80, ${colors.neutral700}30, transparent)`,
                  boxShadow: `0 0 15px ${colors.primary500}20`
                }}
              />
              <motion.div
                animate={{
                  top: ["0%", "100%"],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2 // Staggered from education
                }}
                className="absolute left-5 md:left-7 w-[2px] h-24 blur-[1px]"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${colors.primary400}, transparent)`,
                }}
              />
            </>
          )}

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <FadeInView
                key={exp.id}
                delay={idx * 0.12}
                className={`relative ${isMobile ? "pl-0" : "pl-18"}`}
              >

                {!isMobile && (
                  <div className="absolute left-0 md:left-2 top-6 bottom-0 flex items-start">
                    <div
                      className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500"
                      style={{
                        background: colors.neutral900,
                        border: `1px solid ${colors.primary500}50`,
                        boxShadow: `0 0 15px ${colors.primary500}10`
                      }}
                    >
                      <FiBriefcase
                        style={{ color: colors.primary400 }}
                        className="text-lg relative z-10"
                      />
                    </div>
                  </div>
                )}

                {isMobile && (
                  <div className="mb-2 text-xs font-mono" style={{ color: colors.primary400 }}>
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                  </div>
                )}

                {!isMobile && (
                  <div className="mb-2">
                    <span
                      className="inline-flex items-center font-mono text-xs px-3 py-1 rounded-full"
                      style={{
                        color: colors.primary400,
                        background: `${colors.primary500}10`,
                        border: `1px solid ${colors.primary500}20`,
                      }}
                    >
                      {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                    </span>
                  </div>
                )}

                <div
                  className="rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${colors.neutral800}60, ${colors.neutral900}80)`,
                    border: `1px solid ${colors.neutral700}30`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary500}40, transparent 80%)`
                    }}
                  />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3
                        className="text-lg font-display font-bold"
                        style={{ color: colors.neutral50 }}
                      >
                        {exp.jobTitle}
                      </h3>
                      <p
                        className="font-medium text-sm"
                        style={{ color: colors.primary400 }}
                      >
                        {exp.companyName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="text-xs flex items-center gap-1"
                        style={{ color: colors.neutral400 }}
                      >
                        <FiMapPin size={12} /> {exp.location}
                      </div>

                      <span
                        className="text-xs font-mono rounded-full px-2.5 py-0.5"
                        style={{
                          color: colors.accent400,
                          background: `${colors.accent500}10`,
                          border: `1px solid ${colors.accent500}15`,
                        }}
                      >
                        {toTitleCase(exp.employmentStatus)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: `${colors.neutral300}E6` }}
                  >
                    <ReadMoreText
                      text={exp.description || ""}
                      limit={150}
                      mobileLimit={80}
                      className="border-l-4 pl-4"
                    />
                  </div>

                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1.5 text-xs font-mono rounded-full px-2.5 py-1"
                          style={{
                            color: colors.neutral200,
                            background: `${colors.neutral700}40`,
                            border: `1px solid ${colors.neutral600}20`,
                          }}
                        >
                          <img
                            src={getOptimizedImageUrl(skill.logoUrl, { width: 60 })}
                            alt={skill.logoName}
                            className="w-3.5 h-3.5"
                            loading="lazy"
                          />
                          {skill.logoName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ExperienceSection);