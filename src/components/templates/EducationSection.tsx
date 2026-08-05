import { motion } from "framer-motion";
import type { Education } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiMapPin, FiCheck } from "react-icons/fi";
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

  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

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

        <div className="relative max-w-4xl mx-auto">
          {!isMobile && (
            <>
              {/* Timeline track */}
              <div
                className="absolute left-4 md:left-6 top-0 bottom-0 w-[2px]"
                style={{
                  background: `linear-gradient(to bottom, ${colors.accent500}90, ${colors.accent500}30, transparent)`,
                }}
              />
              {/* Outer glow behind track */}
              <div
                className="absolute left-3 md:left-5 top-0 bottom-0 w-4 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${colors.accent500}12, transparent 60%)`,
                  filter: "blur(6px)",
                }}
              />
              {/* Comet: bright head + long fading tail */}
              <motion.div
                className="absolute left-4 md:left-6 w-[2px] pointer-events-none"
                animate={{ top: ["-15%", "110%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              >
                {/* tail */}
                <div
                  className="w-full"
                  style={{
                    height: 64,
                    background: `linear-gradient(to bottom, transparent, ${colors.accent400}80)`,
                  }}
                />
                {/* head */}
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colors.accent300,
                    boxShadow: `0 0 8px 3px ${colors.accent400}90`,
                    marginLeft: -2,
                  }}
                />
              </motion.div>
            </>
          )}

          <div className="space-y-12">
            {sortedEducations.map((edu, idx) => {
              const isHovered = hoveredId === edu.id;

              return (
                <FadeInView
                  key={edu.id}
                  delay={idx * 0.1}
                  className={`relative ${isMobile ? "pl-0" : "pl-12 md:pl-16"}`}
                >

                  {!isMobile && (
                    <div className="absolute left-0 md:left-1 top-1 bottom-0 flex flex-col items-center gap-1">
                      {/* Pulse ring + icon node */}
                      <div className="relative w-10 h-10 shrink-0">
                        <motion.div
                          className="absolute inset-0 rounded-full pointer-events-none"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
                          style={{ border: `2px solid ${colors.accent500}60` }}
                        />
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ border: `2px solid ${colors.accent400}` }}
                          />
                        )}
                        <div
                          className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                          style={{
                            background: isHovered
                              ? `linear-gradient(135deg, ${colors.accent500}30, ${colors.neutral900})`
                              : colors.neutral900,
                            border: `1px solid ${isHovered ? colors.accent400 : `${colors.accent500}50`}`,
                            boxShadow: isHovered
                              ? `0 0 20px ${colors.accent500}40`
                              : `0 0 10px ${colors.accent500}10`,
                          }}
                        >
                          <HiOutlineAcademicCap
                            style={{ color: isHovered ? colors.accent300 : colors.accent400 }}
                            className="text-lg relative z-10"
                          />
                        </div>
                      </div>
                      {/* Step number below node */}
                      <span
                        className="font-mono text-[10px] font-bold leading-none"
                        style={{ color: `${colors.accent500}50` }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
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
                    // No backdrop-blur — see ExperienceSection's identical fix:
                    // this combines with a per-entry infinite pulse-ring
                    // animation and is unpaginated, so it's the same expensive
                    // animation+filter pattern repeated once per education entry.
                    className="rounded-2xl p-6 md:p-8 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${colors.neutral800}90, ${colors.neutral900}B3)`,
                      border: `1px solid ${isHovered ? `${colors.accent500}40` : `${colors.neutral700}30`}`,
                      boxShadow: isHovered
                        ? `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 48px -16px ${colors.accent500}28, 0 30px 60px -30px rgba(0,0,0,0.8)`
                        : `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.65)`,
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={() => setHoveredId(edu.id ?? null)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {isHovered && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 20% 50%, ${colors.accent500}05 0%, transparent 60%)`,
                        }}
                      />
                    )}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, ${colors.accent500}${isHovered ? "60" : "40"}, transparent 80%)`
                      }}
                    />

                    {/* Year watermark */}
                    <div
                      className="absolute top-4 right-4 font-mono text-2xl font-bold leading-none select-none pointer-events-none"
                      style={{ color: `${colors.accent500}10` }}
                    >
                      {edu.endYear || edu.startYear}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                      <div>
                        <h3
                          className="font-display font-bold"
                          style={{ color: colors.neutral50 }}
                        >
                          {edu.institution}
                        </h3>

                        <p className="text-sm font-mono flex flex-wrap items-center gap-2 mt-1">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                            style={{
                              color: colors.accent400,
                              background: `${colors.accent500}10`,
                              border: `1px solid ${colors.accent500}25`,
                            }}
                          >
                            {getEducationLabel(edu.degree)}
                          </span>
                          <span style={{ color: colors.primary400 }}>
                            {edu.fieldOfStudy}
                          </span>
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
                        className="inline-flex items-center gap-1 text-xs font-mono rounded-full px-3 py-1 mb-2"
                        style={{
                          color: colors.success400,
                          background: `${colors.success500}12`,
                          border: `1px solid ${colors.success500}30`,
                        }}
                      >
                        <FiCheck size={10} />
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(EducationSection);
