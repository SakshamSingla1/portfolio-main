import React, { memo, useMemo } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiLayers,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { sanitizeHtml, toTitleCase } from "../../utils/helper";
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

  const durationText = useMemo(
    () =>
      experience.endDate
        ? `${experience.startDate} – ${experience.endDate}`
        : `${experience.startDate} – Present`,
    [experience.startDate, experience.endDate]
  );

  return (
    <div className="relative rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }} />
      <div className={`relative rounded-3xl flex flex-col ${ isMobile ? "p-6 gap-5" : "p-7 gap-6"}`}
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <div className="flex gap-5 items-start">
          <div className={`shrink-0 flex items-center justify-center rounded-2xl ${ isMobile ? "w-12 h-12" : "w-16 h-16" }`}
            style={{
              background: g.iconGradient,
              color: colors.neutral50,
            }}
          >
            <FiBriefcase size={isMobile ? 20 : 24} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="font-semibold"
              style={{
                color: colors.neutral50,
                fontSize: isMobile ? 16 : 20,
              }}
            >
              {experience.jobTitle}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.accent300 }}>
              {experience.companyName}
            </div>
            <div className="text-sm" style={{ color: colors.neutral400 }}>
              {toTitleCase(experience.employmentStatus)}
            </div>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: g.dividerGradient }}/>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>{durationText}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>
              {experience.location}
            </span>
          </div>
        </div>
        {experience.skills?.length > 0 && (
          <div className="flex items-center gap-3">
            <FiLayers size={16} style={{ color: colors.accent400 }} />
            <div className="flex flex-wrap gap-2">
              {experience.skills.map(skill => (
                <div key={skill.logoName} className=" flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: colors.neutral800,
                    color: colors.neutral200,
                    border: `1px solid ${colors.accent500}33`,
                  }}
                >
                  <img src={skill.logoUrl} alt={skill.logoName} className="h-4 w-4"/>
                  {skill.logoName}
                </div>
              ))}
            </div>
          </div>
        )}
        {experience.description && (
          <div className="rounded-2xl p-4 text-sm"
            style={{
              backgroundColor: colors.neutral800,
              border: `1px solid ${colors.accent500}22`,
              color: colors.neutral200,
            }}
          >
            <ReadMoreText
              text={experience.description}
              limit={200}
              mobileLimit={130}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExperienceCard);
