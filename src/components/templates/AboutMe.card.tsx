import React, { memo } from "react";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

interface AboutMeCardProps {
  profile: ProfileRequest;
}

const AboutMeCard: React.FC<AboutMeCardProps> = ({ profile }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();

  if (!profile.aboutMe) return null;

  return (
    <section className="mx-auto w-full">
      <article className="relative rounded-3xl p-[1px]">
        <div
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className={`relative rounded-3xl grid ${
            isMobile ? "grid-cols-1 p-8 gap-6" : "grid-cols-[260px_1fr] p-12 gap-10"
          } items-start`}
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {profile.aboutMeImageUrl && (
            <div className={`flex ${isMobile ? "justify-center" : "justify-start"}`}>
              <div
                className="rounded-2xl p-[4px]"
                style={{ background: g.iconGradient }}
              >
                <img
                  src={profile.aboutMeImageUrl}
                  alt={profile.fullName}
                  className={`${
                    isMobile ? "h-44 w-32" : "h-80 w-56"
                  } rounded-2xl object-cover`}
                />
              </div>
            </div>
          )}

          <div className={`${isMobile ? "text-center" : "text-left"} max-w-3xl`}>
            <h3
              className="mb-4 text-sm uppercase tracking-widest font-semibold"
              style={{ color: colors.accent400 }}
            >
              About Me
            </h3>

            <ReadMoreText
              text={profile.aboutMe}
              limit={650}
              mobileLimit={420}
              className="text-lg leading-8"
            />
          </div>
        </div>
      </article>
    </section>
  );
};

export default memo(AboutMeCard);