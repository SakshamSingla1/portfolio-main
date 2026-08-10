import React from "react";
import { useColors, gradients } from "../../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../../utils/types";
import { FiHeart } from "react-icons/fi";
import { getSocialIcon } from "../../../utils/socialIcons";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}


const Footer = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <footer className="relative py-10 px-4 md:px-8 mb-12" style={{ background: colors.neutral900 }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: g.dividerGradient, opacity: 0.2 }} />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="font-display font-bold text-xl" style={{ color: colors.neutral100 }}>
            <span style={{ color: colors.primary500 }}>{"<"}</span>
            {profile.userName}
            <span style={{ color: colors.primary500 }}>{" />"}</span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.platform} profile`}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all duration-300"
                style={{
                  color: colors.neutral500,
                  background: `${colors.neutral800}60`,
                  border: `1px solid ${colors.neutral700}25`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary400;
                  e.currentTarget.style.borderColor = `${colors.primary500}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.neutral500;
                  e.currentTarget.style.borderColor = `${colors.neutral700}25`;
                }}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>

        <div className="h-px mb-6" style={{ background: `${colors.neutral700}30` }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs" style={{ color: colors.neutral600 }}>
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>

          <p className="font-mono text-xs flex items-center gap-1.5" style={{ color: colors.neutral600 }}>
            Built with <FiHeart size={12} style={{ color: colors.primary500 }} /> and lots of code
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
