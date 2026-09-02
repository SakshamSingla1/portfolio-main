import React, { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { FaBriefcase } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { Testimonial } from "../../utils/types";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { getOptimizedImageUrl } from "../../utils/helper";
import SafeImage from "../atoms/SafeImage/SafeImage";

interface Props {
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: Props) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!testimonials.length || isPaused) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  if (!testimonials.length) return null;

  const current = testimonials[active];

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Testimonials" subtitle="Kind words from people I've worked with" />

        <div className="max-w-4xl mx-auto">
        <div
          className="relative overflow-hidden backdrop-blur-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          style={{
            background: `linear-gradient(135deg, ${colors.neutral800}70, ${colors.neutral900}90)`,
            border: `1px solid ${colors.neutral700}40`,
            borderRadius: 20,
            padding: isMobile ? '1.25rem 1rem' : '2rem 2rem',
            boxShadow: `0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(0,0,0,0.75)`,
          }}
        >
          {/* Ambient glow that shifts with active index */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-40%",
              left: `${(active / Math.max(testimonials.length - 1, 1)) * 80}%`,
              transform: "translateX(-50%)",
              width: "60%",
              height: "200%",
              background: `radial-gradient(ellipse at center, ${colors.primary500}08 0%, transparent 65%)`,
              transition: "left 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              zIndex: 0,
            }}
          />

          <div
            className="absolute top-4 right-5 font-mono text-xs select-none"
            style={{ color: colors.neutral600, zIndex: 1 }}
          >
            {active + 1} / {testimonials.length}
          </div>

          <div className="absolute -top-2 -right-2 opacity-15" style={{ zIndex: 1 }}>
            <Quote className="w-12 h-12" style={{ color: colors.primary400 }} />
          </div>
          <div className="absolute -bottom-2 -left-2 opacity-10 rotate-180" style={{ zIndex: 1 }}>
            <Quote className="w-10 h-10" style={{ color: colors.primary400 }} />
          </div>

          <div className="flex gap-1 mb-6 relative" style={{ zIndex: 1 }}>
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
              style={{ position: "relative", zIndex: 1 }}
              role="group"
              aria-live="polite"
              aria-label={`Testimonial ${active + 1} of ${testimonials.length}, from ${current.name}`}
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
                    <SafeImage
                      src={getOptimizedImageUrl(current.imageUrl, { width: 100, height: 100 })}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover"
                      fallbackClassName="w-12 h-12 rounded-full"
                      iconSize={16}
                      style={{ border: `2px solid ${colors.primary500}50`, boxShadow: `0 0 16px ${colors.primary500}20` }}
                      loading="lazy"
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary500,
                        border: `2px solid ${colors.neutral900}`,
                      }}
                    >
                      <span className="text-[8px] text-white font-bold">✓</span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-sm" style={{ color: colors.neutral100 }}>
                      {current.name}
                    </p>
                    {current.linkedInUrl && (
                      <a
                        href={current.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-lg transition-all duration-200"
                        style={{
                          width: 28,
                          height: 28,
                          background: `${colors.primary500}15`,
                          color: "#0077B5",
                          border: `1px solid ${colors.primary500}20`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${colors.primary500}25`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${colors.primary500}15`;
                        }}
                      >
                        <FaLinkedin size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: `${colors.neutral500}CC` }}>
                    {current.role} at{" "}
                    <span style={{ color: `${colors.primary400}99` }}>{current.company}</span>
                  </p>
                  {current.company && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-xs"
                      style={{
                        background: `${colors.neutral700}30`,
                        border: `1px solid ${colors.neutral700}50`,
                        color: colors.neutral400,
                      }}
                    >
                      <FaBriefcase size={10} />
                      {current.company}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div
              className="flex items-center justify-between mt-8 pt-5"
              style={{ borderTop: `1px solid ${colors.neutral700}20`, position: "relative", zIndex: 1 }}
            >
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={idx === active}
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
                  aria-label="Previous testimonial"
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
                  aria-label="Next testimonial"
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

        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mt-6">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === active}
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
              {t.imageUrl && <SafeImage src={getOptimizedImageUrl(t.imageUrl, { width: 100, height: 100 })} alt={t.name} className="w-full h-full object-cover" fallbackClassName="w-full h-full" iconSize={14} loading="lazy" />}
            </motion.button>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);
