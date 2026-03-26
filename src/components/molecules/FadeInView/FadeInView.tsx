import { motion } from "framer-motion";
import type { ReactNode } from "react";
import React from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const FadeInView = ({ children, className = "", delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default React.memo(FadeInView);
