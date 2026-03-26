import { motion } from "framer-motion";
import type { ExperienceResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { formatDate, toTitleCase } from "../../utils/helper";
import { useColors, shadows } from "../../utils/theme";
import { FiBriefcase, FiMapPin } from "react-icons/fi";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { useIsMobile } from "../../hooks/useIsMobile";

interface ExperienceSectionProps {
  experiences: ExperienceResponse[];
}

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);
  const isMobile = useIsMobile();

  return (
    <section id="experience" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Experience"
          subtitle="Where I've worked and what I've built"
        />

        <div className="relative">

          {!isMobile && (
            <div
              className="absolute left-5 md:left-7 top-0 bottom-0 w-[2px] rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${colors.primary500}, ${colors.accent500}40, transparent)`
              }}
            />
          )}

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <FadeInView
                key={exp.id}
                delay={idx * 0.12}
                className={`relative ${isMobile ? "pl-0" : "pl-18"}`}
              >

                {!isMobile && (
                  <div
                    className="absolute left-3 md:left-5 top-6 w-5 h-5 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${colors.primary500}20`,
                      border: `2px solid ${colors.primary500}`,
                      boxShadow: `0 0 16px ${colors.primary500}40`,
                    }}
                  >
                    <FiBriefcase size={10} style={{ color: colors.primary400 }} />
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

                <motion.div
                  whileHover={{ boxShadow: s.card }}
                  className="rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: `${colors.neutral800}50`,
                    border: `1px solid ${colors.neutral700}35`,
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
                      <span
                        className="text-xs"
                        style={{ color: colors.neutral400 }}
                      >
                        <FiMapPin size={12} /> {exp.location}
                      </span>

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
                      limit={200}
                      mobileLimit={100}
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
                            src={skill.logoUrl}
                            alt={skill.logoName}
                            className="w-3.5 h-3.5"
                          />
                          {skill.logoName}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ExperienceSection);