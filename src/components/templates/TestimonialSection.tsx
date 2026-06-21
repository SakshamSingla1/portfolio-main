import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { Testimonial } from "../../utils/types";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { getOptimizedImageUrl } from "../../utils/helper";

interface Props {
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: Props) => {
  const colors = useColors();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  const current = testimonials[active];

  return (
    <section id="testimonials" className="section-container pt-0!">
      <SectionHeading title="Testimonials" subtitle="Kind words from people I've worked with" />

      <div className="max-w-7xl mx-auto">
        <div
          className="glass-card-premium relative"
          style={{
            background: `linear-gradient(135deg, ${colors.neutral800}70, ${colors.neutral900}90)`,
            border: `1px solid ${colors.neutral700}40`,
            borderRadius: 20,
            padding: '2rem 2rem',
          }}
        >
          <div className="absolute -top-2 -right-2 opacity-15">
            <Quote className="w-12 h-12" style={{ color: colors.primary400 }} />
          </div>
          <div className="absolute -bottom-2 -left-2 opacity-10 rotate-180">
            <Quote className="w-10 h-10" style={{ color: colors.primary400 }} />
          </div>

          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, s) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: s * 0.07, type: "spring", stiffness: 400, damping: 18 }}
              >
                <Star
                  className="w-4 h-4"
                  style={{
                    fill: colors.warning400,
                    color: colors.warning400,
                    filter: `drop-shadow(0 0 6px ${colors.warning400}60)`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="text-lg md:text-xl leading-relaxed mb-8 italic font-light flex items-center"
                style={{ color: `${colors.neutral300}E6` }}
              >
                <ReadMoreText
                  text={current.message || ""}
                  limit={200}
                  mobileLimit={100}
                  className="italic text-sm leading-relaxed border-l-4 pl-4"
                />
              </div>

              <div className="flex items-center gap-4">
                {current.imageUrl && (
                  <div className="relative">
                    <img
                      src={getOptimizedImageUrl(current.imageUrl, { width: 100, height: 100 })}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover"
                      style={{ border: `2px solid ${colors.primary500}50`, boxShadow: `0 0 16px ${colors.primary500}20` }}
                      loading="lazy"
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary500,
                        border: `2px solid hsl(var(--background))`,
                      }}
                    >
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-display font-semibold text-sm" style={{ color: colors.neutral100 }}>
                    {current.name}
                  </p>
                  <p className="text-xs" style={{ color: `${colors.neutral500}CC` }}>
                    {current.role} at{" "}
                    <span style={{ color: `${colors.primary400}99` }}>{current.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div
              className="flex items-center justify-between mt-8 pt-5"
              style={{ borderTop: `1px solid ${colors.neutral700}20` }}
            >
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: idx === active ? "1.5rem" : "0.5rem",
                      backgroundColor:
                        idx === active ? colors.primary400 : `${colors.neutral600}60`,
                      boxShadow: idx === active ? `0 0 8px ${colors.primary400}60` : undefined,
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() =>
                    setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
                  }
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{
                    border: `1px solid ${colors.neutral700}33`,
                    color: colors.neutral400,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActive((a) => (a + 1) % testimonials.length)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{
                    border: `1px solid ${colors.neutral700}33`,
                    color: colors.neutral400,
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.12 }}
              className="rounded-full overflow-hidden relative"
              style={{
                width: i === active ? "3rem" : "2.25rem",
                height: i === active ? "3rem" : "2.25rem",
                border:
                  i === active
                    ? `2px solid ${colors.primary400}`
                    : `2px solid ${colors.neutral700}50`,
                opacity: i === active ? 1 : 0.45,
                boxShadow: i === active ? `0 0 16px ${colors.primary500}40` : undefined,
                transition: "all 0.35s ease",
              }}
            >
              <img src={getOptimizedImageUrl(t.imageUrl, { width: 100, height: 100 })} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);