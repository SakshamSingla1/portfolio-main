import React, { memo } from "react";
import { FiMessageCircle, FiCalendar, FiExternalLink } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Testimonial } from "../../utils/types";
import { sanitizeHtml } from "../../utils/helper";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const colors = useColors();
  const g = gradients(colors);

  const formattedDate = testimonial.createdAt
    ? new Date(testimonial.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="relative group rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-1">
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-3xl blur-sm transition-all duration-500 group-hover:opacity-100"
        style={{ background: g.cardBorderGradient }}
      />

      <div
        className="
          relative rounded-3xl p-7 flex flex-col gap-6
          transition-all duration-500
          group-hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]
        "
        style={{
          backgroundColor: colors.neutral900,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div
            className="p-2 rounded-xl"
            style={{
              background: g.iconGradient,
              boxShadow: g.hoverGlowInset,
            }}
          >
            <FiMessageCircle size={18} className="text-white" />
          </div>
        </div>

        {/* Quote */}
        <div className="relative">
          <span
            className="absolute -top-4 -left-2 text-6xl select-none opacity-10"
            style={{ color: colors.accent300 }}
          >
            “
          </span>

          <p
            className="relative text-sm leading-relaxed italic"
            style={{ color: colors.neutral200 }}
          >
            {sanitizeHtml(testimonial.message)}
          </p>
        </div>

        {/* User */}
        <div className="flex items-start gap-4 pt-2">
          {testimonial.imageUrl ? (
            <img
              src={testimonial.imageUrl}
              alt={testimonial.name}
              className="
                w-12 h-12 rounded-full object-cover
                transition-all duration-300
                group-hover:scale-105
              "
              style={{
                border: `2px solid ${colors.accent400}40`,
                boxShadow: g.hoverGlowInset,
              }}
            />
          ) : (
            <div
              className="
                w-12 h-12 rounded-full
                flex items-center justify-center
                text-white font-semibold
                transition-transform duration-300
                group-hover:scale-105
              "
              style={{ background: g.iconGradient }}
            >
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h3
              className="font-semibold text-base"
              style={{ color: colors.neutral50 }}
            >
              {testimonial.name}
            </h3>

            <div className="flex flex-col gap-1 mt-1">
              <span
                className="text-sm font-medium"
                style={{ color: colors.accent300 }}
              >
                {testimonial.role}
              </span>

              <span
                className="text-sm"
                style={{ color: colors.neutral400 }}
              >
                {testimonial.company}
              </span>

              {formattedDate && (
                <div className="flex items-center gap-1 text-xs mt-2">
                  <FiCalendar size={12} style={{ color: colors.neutral500 }} />
                  <span style={{ color: colors.neutral500 }}>
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn CTA */}
        {testimonial.linkedInUrl && (
          <div className="mt-auto pt-3">
            <a
              href={testimonial.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                text-sm font-medium
                transition-all duration-300
                hover:translate-x-1
              "
              style={{ color: colors.accent400 }}
            >
              View LinkedIn Profile
              <FiExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default memo(TestimonialCard);
