import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
  colors: any;
}

export const AnimatedCounter = ({ end, suffix = "", duration = 2, colors }: Props) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [hasAnimated, end, duration]);

  return (
    <motion.span
      onViewportEnter={() => setHasAnimated(true)}
      viewport={{ once: true }}
      className="font-display text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
      style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary500}, ${colors.accent500})` }}
    >
      {count}{suffix}
    </motion.span>
  );
};
