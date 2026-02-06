import React, { memo, useEffect, useState } from "react";
import { Status, type ProfileRequest, type SocialLinkResponse } from "../../utils/types";
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
import { useMediaQuery } from "@mui/material";
import usePublicResumeService from "../../services/usePublicResumeService";
import Button from "../atoms/Button/Button";

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

interface ProfileCardProps {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, socialLinks }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useMediaQuery("(max-width:768px)");
  const publicResumeService = usePublicResumeService();

  const imageSize = isMobile ? 220 : 300;

  const [progress, setProgress] = useState(0);

  const handleViewResume = async () => {
    const url = publicResumeService.getViewResumeUrl(profile.userName);
    window.open(url, "_blank");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.35));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="relative rounded-3xl p-[1px]">
        <div
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className="relative rounded-3xl p-8"
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {/* MAIN LAYOUT */}
          <div
            className={`flex gap-10 ${isMobile ? "flex-col items-center" : "flex-row items-start"}`}
          >
            {/* AVATAR */}
            {profile.profileImageUrl && (
              <CircleWithArc progress={progress} size={imageSize} padding={16}>
                <img
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </CircleWithArc>
            )}

            {/* CONTENT */}
            <div
              className={`flex-1 ${isMobile ? "text-center" : "text-left"}`}
            >
              <h1
                className="text-3xl font-semibold"
                style={{ color: colors.neutral50 }}
              >
                {profile.fullName}
              </h1>

              <p
                className="mt-2 text-base font-medium"
                style={{ color: colors.accent300 }}
              >
                {profile.title}
              </p>
              <div
                className={`mt-6 ${isMobile ? "grid grid-cols-1 gap-4 justify-center" : "grid grid-cols-2 gap-4 justify-start"}`}
                style={{
                  color: colors.neutral200,
                }}
              >
                {profile.location && (
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt style={{ color: colors.accent400 }} />
                    {profile.location}
                  </span>
                )}

                {profile.email && (
                  <div
                    onClick={() =>
                      window.open(`mailto:${profile.email}`, "_blank")
                    }
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FaEnvelope style={{ color: colors.accent400 }} />
                    {profile.email}
                  </div>
                )}

                {profile.phone && (
                  <div
                    onClick={() =>
                      window.open(`tel:${profile.phone}`, "_blank")
                    }
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FaPhoneAlt style={{ color: colors.accent400 }} />
                    {profile.phone}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className={`mt-8 flex gap-4 ${isMobile ? "justify-center" : "justify-start"}`}>
                {profile.userName && (
                  <Button
                    label="View Resume"
                    variant="primaryContained"
                    onClick={() => {
                      handleViewResume();
                    }}
                  />
                )}

                {profile.email && (
                  <Button
                    label="Contact Me"
                    variant="primaryContained"
                    onClick={() => {
                      window.open(`mailto:${profile.email}`, "_blank");
                    }}
                  />
                )}
              </div>

              {/* DIVIDER */}
              {socialLinks.length > 0 && (
                <div
                  className="my-8 h-px"
                  style={{ background: g.dividerGradient }}
                />
              )}

              {/* SOCIAL ICONS */}
              <div className={`flex flex-wrap gap-3 ${isMobile ? "justify-center" : "justify-start"}`}>
                {socialLinks
                  .filter((l) => l.status === Status.ACTIVE)
                  .sort((a, b) => Number(a.order) - Number(b.order))
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.platform}
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: colors.neutral800,
                        border: `1px solid ${colors.accent500}33`,
                        color: colors.accent400,
                      }}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileCard);
