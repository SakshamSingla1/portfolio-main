import { motion } from "framer-motion";
import type { Education } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiMapPin } from "react-icons/fi";
import { getEducationLabel, normalizePercentage } from "../../utils/helper";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { useColors } from "../../utils/theme";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { useIsMobile } from "../../hooks/useIsMobile";

interface EducationSectionProps {
  educations: Education[];
}

const EducationSection = ({ educations }: EducationSectionProps) => {
  const colors = useColors();
  const isMobile = useIsMobile();

  const sortedEducations = React.useMemo(() => {
    return [...educations].sort((a, b) => {
      const yearA = Number(a.endYear || a.startYear || 0);
      const yearB = Number(b.endYear || b.startYear || 0);
      return yearB - yearA;
    });
  }, [educations]);

  return (
    <section id="education" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Education" subtitle="Academic background and qualifications" />

        <div className="relative">
          {!isMobile && (
            <>
              <div
                className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px]"
                style={{
                  background: `linear-gradient(to bottom, ${colors.accent500}80, ${colors.neutral700}30, transparent)`,
                  boxShadow: `0 0 15px ${colors.accent500}20`
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
                  ease: "linear"
                }}
                className="absolute left-4 md:left-6 w-[2px] h-24 blur-[1px]"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${colors.accent400}, transparent)`,
                }}
              />
            </>
          )}

          <div className="space-y-12">
            {sortedEducations.map((edu, idx) => (
              <FadeInView
                key={edu.id}
                delay={idx * 0.1}
                className={`relative ${isMobile ? "pl-0" : "pl-12 md:pl-16"}`}
              >

                {!isMobile && (
                  <div className="absolute left-0 md:left-1 top-1 bottom-0 flex items-start">
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        background: colors.neutral900,
                        border: `1px solid ${colors.accent500}50`,
                        boxShadow: `0 0 15px ${colors.accent500}10`
                      }}
                    >
                      <HiOutlineAcademicCap
                        style={{ color: colors.accent400 }}
                        className="text-lg relative z-10"
                      />
                    </div>
                  </div>
                )}

                {isMobile && (
                  <div
                    className="mb-2 text-xs font-mono"
                    style={{ color: colors.primary400 }}
                  >
                    {edu.startYear} — {edu.endYear}
                  </div>
                )}

                <div
                  className="rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${colors.neutral800}60, ${colors.neutral900}80)`,
                    border: `1px solid ${colors.neutral700}30`,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <div>
                      <h3
                        className="font-display font-bold"
                        style={{ color: colors.neutral50 }}
                      >
                        {edu.institution}
                      </h3>

                      <p
                        className="text-sm font-mono"
                        style={{ color: colors.primary400 }}
                      >
                        {getEducationLabel(edu.degree)} — {edu.fieldOfStudy}
                      </p>
                    </div>

                    {!isMobile && (
                      <div
                        className="text-right font-mono text-xs"
                        style={{ color: colors.neutral400 }}
                      >
                        <div>
                          {edu.startYear} — {edu.endYear}
                        </div>

                        {edu.location && (
                          <div className="flex items-center gap-1 mt-1 md:justify-end">
                            <FiMapPin size={10} /> {edu.location}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isMobile && edu.location && (
                    <div
                      className="text-xs flex items-center gap-1 mb-2"
                      style={{ color: colors.neutral400 }}
                    >
                      <FiMapPin size={10} /> {edu.location}
                    </div>
                  )}

                  {edu.grade && (
                    <span
                      className="inline-block text-xs font-mono rounded px-2 py-0.5 mb-2"
                      style={{
                        color: colors.primary400,
                        background: `${colors.primary500}15`,
                      }}
                    >
                      {normalizePercentage(edu.grade)}
                    </span>
                  )}

                  {edu.description && (
                    <div
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: `${colors.neutral300}E6` }}
                    >
                      <ReadMoreText
                        text={edu.description || ""}
                        limit={150}
                        mobileLimit={80}
                        className="border-l-4 pl-4"
                      />
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

export default React.memo(EducationSection);