import React, { memo, useMemo } from "react";
import { FiCalendar, FiExternalLink } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Testimonial } from "../../utils/types";
import { sanitizeHtml } from "../../utils/helper";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { useIsMobile } from "../../hooks/useIsMobile";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();

  const formattedDate = useMemo(
    () =>
      testimonial.createdAt
        ? new Date(testimonial.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : null,
    [testimonial.createdAt]
  );

  return (
    <div className="relative rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }}/>
      <div className={`relative rounded-3xl flex flex-col ${ isMobile ? "p-6 gap-5" : "p-7 gap-6"}`}
        style={{
          backgroundColor: colors.neutral900,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <div className="flex items-center gap-4">
          {testimonial.imageUrl ? (
            <img src={testimonial.imageUrl} alt={testimonial.name} className="w-12 h-12 rounded-full"
              style={{
                border: `2px solid ${colors.accent400}40`,
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
              style={{ background: g.iconGradient }}
            >
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="font-semibold text-sm"
              style={{ color: colors.neutral50 }}
            >
              {testimonial.name}
            </div>
            <div className="text-xs"
              style={{ color: colors.neutral400 }}
            >
              {testimonial.role} · {testimonial.company}
            </div>
            {testimonial.linkedInUrl && (
              <a
                href={testimonial.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: colors.accent400 }}
              >
                LinkedIn
                <FiExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
        {testimonial.message && (
          <div>
            <div className="text-sm font-normal mb-2" style={{ color: colors.accent400 }}>
              Message
            </div>
            <div className="rounded-2xl p-4 text-sm leading-relaxed"
              style={{
                backgroundColor: colors.neutral800,
                border: `1px solid ${colors.accent500}22`,
                color: colors.neutral200,
              }}
            >
              <ReadMoreText
                text={sanitizeHtml(testimonial.message)}
                limit={160}
                mobileLimit={110}
              />
            </div>
          </div>
        )}
        {formattedDate && (
          <div className="flex justify-end items-center gap-1 text-[11px]">
            <FiCalendar size={11} style={{ color: colors.neutral500 }} />
            <span style={{ color: colors.neutral500 }}>
              {formattedDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TestimonialCard);
