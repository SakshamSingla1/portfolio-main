import React, { memo, useEffect, useState } from "react";
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
import { Status, type ProfileRequest, type SocialLinkResponse } from "../../utils/types";
import { useColors, gradients } from "../../utils/theme";
import CircleWithArc from "../atoms/CircleWithArc/CircleWithArc";
import { SocialLinkPlatform } from "../../utils/constants";
import usePublicResumeService from "../../services/usePublicResumeService";
import Button from "../atoms/Button/Button";
import FullscreenImageViewer from "../atoms/FullScreenImagePreviewer/FullScreenImagePreviewer";
import { useIsMobile } from "../../hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const publicResumeService = usePublicResumeService();

  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(false);

  const imageSize = isMobile ? 200 : 280;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.4));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleViewResume = () => {
    const url = publicResumeService.getViewResumeUrl(profile.userName);
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative rounded-3xl p-[1px]">
          <div
            className="absolute inset-0 rounded-3xl opacity-60"
            style={{ background: g.cardBorderGradient }}
          />

          <div
            className={`relative rounded-3xl ${
              isMobile ? "p-6" : "p-10"
            }`}
            style={{
              backgroundColor: colors.neutral900,
              boxShadow: g.hoverGlowSoft,
            }}
          >
            <div
              className={`flex ${
                isMobile ? "flex-col items-center gap-8" : "flex-row gap-12"
              }`}
            >
              {profile.profileImageUrl && (
                <div
                  onClick={() => setPreview(true)}
                  className="cursor-pointer"
                >
                  <CircleWithArc progress={progress} size={imageSize} padding={14}>
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </CircleWithArc>
                </div>
              )}

              <div
                className={`flex-1 ${
                  isMobile ? "text-center" : "text-left"
                }`}
              >
                <div
                  className="font-semibold tracking-tight"
                  style={{
                    color: colors.neutral50,
                    fontSize: isMobile ? 26 : 32,
                  }}
                >
                  {profile.fullName}
                </div>

                <div
                  className="mt-1 text-base font-medium"
                  style={{ color: colors.accent300 }}
                >
                  {profile.title}
                </div>

                <div
                  className={`mt-6 grid ${
                    isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                  }`}
                  style={{ color: colors.neutral200 }}
                >
                  {profile.location && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <FaMapMarkerAlt style={{ color: colors.accent400 }} />
                      {profile.location}
                    </div>
                  )}

                  {profile.email && (
                    <div
                      onClick={() => window.open(`mailto:${profile.email}`, "_blank")}
                      className="flex items-center gap-2 cursor-pointer justify-center md:justify-start"
                    >
                      <FaEnvelope style={{ color: colors.accent400 }} />
                      {profile.email}
                    </div>
                  )}

                  {profile.phone && (
                    <div
                      onClick={() => window.open(`tel:${profile.phone}`, "_blank")}
                      className="flex items-center gap-2 cursor-pointer justify-center md:justify-start"
                    >
                      <FaPhoneAlt style={{ color: colors.accent400 }} />
                      {profile.phone}
                    </div>
                  )}
                </div>

                <div
                  className={`mt-8 flex gap-4 ${
                    isMobile ? "justify-center" : "justify-start"
                  }`}
                >
                  {profile.userName && (
                    <Button
                      label="View Resume"
                      variant="primaryContained"
                      onClick={handleViewResume}
                    />
                  )}

                  {profile.email && (
                    <Button
                      label="Contact Me"
                      variant="primaryContained"
                      onClick={() =>
                        window.open(`mailto:${profile.email}`, "_blank")
                      }
                    />
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div
                    className="my-8 h-px"
                    style={{ background: g.dividerGradient }}
                  />
                )}

                <div
                  className={`flex flex-wrap gap-3 ${
                    isMobile ? "justify-center" : "justify-start"
                  }`}
                >
                  {socialLinks
                    .filter(l => l.status === Status.ACTIVE)
                    .sort((a, b) => Number(a.order) - Number(b.order))
                    .map(link => (
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
                          backdropFilter: "blur(6px)",
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

      {profile.profileImageUrl && (
        <FullscreenImageViewer
          open={preview}
          imageUrl={profile.profileImageUrl}
          alt={profile.fullName}
          onClose={() => setPreview(false)}
        />
      )}
    </>
  );
};

export default memo(ProfileCard);
