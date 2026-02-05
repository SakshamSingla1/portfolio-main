import React, { memo, useEffect, useState } from "react";
import type { ProfileRequest, SocialLinkResponse } from "../../utils/types";
import { useColors, gradients } from "../../utils/theme";
import CircleWithArc from "../atoms/CircleWithArc/CircleWithArc";

import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaLink,
  FaGitlab,
  FaBitbucket,
  FaStackOverflow,
  FaHackerrank,
  FaInstagram,
  FaFacebook,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { SocialLinkPlatform } from "../../utils/constants";

/* ---------- Helpers ---------- */

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case SocialLinkPlatform.GITHUB:
      return <FaGithub />;
    case SocialLinkPlatform.LINKEDIN:
      return <FaLinkedin />;
    case SocialLinkPlatform.PORTFOLIO:
      return <FaGlobe />;
    case SocialLinkPlatform.GITLAB:
      return <FaGitlab />;
    case SocialLinkPlatform.BITBUCKET:
      return <FaBitbucket />;
    case SocialLinkPlatform.STACKOVERFLOW:
      return <FaStackOverflow />;
    case SocialLinkPlatform.LEETCODE:
      return <SiLeetcode />;
    case SocialLinkPlatform.HACKERRANK:
      return <FaHackerrank />;
    case SocialLinkPlatform.CODECHEF:
      return <SiCodechef />;
    case SocialLinkPlatform.CODEFORCES:
      return <SiCodeforces />;
    case SocialLinkPlatform.TWITTER:
    case SocialLinkPlatform.X:
      return <FaXTwitter />;
    case SocialLinkPlatform.INSTAGRAM:
      return <FaInstagram />;
    case SocialLinkPlatform.FACEBOOK:
      return <FaFacebook />;
    default:
      return <FaLink />;
  }
};

/* ---------- Component ---------- */

interface ProfileCardProps {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, socialLinks }) => {
  const colors = useColors();
  const g = gradients(colors);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.4));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto w-full pt-12">
      <article className="relative group rounded-3xl p-[1px]">
        <div
          className="absolute inset-0 rounded-3xl opacity-60 transition-opacity duration-500"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className="relative rounded-3xl p-8 sm:p-10"
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          <div className="flex flex-col items-center text-center">
            {profile.profileImageUrl && (
              <div className="relative w-[273px] h-[273px] my-6 md:my-0 md:w-[400px] md:h-[400px]">
                <img
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  className="rounded-full object-cover mt-3 ml-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <CircleWithArc progress={progress} />
              </div>
            )}

            <h1
              className="text-2xl sm:text-3xl font-semibold"
              style={{ color: colors.neutral50 }}
            >
              {profile.fullName}
            </h1>

            <p
              className="mt-1 text-sm sm:text-base font-medium"
              style={{ color: colors.accent300 }}
            >
              {profile.title}
            </p>
          </div>

          <div
            className="mt-7 grid gap-3 sm:grid-cols-2 text-sm"
            style={{ color: colors.neutral200 }}
          >
            {profile.location && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={14} style={{ color: colors.accent400 }} />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.email && (
              <div className="flex items-center gap-2">
                <FaEnvelope size={14} style={{ color: colors.accent400 }} />
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email}
                </a>
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-2">
                <FaPhoneAlt size={14} style={{ color: colors.accent400 }} />
                <a href={`tel:${profile.phone}`} className="hover:underline">
                  {profile.phone}
                </a>
              </div>
            )}
          </div>

          {socialLinks.length > 0 && (
            <>
              <div
                className="my-8 h-px"
                style={{ background: g.dividerGradient }}
              />

              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks
                  .filter((l) => l.status === "ACTIVE")
                  .sort((a, b) => Number(a.order) - Number(b.order))
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        backgroundColor: colors.neutral800,
                        color: colors.neutral200,
                        border: `1px solid ${colors.accent500}22`,
                        boxShadow: g.hoverGlowSoft,
                      }}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: colors.neutral900,
                          color: colors.accent400,
                        }}
                      >
                        {getSocialIcon(link.platform)}
                      </span>

                      <span>
                        {link.platform
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </a>
                  ))}
              </div>
            </>
          )}
        </div>
      </article>
    </section>
  );
};

export default memo(ProfileCard);
