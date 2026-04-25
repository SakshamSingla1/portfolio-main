import { motion } from "framer-motion";
import { useColors } from "../../../utils/theme";
import type { SkillResponse } from "../../../utils/types";

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
            whileHover={{
              y: -6,
              scale: 1.05,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="group flex min-w-[200px] items-center gap-4 rounded-2xl border px-6 py-5 backdrop-blur-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.neutral800}AA, ${colors.neutral900}EE)`,
              borderColor: `${colors.primary400}20`,
              boxShadow: `0 20px 50px -20px ${colors.primary500}30`,
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:rotate-6 group-hover:shadow-lg"
              style={{
                backgroundColor: `${colors.primary500}10`,
                borderColor: `${colors.primary400}20`,
                boxShadow: `0 0 20px ${colors.primary500}10`,
              }}
            >
              <img
                src={skill.logoUrl}
                alt={skill.logoName}
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold tracking-tight"
                style={{ color: colors.neutral100 }}
              >
                {skill.logoName}
              </p>

              <p
                className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-80"
                style={{ color: colors.primary400 }}
              >
                {skill.level}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsAutoScrollBar;
