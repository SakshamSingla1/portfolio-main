import React, { memo } from "react";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest } from "../../utils/types";

interface AboutMeCardProps {
  profile: ProfileRequest;
}

const AboutMeCard: React.FC<AboutMeCardProps> = ({ profile }) => {
  const colors = useColors();
  const g = gradients(colors);

  if (!profile.aboutMe) return null;

  return (
    <section className="mx-auto w-full pt-12">
      <article className="relative rounded-3xl p-[1px]">
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className="
            relative rounded-3xl
            p-8 sm:p-10
            grid gap-8
            md:grid-cols-[220px_1fr]
            items-start
          "
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {/* Image */}
          <div className="flex justify-center md:justify-start">
            {profile.profileImageUrl && (
              <div
                className="rounded-2xl p-[3px]"
                style={{ background: g.iconGradient }}
              >
                <img
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  className="
                    h-44 w-44
                    rounded-2xl
                    object-cover
                  "
                />
              </div>
            )}
          </div>

          {/* About text */}
          <div className="max-w-2xl text-left">
            <h3
              className="mb-3 text-xs uppercase tracking-widest font-semibold"
              style={{ color: colors.accent400 }}
            >
              About Me
            </h3>

            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: colors.neutral200 }}
            >
              {profile.aboutMe}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default memo(AboutMeCard);
