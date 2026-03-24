import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { Testimonial } from "../../utils/types";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface Props {
  testimonials: Testimonial[];
}

export const TestimonialsSection = ({ testimonials }: Props) => {
  const colors = useColors();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="section-container">
      <SectionHeading title="Testimonials" subtitle="Kind words from people I've worked with" />

      <div className="max-w-3xl mx-auto">
        <div className="glass-card-premium p-8 md:p-10 relative">
          <div className="absolute top-6 right-6 opacity-10">
            <Quote className="w-12 h-12" style={{ color: colors.primary400 }} />
          </div>

          {/* Stars */}
          <div className="flex gap-0.5 mb-6">
            {[...Array(5)].map((_, s) => (
              <Star key={s} className="w-4 h-4" style={{ fill: colors.warning400, color: colors.warning400 }} />
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
                  text={testimonials[active].message || ""}
                  limit={100}
                  mobileLimit={50}
                  className="italic text-sm leading-relaxed border-l-4 pl-4"
                />
              </div>
              <div className="flex items-center gap-4">
                {testimonials[active].imageUrl && (
                  <div className="relative">
                    <img
                      src={testimonials[active].imageUrl}
                      alt={testimonials[active].name}
                      className="w-12 h-12 rounded-full object-cover"
                      style={{ border: `2px solid ${colors.primary500}26` }}
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary500, border: `2px solid hsl(var(--background))` }}
                    >
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-display font-semibold text-sm" style={{ color: colors.neutral100 }}>{testimonials[active].name}</p>
                  <p className="text-xs" style={{ color: `${colors.neutral500}CC` }}>
                    {testimonials[active].role} at{" "}
                    <span style={{ color: `${colors.primary400}99` }}>{testimonials[active].company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-5" style={{ borderTop: `1px solid ${colors.neutral700}20` }}>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: idx === active ? "1.5rem" : "0.5rem",
                      backgroundColor: idx === active ? colors.primary400 : `${colors.neutral600}60`,
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ border: `1px solid ${colors.neutral700}33`, color: colors.neutral400 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActive((a) => (a + 1) % testimonials.length)}
                  className="p-1.5 rounded-lg transition-all hover:scale-110"
                  style={{ border: `1px solid ${colors.neutral700}33`, color: colors.neutral400 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.1 }}
              className="rounded-full transition-all duration-400 overflow-hidden"
              style={{
                width: i === active ? "2.75rem" : "2.25rem",
                height: i === active ? "2.75rem" : "2.25rem",
                border: i === active ? `2px solid ${colors.primary400}` : `2px solid ${colors.neutral700}50`,
                opacity: i === active ? 1 : 0.5,
              }}
            >
              <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};