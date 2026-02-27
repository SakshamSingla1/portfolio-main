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
        <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }}/>
        <div
          className={`relative rounded-3xl grid ${isMobile ? "grid-cols-1 p-8" : "grid-cols-[220px_1fr] p-10"} gap-8 items-start`}
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {profile.aboutMeImageUrl && (
            <div className={`flex ${isMobile ? "justify-center" : "justify-start"}`}>
              <div className="rounded-2xl p-[3px]" style={{ background: g.iconGradient }}>
                <img src={profile.aboutMeImageUrl} alt={profile.fullName} className={`${isMobile ? "h-36 w-24" : "h-72 w-48"} rounded-2xl object-cover`} />
              </div>
            </div>
          )}
          <div className={`${isMobile ? "text-center" : "text-left"} max-w-2xl`}>
            <h3 className="mb-3 text-xs uppercase tracking-widest font-semibold" style={{ color: colors.accent400 }}>
              About Me
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.neutral200 }}>
              <ReadMoreText
                text={profile.aboutMe}
                limit={500}
                mobileLimit={500}
                className=""
              />
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default memo(AboutMeCard);
