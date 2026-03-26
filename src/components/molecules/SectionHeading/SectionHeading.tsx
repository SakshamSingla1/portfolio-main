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
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[5rem] md:text-[7rem] font-bold whitespace-nowrap pointer-events-none select-none"
        style={{ color: `${colors.neutral700}06` }}
      >
        {title}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block relative"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] block mb-3" style={{ color: `${colors.primary400}60` }}>
          {"// " + title.toLowerCase().replace(/\s/g, "_")}
        </span>
        <h2
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(135deg, ${colors.neutral100}, ${colors.primary400})` }}
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
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="w-16 h-[2px] mx-auto mt-6 origin-center rounded-full"
        style={{ background: `linear-gradient(90deg, ${colors.primary500}, ${colors.accent500})` }}
      />
    </div>
  );
};

export default React.memo(SectionHeading);
