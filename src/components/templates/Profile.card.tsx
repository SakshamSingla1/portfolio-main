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

import {
  Status,
  type ProfileRequest,
  type SocialLinkResponse,
} from "../../utils/types";

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

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  socialLinks,
}) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const publicResumeService = usePublicResumeService();

  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(false);

  const imageSize = isMobile ? 180 : 280;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleViewResume = () => {
    const url = publicResumeService.getViewResumeUrl(
      profile.userName
    );
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="mx-auto w-full">
        <div className="relative rounded-3xl p-[2px] overflow-hidden">
          <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }} />
          <div className={`relative rounded-3xl backdrop-blur-xl ${ isMobile ? "p-6" : "p-12"} transition-all duration-500`} style={{
              backgroundColor: `${colors.neutral900}dd`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(255,255,255,0.02)`,
            }}
          >
            <div className={`flex ${isMobile ? "flex-col items-center gap-10" : "flex-row items-center gap-16"}`}>
              {profile.profileImageUrl && (
                <div onClick={() => setPreview(true)} className="cursor-pointer transition-all duration-500 hover:scale-105">
                  <CircleWithArc
                    progress={progress}
                    size={imageSize}
                    padding={18}
                  >
                    <img src={profile.profileImageUrl} alt={profile.fullName} className="h-full w-full rounded-full object-cover shadow-2xl" />
                  </CircleWithArc>
                </div>
              )}
              <div className={`flex-1 flex flex-col ${isMobile ? "items-center text-center" : "items-start text-left"}`}>
                <h1 className="font-bold" style={{ color: colors.neutral50, fontSize: isMobile ? 28 : 40 }}>
                  {profile.fullName}
                </h1>
                <p className="mt-3 text-lg font-medium" style={{ color: colors.accent300 }}>
                  {profile.title}
                </p>
                <div className={`mt-8 grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-x-10 gap-y-5"}`} style={{ color: colors.neutral200 }}>
                  {profile.location && (
                    <div className="flex items-center gap-3 transition hover:translate-x-1 duration-300">
                      <FaMapMarkerAlt style={{ color: colors.accent400 }} />
                      {profile.location}
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex cursor-pointer items-center gap-3 transition hover:translate-x-1 duration-300" onClick={() => window.open(`mailto:${profile.email}`, "_blank")}>
                      <FaEnvelope style={{ color: colors.accent400 }} />
                      {profile.email}
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex cursor-pointer items-center gap-3 transition hover:translate-x-1 duration-300" onClick={() => window.open(`tel:${profile.phone}`, "_blank")}>
                      <FaPhoneAlt style={{ color: colors.accent400 }} />
                      {profile.phone}
                    </div>
                  )}
                </div>
                <div className={`mt-10 flex flex-wrap gap-5 ${isMobile? "justify-center" : "justify-start"}`}>
                  {profile.userName && (
                    <div className="transition duration-300 hover:-translate-y-1 hover:scale-105">
                      <Button
                        label="View Resume"
                        variant="primaryContained"
                        onClick={handleViewResume}
                      />
                    </div>
                  )}

                  {profile.email && (
                    <div className="transition duration-300 hover:-translate-y-1 hover:scale-105">
                      <Button
                        label="Contact Me"
                        variant="primaryContained"
                        onClick={() =>
                          window.open(
                            `mailto:${profile.email}`,
                            "_blank"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                {socialLinks.length > 0 && (
                  <div className="my-10 h-px w-full opacity-50" style={{ background: g.dividerGradient }} />
                )}
                <div className={`flex flex-wrap gap-4 ${isMobile ? "justify-center" : "justify-start"}`}>
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
                        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                        style={{
                          backgroundColor: `${colors.neutral800}cc`,
                          border: `1px solid ${colors.accent500}44`,
                          color: colors.accent400,
                          boxShadow:"0 8px 20px rgba(0,0,0,0.4)",
                          backdropFilter: "blur(12px)",
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
