import React, { memo, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiChevronDown,
  FiLayers,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { sanitizeHtml, toTitleCase } from "../../utils/helper";
import { type ExperienceResponse } from "../../utils/types";

interface ExperienceCardProps {
  experience: ExperienceResponse;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const colors = useColors();
  const g = gradients(colors);
  const [open, setOpen] = useState(false);

  const durationText = useMemo(
    () =>
      experience.endDate
        ? `${experience.startDate} – ${experience.endDate}`
        : `${experience.startDate} – Present`,
    [experience.startDate, experience.endDate]
  );

  return (
    <article className="relative group rounded-3xl p-[1px]">
      <div
        className="absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: g.cardBorderGradient }}
      />

      <div
        className="
          relative flex flex-col gap-6
          rounded-3xl p-7
          transition-all duration-500
          group-hover:-translate-y-1
        "
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <header className="flex gap-5">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl shrink-0 text-white"
            style={{ background: g.iconGradient }}
          >
            <FiBriefcase size={24} />
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="text-xl font-semibold tracking-tight leading-snug"
              style={{ color: colors.neutral50 }}
            >
              {experience.jobTitle}
            </h2>

            <span
              className="text-sm font-medium"
              style={{ color: colors.accent300 }}
            >
              {experience.companyName}
            </span>

            <span className="text-sm" style={{ color: colors.neutral400 }}>
              {toTitleCase(experience.employmentStatus)}
            </span>
          </div>
        </header>

        <div className="h-px w-full" style={{ background: g.dividerGradient }} />

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex items-center gap-2 text-sm">
            <FiCalendar size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>
              {durationText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FiMapPin size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>
              {experience.location}
            </span>
          </div>

          {experience.skills?.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <FiLayers size={14} style={{ color: colors.accent400 }} />
              <div  className="flex items-center gap-2">
                {experience.skills.map(skill => {
                  return <div key={skill.logoName}><img src={skill.logoUrl} alt={skill.logoName} className="w-8 h-8"/></div>;
                })}
              </div>
            </div>
          )}
        </div>

        {experience.description && (
          <section className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="flex items-center justify-between"
            >
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: colors.accent400 }}
              >
                Responsibilities & Impact
              </span>

              <FiChevronDown
                size={18}
                className={`transition-transform duration-500 ${
                  open ? "rotate-180 translate-y-0.5" : ""
                }`}
                style={{ color: colors.accent400 }}
              />
            </button>

            <div
              className="transition-all duration-500 ease-out overflow-hidden"
              style={{
                maxHeight: open ? "360px" : "0px",
                opacity: open ? 1 : 0,
              }}
            >
              <div
                className="text-sm leading-relaxed rounded-2xl p-5 mt-2"
                style={{
                  backgroundColor: colors.neutral800,
                  border: `1px solid ${colors.accent500}33`,
                  color: colors.neutral200,
                  boxShadow: g.hoverGlowInset,
                }}
              >
                {sanitizeHtml(experience.description)}
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default memo(ExperienceCard);
