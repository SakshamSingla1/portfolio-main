import React from "react";
import type { ProfileRequest, SocialLinkResponse } from "../../utils/types";
import { useColors } from "../../utils/theme";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaLink,
} from "react-icons/fa";

interface ProfileCardProps {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "github":
      return <FaGithub />;
    case "linkedin":
      return <FaLinkedin />;
    case "website":
      return <FaGlobe />;
    default:
      return <FaLink />;
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  socialLinks,
}) => {
  const colors = useColors();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div
        className="rounded-3xl border p-8 shadow-sm transition-all sm:p-10"
        style={{
          backgroundColor: colors.neutral50,
          borderColor: `${colors.primary500}1f`,
        }}
      >
        {/* Identity */}
        <div className="flex flex-col items-center text-center">
          {profile.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt={profile.fullName}
              className="h-28 w-28 rounded-full object-cover"
            />
          )}

          <h1
            className="mt-5 text-2xl font-semibold tracking-tight"
            style={{ color: colors.neutral900 }}
          >
            {profile.fullName}
          </h1>

          <p
            className="mt-1 text-sm"
            style={{ color: colors.primary500 }}
          >
            {profile.title}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {profile.location && (
            <span style={{ color: colors.neutral700 }}>
              📍 {profile.location}
            </span>
          )}

          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="hover:underline"
              style={{ color: colors.neutral700 }}
            >
              {profile.email}
            </a>
          )}

          {profile.websiteUrl && (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: colors.neutral700 }}
            >
              {profile.websiteUrl}
            </a>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-8 flex justify-center gap-5">
            {socialLinks
              .filter((link) => link.status === "ACTIVE")
              .sort((a, b) => Number(a.order) - Number(b.order))
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105"
                  style={{
                    borderColor: `${colors.primary500}33`,
                    color: colors.primary500,
                  }}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileCard;
