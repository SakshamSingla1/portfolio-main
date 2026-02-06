import React, { memo } from "react";
import { useColors, gradients } from "../../utils/theme";
import { type SkillResponse } from "../../utils/types";
import { toTitleCase } from "../../utils/helper";
import { useIsMobile } from "../../hooks/useIsMobile";

interface SkillCardProps {
  skill: SkillResponse;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();

  const level =
    typeof skill.level === "number"
      ? Math.min(100, Math.max(0, skill.level))
      : 70;

  const size = isMobile ? 56 : 62;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative rounded-2xl p-[1px]">
      <div className="absolute inset-0 rounded-2xl opacity-50"
        style={{ background: g.cardBorderGradient }}
      />
      <div className={`relative rounded-2xl flex flex-col items-center ${isMobile ? "p-4 gap-2.5" : "p-5 gap-3"}`}
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <div className="relative">
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.neutral700}
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#skillArc)"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <defs>
              <linearGradient id="skillArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.primary300} />
                <stop offset="25%" stopColor={colors.primary500} />
                <stop offset="50%" stopColor={colors.accent300} />
                <stop offset="75%" stopColor={colors.accent500} />
                <stop offset="100%" stopColor={colors.accent500} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={skill.logoUrl}
              alt={skill.logoName}
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
        <div className="font-medium" style={{ color: colors.neutral50, fontSize: 13 }}>
          {skill.logoName}
        </div>
        <div className="text-sm" style={{ color: colors.accent400 }}>
          {toTitleCase(skill.category)}
        </div>
        <div className="text-[11px]" style={{ color: colors.accent400 }}>
          {level}%
        </div>
      </div>
    </div>
  );
};

export default memo(SkillCard);
