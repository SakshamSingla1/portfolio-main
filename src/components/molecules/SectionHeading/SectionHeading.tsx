import { motion } from "framer-motion";
import { useColors } from "../../../utils/theme";
import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: Props) => {
  const colors = useColors();

  return (
    <div className="mb-16 md:mb-20 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block relative"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[6rem] md:text-[9rem] font-bold whitespace-nowrap pointer-events-none select-none -z-10"
          style={{ color: `${colors.neutral700}12` }}
        >
          {title}
        </div>

        <span
          className="inline-flex items-center gap-2 mb-4 rounded-full text-[10px] font-mono uppercase"
          style={{
            color: colors.primary300,
            letterSpacing: "0.3em",
            padding: "6px 14px 6px 10px",
            background: `${colors.primary500}14`,
            border: `1px solid ${colors.primary500}30`,
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 5, height: 5, background: colors.accent400 }}
          />
          {title.toLowerCase().replace(/\s/g, "_")}
        </span>

        <h2
          className="section-heading-gradient-text font-display text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent relative"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.neutral100}, ${colors.primary400}, ${colors.accent400}, ${colors.neutral100})`,
            backgroundSize: "300% 300%",
            filter: `drop-shadow(0 0 24px ${colors.primary500}25)`,
          }}
        >
          {title}
        </h2>
      </motion.div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 max-w-xl mx-auto text-sm md:text-base"
          style={{ color: `${colors.neutral400}CC` }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative side lines + glowing underline */}
      <div className="hidden md:flex items-center gap-6 mt-6 justify-center">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-px flex-1 max-w-24 origin-right"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary500}40)`,
          }}
        />

        {/* Glowing underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative origin-center"
          style={{ width: 80, height: 3 }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 99,
              filter: "blur(6px)",
              background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
              opacity: 0.6,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-px flex-1 max-w-24 origin-left"
          style={{
            background: `linear-gradient(90deg, ${colors.primary500}40, transparent)`,
          }}
        />
      </div>

      {/* Mobile fallback underline (no side lines) */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden relative mx-auto mt-6 origin-center"
        style={{ width: 80, height: 3 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 99,
            filter: "blur(6px)",
            background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})`,
            opacity: 0.6,
          }}
        />
      </motion.div>
    </div>
  );
};

export default React.memo(SectionHeading);
