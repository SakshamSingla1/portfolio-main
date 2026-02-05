import React, { memo, useMemo, useState } from "react";
import {
  FiAward,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Achievement } from "../../utils/types";
import { sanitizeHtml } from "../../utils/helper";
import { CustomAccordion } from "../atoms/CustomAccordian/CustomAccordian";

interface AchievementProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementProps> = ({ achievement }) => {
  const colors = useColors();
  const g = gradients(colors);

  /** Accordion state */
  const [expanded, setExpanded] = useState<number[]>([]);

  const issuedAt = useMemo(
    () =>
      achievement.achievedAt
        ? new Date(achievement.achievedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    [achievement.achievedAt]
  );

  return (
    <article className="relative group rounded-3xl p-[1px]">
      {/* gradient border */}
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
        {/* Header */}
        <header className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 text-white"
            style={{ background: g.iconGradient }}
          >
            <FiAward size={22} />
          </div>

          <h2
            className="text-lg font-semibold tracking-tight leading-snug"
            style={{ color: colors.neutral50 }}
          >
            {achievement.title}
          </h2>
        </header>

        <div className="h-px w-full" style={{ background: g.dividerGradient }} />

        {/* Meta */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: colors.neutral400 }}
            >
              Issued by
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: colors.neutral200 }}
            >
              {achievement.issuer}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FiCalendar size={14} style={{ color: colors.accent400 }} />
            <span style={{ color: colors.neutral200 }}>{issuedAt}</span>
          </div>
        </div>

        {/* Description Accordion */}
        {achievement.description && (
          <CustomAccordion
            index={0}
            expanded={expanded}
            onChange={(idx) =>
              setExpanded((prev) =>
                prev.includes(idx)
                  ? prev.filter((i) => i !== idx)
                  : [idx]
              )
            }
            heading="Description"
            showStatus={false}
            component={
              <div
                className="rounded-2xl p-5 text-sm leading-relaxed"
                style={{
                  backgroundColor: colors.neutral800,
                  border: `1px solid ${colors.accent500}33`,
                  color: colors.neutral200,
                  boxShadow: g.hoverGlowInset,
                }}
              >
                {sanitizeHtml(achievement.description)}
              </div>
            }
          />
        )}

        {/* Proof */}
        {achievement.proofUrl && (
          <footer className="mt-auto pt-4">
            <a
              href={achievement.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                text-sm font-medium
                transition-all duration-300
                hover:translate-x-0.5
              "
              style={{ color: colors.accent400 }}
            >
              View credential
              <FiExternalLink size={14} />
            </a>
          </footer>
        )}
      </div>
    </article>
  );
};

export default memo(AchievementCard);
