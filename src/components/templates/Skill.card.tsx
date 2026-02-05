import React, { memo } from "react";
import { useColors, gradients } from "../../utils/theme";
import { type SkillResponse } from "../../utils/types";
import { toTitleCase } from "../../utils/helper";

interface SkillCardProps {
  skill: SkillResponse;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <article className="relative group rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100"
           style={{ background: g.cardBorderGradient }} />

      <div className="relative rounded-3xl p-6 flex flex-col gap-4 items-center text-center"
           style={{ backgroundColor: colors.neutral900, boxShadow: g.hoverGlowSoft }}>

        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white">
          <img src={skill.logoUrl} alt={skill.logoName} className="w-14 h-14 rounded-2xl" style={{ background: g.iconGradient }} />
        </div>

        <h3 className="font-semibold" style={{ color: colors.neutral50 }}>
          {skill.logoName}
        </h3>

        <span className="text-xs"
              style={{ color: colors.accent400 }}>
          {toTitleCase(skill.category)}
        </span>

        <span className="text-sm" style={{ color: colors.neutral300 }}>
          Level: {skill.level}
        </span>
      </div>
    </article>
  );
};

export default memo(SkillCard);
