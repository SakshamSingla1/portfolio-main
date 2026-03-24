import { motion } from "framer-motion";
import { Heart, ArrowUp, Code2 } from "lucide-react";
import { useColors } from "../../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../../utils/types";
import { SocialLinkPlatform } from "../../../utils/constants";
import { FaGithub, FaLinkedin, FaGlobe, FaGitlab, FaBitbucket, FaStackOverflow, FaHackerrank, FaInstagram, FaFacebook, FaLink } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

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

export const Footer = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${colors.primary500}80, ${colors.accent500}80, transparent)` }}
      />

      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-[120px] rounded-full"
        style={{ backgroundColor: `${colors.primary500}08` }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <p
              className="font-display text-xl font-bold mb-2 bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})` }}
            >
              {profile.fullName.split(" ")[0]}<span className="text-primary">.</span>
            </p>
            <p className="text-sm" style={{ color: colors.neutral500 }}>{profile.title}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    border: `1px solid ${colors.neutral700}33`,
                    backgroundColor: `${colors.neutral800}4D`,
                    color: colors.neutral400,
                  }}
                >
                  {Icon}
                </motion.a>
              );
            })}
          </div>

          <div className="flex md:justify-end">
            <motion.button
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="text-xs flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300"
              style={{
                border: `1px solid ${colors.primary500}4D`,
                color: colors.primary400,
                backgroundColor: `${colors.primary500}08`,
              }}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Back to Top
            </motion.button>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${colors.neutral700}26` }}
        >
          <p className="text-xs flex items-center gap-1" style={{ color: colors.neutral500 }}>
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: colors.neutral500 }}>
            <Code2 className="w-3 h-3" style={{ color: `${colors.primary400}80` }} />
            Crafted with <Heart className="w-3 h-3" style={{ color: colors.error400, fill: colors.error400 }} /> and lots of coffee
          </p>
        </div>
      </div>
    </footer>
  );
};
