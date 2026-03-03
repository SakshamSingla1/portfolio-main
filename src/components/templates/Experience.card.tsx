import React, { memo, useMemo, useState, useEffect } from "react";
import { FiBriefcase, FiCalendar, FiMapPin, FiLayers } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { toTitleCase } from "../../utils/helper";
import { type ExperienceResponse } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface ExperienceCardProps {
  experience: ExperienceResponse;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const [openSkillDialog, setOpenSkillDialog] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const durationText = useMemo(() => {
    const start = formatDate(experience.startDate);
    const end = experience.endDate ? formatDate(experience.endDate) : "Present";
    return `${start} – ${end}`;
  }, [experience.startDate, experience.endDate]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSkillDialog(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const MAX_VISIBLE_SKILLS = 3;
  const visibleSkills = experience.skills?.slice(0, MAX_VISIBLE_SKILLS) || [];
  const remainingSkills = experience.skills?.slice(MAX_VISIBLE_SKILLS) || [];

  return (
    <div className="relative rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div
        className="absolute inset-0 rounded-3xl opacity-60"
        style={{ background: g.cardBorderGradient }}
      />

      <div
        className={`relative rounded-3xl flex flex-col ${
          isMobile ? "p-7 gap-6" : "p-8 gap-7"
        }`}
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <div className="flex gap-6 items-start">
          <div
            className={`shrink-0 flex items-center justify-center rounded-2xl ${
              isMobile ? "w-14 h-14" : "w-16 h-16"
            }`}
            style={{
              background: g.iconGradient,
              color: colors.neutral50,
            }}
          >
            <FiBriefcase size={24} />
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="font-semibold tracking-tight"
              style={{
                color: colors.neutral50,
                fontSize: isMobile ? 18 : 22,
              }}
            >
              {experience.jobTitle}
            </div>

            <div
              className="text-lg font-medium"
              style={{ color: colors.accent300 }}
            >
              {experience.companyName}
            </div>

            <div
              className="text-sm opacity-80"
              style={{ color: colors.neutral400 }}
            >
              {toTitleCase(experience.employmentStatus)}
            </div>
          </div>
        </div>

        <div className="h-px w-full" style={{ background: g.dividerGradient }} />

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
          <div className="flex items-center gap-2">
            <FiCalendar size={16} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>{durationText}</span>
          </div>

          <div className="flex items-center gap-2">
            <FiMapPin size={16} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>
              {experience.location}
            </span>
          </div>
        </div>

        {experience.skills?.length > 0 && (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              <FiLayers size={18} style={{ color: colors.accent400 }} />

              <div className="flex flex-wrap gap-3">
                {visibleSkills.map(skill => (
                  <div
                    key={skill.logoName}
                    className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-transform duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${colors.neutral800}CC`,
                      backdropFilter: "blur(6px)",
                      color: colors.neutral200,
                      border: `1px solid ${colors.accent500}33`,
                    }}
                  >
                    <img
                      src={skill.logoUrl}
                      alt={skill.logoName}
                      className="h-4 w-4"
                    />
                    {skill.logoName}
                  </div>
                ))}

                {remainingSkills.length > 0 && (
                  <button
                    onClick={() => setOpenSkillDialog(true)}
                    className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.neutral800}CC`,
                      backdropFilter: "blur(6px)",
                      color: colors.neutral200,
                      border: `1px solid ${colors.accent500}33`,
                    }}
                  >
                    +{remainingSkills.length} more
                  </button>
                )}
              </div>
            </div>

            {openSkillDialog && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                onClick={() => setOpenSkillDialog(false)}
              >
                <div
                  className="relative rounded-3xl p-6 w-80 max-w-full"
                  style={{
                    backgroundColor: colors.neutral900,
                    border: `1px solid ${colors.neutral700}`,
                    boxShadow: g.hoverGlowMedium,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setOpenSkillDialog(false)}
                    className="absolute top-3 right-3 px-3.5 py-2 rounded-full hover:opacity-80"
                    style={{
                      background: g.ctaGradient,
                      color: colors.neutral50,
                    }}
                  >
                    ✕
                  </button>

                  <h3
                    className="text-sm font-semibold mb-4"
                    style={{ color: colors.neutral50 }}
                  >
                    More Skills
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {remainingSkills.map(skill => (
                      <div
                        key={skill.logoName}
                        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                        style={{
                          backgroundColor: `${colors.neutral800}CC`,
                          backdropFilter: "blur(6px)",
                          color: colors.neutral200,
                          border: `1px solid ${colors.accent500}33`,
                        }}
                      >
                        <img
                          src={skill.logoUrl}
                          alt={skill.logoName}
                          className="h-4 w-4"
                        />
                        {skill.logoName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {experience.description && (
          <div
            className="rounded-2xl p-5 text-[15px] md:text-[16px] leading-relaxed"
            style={{
              backgroundColor: `${colors.neutral800}CC`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${colors.accent500}22`,
              color: colors.neutral200,
            }}
          >
            <ReadMoreText
              text={experience.description}
              limit={220}
              mobileLimit={160}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExperienceCard);