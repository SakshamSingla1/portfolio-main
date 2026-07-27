import { motion } from "framer-motion";
import { useColors } from "../../../utils/theme";
import type { SkillResponse } from "../../../utils/types";
import { getOptimizedImageUrl } from "../../../utils/helper";

interface SkillsAutoScrollBarProps {
  skills: SkillResponse[];
}

export const SkillsAutoScrollBar = ({ skills }: SkillsAutoScrollBarProps) => {
  const colors = useColors();

  const repeatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative w-full overflow-hidden py-6 mb-8">
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32"
        style={{
          background: `linear-gradient(to right, ${colors.neutral900}, transparent)`,
        }}
      />

      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32"
        style={{
          background: `linear-gradient(to left, ${colors.neutral900}, transparent)`,
        }}
      />

      <motion.div
        className="flex w-max gap-4 px-4"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedSkills.map((skill, index) => (
          <motion.div
            key={`${skill.id}-${index}`}
            className="group flex min-w-[200px] items-center gap-4 rounded-2xl border px-6 py-5 backdrop-blur-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.neutral100}12, ${colors.neutral100}05)`,
              borderColor: `${colors.neutral100}15`,
              boxShadow: `0 15px 35px -15px rgba(0, 0, 0, 0.3)`,
            }}
          >
            <img
              src={getOptimizedImageUrl(skill.logoUrl, { width: 80 })}
              alt={skill.logoName}
              className="h-8 w-8 object-contain transition-transform duration-300"
              loading="lazy"
              width={32}
              height={32}
            />
            <p
              className="truncate text-sm font-semibold tracking-tight"
              style={{ color: colors.neutral100 }}
            >
              {skill.logoName}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsAutoScrollBar;
