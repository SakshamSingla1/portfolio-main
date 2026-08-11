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
import SafeImage from "../atoms/SafeImage/SafeImage";

interface ExperienceSectionProps {
  experiences: ExperienceResponse[];
}

type Colors = ReturnType<typeof useColors>;

const getEmploymentChipColor = (status: string, colors: Colors): string => {
  const normalized = status.toUpperCase();
  if (normalized === "FULL_TIME") return colors.success400;
  if (normalized === "PART_TIME") return colors.warning400;
  if (normalized === "CONTRACT") return colors.primary400;
  if (normalized === "FREELANCE") return colors.accent400;
  if (normalized === "INTERNSHIP") return "#06b6d4";
  return colors.accent400;
};

interface ExperienceCardProps {
  exp: ExperienceResponse;
  idx: number;
  colors: Colors;
  isMobile: boolean;
}

const ExperienceCard = React.memo(({ exp, idx, colors, isMobile }: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const chipColor = getEmploymentChipColor(exp.employmentStatus, colors);

  return (
    <FadeInView
      delay={idx * 0.12}
      className={`relative ${isMobile ? "pl-0" : "pl-18"}`}
    >

      {!isMobile && (
        <div className="absolute left-0 md:left-2 top-6 bottom-0 flex flex-col items-center gap-1">
          {/* Pulse ring + icon node */}
          <div className="relative w-10 h-10 shrink-0">
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
              style={{ border: `2px solid ${colors.primary500}60` }}
            />
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ border: `2px solid ${colors.primary400}` }}
              />
            )}
            <div
              className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${colors.primary500}30, ${colors.neutral900})`
                  : colors.neutral900,
                border: `1px solid ${isHovered ? colors.primary400 : `${colors.primary500}50`}`,
                boxShadow: isHovered
                  ? `0 0 20px ${colors.primary500}40`
                  : `0 0 10px ${colors.primary500}10`,
              }}
            >
              <FiBriefcase
                style={{ color: isHovered ? colors.primary300 : colors.primary400 }}
                className="text-lg relative z-10"
              />
            </div>
          </div>
          {/* Step number below node */}
          <span
            className="font-mono text-[10px] font-bold leading-none"
            style={{ color: `${colors.primary500}50` }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
        </div>
      )}

      {isMobile && (
        <div className="mb-2 text-xs font-mono" style={{ color: colors.primary400 }}>
          {formatDate(exp.startDate)}{exp.endDate ? ` — ${formatDate(exp.endDate)}` : ""}
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
            {formatDate(exp.startDate)}{exp.endDate ? ` — ${formatDate(exp.endDate)}` : ""}
          </span>
        </div>
      )}

      <div
        // No backdrop-blur: this card also has an infinite pulse-ring animation
        // running the entire time the page is open (see above), and it's
        // rendered once per experience entry with no pagination — combining a
        // live-sampled blur with a perpetual animation on every card is the
        // single most expensive pattern on the page. A slightly more opaque
        // background keeps the tinted-glass look without the live blur.
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${colors.neutral800}90, ${colors.neutral900}B3)`,
          border: `1px solid ${isHovered ? `${colors.primary500}45` : `${colors.neutral700}30`}`,
          boxShadow: isHovered
            ? `0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 48px -16px ${colors.primary500}30, 0 30px 60px -30px rgba(0,0,0,0.8)`
            : `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.65)`,
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${colors.primary500}05 0%, transparent 60%)`,
            }}
          />
        )}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, ${colors.primary500}${isHovered ? "70" : "50"}, transparent 80%)`
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
              className="font-semibold text-sm"
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
                color: chipColor,
                background: `${chipColor}15`,
                border: `1px solid ${chipColor}30`,
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
                className="inline-flex items-center gap-1.5 text-xs font-mono rounded-full px-2.5 py-1 transition-all duration-200"
                style={{
                  color: colors.neutral300,
                  background: `${colors.neutral700}35`,
                  border: `1px solid ${colors.neutral600}25`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.primary500}12`;
                  e.currentTarget.style.borderColor = `${colors.primary500}30`;
                  e.currentTarget.style.color = colors.neutral100;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${colors.neutral700}35`;
                  e.currentTarget.style.borderColor = `${colors.neutral600}25`;
                  e.currentTarget.style.color = colors.neutral300;
                }}
              >
                <SafeImage
                  src={getOptimizedImageUrl(skill.logoUrl, { width: 60 })}
                  alt={skill.logoName}
                  className="w-3.5 h-3.5"
                  fallbackClassName="w-3.5 h-3.5 rounded-sm"
                  iconSize={8}
                  loading="lazy"
                />
                {skill.logoName}
              </span>
            ))}
          </div>
        )}
      </div>
    </FadeInView>
  );
});

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

        <div className="relative max-w-4xl mx-auto">

          {!isMobile && (
            <>
              {/* Timeline track */}
              <div
                className="absolute left-5 md:left-7 top-0 bottom-0 w-[2px]"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary500}90, ${colors.primary500}30, transparent)`,
                }}
              />
              {/* Outer glow behind track */}
              <div
                className="absolute left-4 md:left-6 top-0 bottom-0 w-4 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary500}12, transparent 60%)`,
                  filter: "blur(6px)",
                }}
              />
              {/* Comet: bright head + long fading tail */}
              <motion.div
                className="absolute left-5 md:left-7 w-[2px] pointer-events-none"
                animate={{ top: ["-15%", "110%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1.75 }}
              >
                {/* tail */}
                <div
                  className="w-full"
                  style={{
                    height: 64,
                    background: `linear-gradient(to bottom, transparent, ${colors.primary400}80)`,
                  }}
                />
                {/* head */}
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colors.primary300,
                    boxShadow: `0 0 8px 3px ${colors.primary400}90`,
                    marginLeft: -2,
                  }}
                />
              </motion.div>
            </>
          )}

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                idx={idx}
                colors={colors}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ExperienceSection);
