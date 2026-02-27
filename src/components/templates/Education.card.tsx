import React, { memo, useMemo } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiMapPin,
  FiAward,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { getEducationLabel, normalizePercentage } from "../../utils/helper";
import { type Education } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();

  const durationText = useMemo(
    () =>
      education.endYear
        ? `${education.startYear} – ${education.endYear}`
        : `${education.startYear} – Present`,
    [education.startYear, education.endYear]
  );

  return (
    <div className="relative rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }} />
      <div className={`relative rounded-3xl flex flex-col ${ isMobile ? "p-6 gap-5" : "p-7 gap-6" }`}
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <div className="flex gap-5 items-start">
          <div className={`shrink-0 flex items-center justify-center rounded-2xl ${ isMobile ? "w-12 h-12" : "w-16 h-16" }`}
            style={{
              background: g.iconGradient,
              boxShadow: g.hoverGlowInset,
              color: colors.neutral50,
            }}
          >
            <FiBookOpen size={isMobile ? 20 : 24} />
          </div>
          <div className="flex flex-col gap-1">
            <div
              className="font-semibold leading-snug"
              style={{
                color: colors.neutral50,
                fontSize: isMobile ? 16 : 20,
              }}
            >
              {getEducationLabel(education.degree)}
            </div>
            <div className="text-sm font-medium" style={{ color: colors.accent300 }}>
              {education.fieldOfStudy}
            </div>
            <div className="text-sm" style={{ color: colors.neutral400 }}>
              {education.institution}
            </div>
          </div>
        </div>
        <div className="h-px w-full" style={{ background: g.dividerGradient }} />
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>{durationText}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>
              {education.location}
            </span>
          </div>
          {education.grade && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                border: `1px solid ${colors.accent500}`,
                color: colors.accent500,
              }}
            >
              <FiAward size={13} />
              {normalizePercentage(education.grade)}
            </div>
          )}
        </div>
        {education.description && (
          <div>
            <div className="text-sm font-normal mb-2" style={{ color: colors.accent400 }}>
              Academic Impact & Learnings
            </div>
            <div
              className="rounded-2xl p-4 text-sm leading-relaxed"
              style={{
                backgroundColor: colors.neutral800,
                border: `1px solid ${colors.accent500}22`,
                color: colors.neutral200,
              }}
            >
              <ReadMoreText
                text={education.description}
                limit={160}
                mobileLimit={110}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EducationCard);
