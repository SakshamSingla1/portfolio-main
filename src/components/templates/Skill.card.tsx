import React, { memo, useEffect, useId, useState } from "react";
import { useColors, gradients } from "../../utils/theme";
import { type SkillResponse } from "../../utils/types";
import { toTitleCase } from "../../utils/helper";
import { useIsMobile } from "../../hooks/useIsMobile";

interface SkillCardProps {
  skill: SkillResponse;
}

export const SKILL_LEVEL_PERCENT: Record<string, number> = {
  Beginner: 40,
  Intermediate: 70,
  Advanced: 90,
  Expert: 100,
};

export const getSkillLevelPercent = (level?: string): number => {
  if (!level) return SKILL_LEVEL_PERCENT.Beginner;
  return SKILL_LEVEL_PERCENT[level] ?? SKILL_LEVEL_PERCENT.Beginner;
};

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const gradientId = useId();

  const targetLevel = getSkillLevelPercent(skill.level);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLevel(targetLevel);
    }, 150);
    return () => clearTimeout(timer);
  }, [targetLevel]);

  const size = isMobile ? 58 : 70;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  const getLevelLabel = () => {
    if (targetLevel === 100) return "Expert";
    if (targetLevel >= 90) return "Advanced";
    if (targetLevel >= 70) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:scale-105">
      <div
        className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition"
        style={{ background: g.cardBorderGradient }}
      />
      <div
        className={`relative rounded-2xl flex flex-col items-center text-center ${
          isMobile ? "p-4 gap-2.5" : "p-6 gap-3"
        }`}
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
              stroke={`url(#${gradientId})`}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: "stroke-dashoffset 1.2s ease-in-out",
              }}
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.primary300} />
                <stop offset="40%" stopColor={colors.primary500} />
                <stop offset="70%" stopColor={colors.accent300} />
                <stop offset="100%" stopColor={colors.accent500} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={skill.logoUrl}
              alt={skill.logoName}
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        <div
          className="font-semibold tracking-wide"
          style={{ color: colors.neutral50, fontSize: 14 }}
        >
          {skill.logoName}
        </div>

        <div
          className="text-xs opacity-80"
          style={{ color: colors.accent400 }}
        >
          {toTitleCase(skill.category)}
        </div>

        <div
          className="px-3 py-1 text-[11px] rounded-full font-medium mt-1"
          style={{
            background: colors.primary900,
            color: colors.primary300,
            border: `1px solid ${colors.primary700}`,
          }}
        >
          {getLevelLabel()} • {targetLevel}%
        </div>
      </div>
    </div>
  );
};

export default memo(SkillCard);
