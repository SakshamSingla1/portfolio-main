import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download } from "lucide-react";
import { TypewriterText } from "../../molecules/TypewriterText/TypewriterText";
import { useColors } from "../../../utils/theme";
import type { ProfileRequest, SkillResponse, SocialLinkResponse } from "../../../utils/types";
import { getSocialIcon } from "../../../utils/socialIcons";
import { usePublicResumeService } from "../../../services/usePublicResumeService";
import { getOptimizedImageUrl } from "../../../utils/helper";
import SafeImage from "../../atoms/SafeImage/SafeImage";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
  skills?: SkillResponse[];
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.35, delayChildren: 0.2 } } },
  item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } },
};

/** Mock terminal/IDE window hero — the "Terminal" template's structural
 * variant on HeroSection.tsx: a window-chrome header, monospace command-line
 * "output" (typed once via TypewriterText) introducing the person, a
 * bracket-styled command-button row, and a `$ open <platform>` social list. */
const TerminalHero = ({ profile, socialLinks, skills = [] }: Props) => {
  const colors = useColors();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  const publicResumeService = usePublicResumeService();
  const techStack = skills.slice(0, 6).map((s) => s.logoName);

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" ref={ref} className="relative overflow-hidden" style={{ background: colors.neutral900 }}>
      <div className="section-container relative z-10 py-20 lg:py-28">
        {/* Terminal window */}
        <div
          className="max-w-3xl mx-auto rounded-lg overflow-hidden"
          style={{
            background: colors.neutral800,
            border: `1px solid ${colors.neutral700}80`,
            boxShadow: `0 30px 80px -30px rgba(0,0,0,0.7)`,
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center px-4 py-3 relative"
            style={{ background: `${colors.neutral900}90`, borderBottom: `1px solid ${colors.neutral700}60` }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F56" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#27C93F" }} />
            </div>
            <span
              className="absolute left-1/2 -translate-x-1/2 text-xs font-mono"
              style={{ color: colors.neutral400 }}
            >
              whoami.sh
            </span>
          </div>

          {/* Window body */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="px-5 py-6 sm:px-8 sm:py-8 font-mono text-sm sm:text-base"
          >
            {/* Plain (non-animated) so the LCP text/avatar paints immediately
                instead of waiting on JS + the stagger entrance animation. */}
            <div className="flex items-start gap-3 mb-5">
              {profile.profileImageUrl ? (
                <div
                  className="shrink-0 overflow-hidden"
                  style={{ width: 56, height: 56, border: `1px solid ${colors.primary400}80` }}
                >
                  <SafeImage
                    src={getOptimizedImageUrl(profile.profileImageUrl, { width: 200 })}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                    loading="eager"
                  />
                </div>
              ) : (
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{ width: 56, height: 56, border: `1px solid ${colors.primary400}80`, color: colors.primary400 }}
                >
                  {"</>"}
                </div>
              )}
              <div className="min-w-0">
                <div style={{ color: colors.neutral500 }}>
                  <span style={{ color: colors.success400 }}>guest@portfolio</span>
                  <span style={{ color: colors.neutral500 }}>:</span>
                  <span style={{ color: colors.primary400 }}>~</span>
                  <span style={{ color: colors.neutral500 }}>$ whoami</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold break-words" style={{ color: colors.neutral100 }}>
                  {profile.fullName}
                </div>
              </div>
            </div>

            {profile.title && (
              <motion.div variants={stagger.item} className="mb-5">
                <div style={{ color: colors.neutral500 }}>
                  <span style={{ color: colors.success400 }}>guest@portfolio</span>
                  <span style={{ color: colors.neutral500 }}>:</span>
                  <span style={{ color: colors.primary400 }}>~</span>
                  <span style={{ color: colors.neutral500 }}>$ cat title.txt</span>
                </div>
                <div className="min-h-[1.5em]" style={{ color: colors.accent400 }}>
                  <TypewriterText words={[profile.title]} colors={colors} isInView={isInView} />
                </div>
              </motion.div>
            )}

            {profile.location && (
              <motion.div variants={stagger.item} className="mb-5">
                <div style={{ color: colors.neutral500 }}>
                  <span style={{ color: colors.success400 }}>guest@portfolio</span>
                  <span style={{ color: colors.neutral500 }}>:</span>
                  <span style={{ color: colors.primary400 }}>~</span>
                  <span style={{ color: colors.neutral500 }}>$ cat location.txt</span>
                </div>
                <div style={{ color: colors.neutral300 }}>{profile.location}</div>
              </motion.div>
            )}

            {techStack.length > 0 && (
              <motion.div variants={stagger.item} className="mb-2">
                <div style={{ color: colors.neutral500 }}>
                  <span style={{ color: colors.success400 }}>guest@portfolio</span>
                  <span style={{ color: colors.neutral500 }}>:</span>
                  <span style={{ color: colors.primary400 }}>~</span>
                  <span style={{ color: colors.neutral500 }}>$ ls ./skills</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {techStack.map((tech) => (
                    <span key={tech} style={{ color: colors.primary300 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={stagger.item} className="flex items-center gap-1 mt-1" style={{ color: colors.neutral500 }}>
              <span style={{ color: colors.success400 }}>guest@portfolio</span>
              <span>:</span>
              <span style={{ color: colors.primary400 }}>~</span>
              <span>$</span>
              <motion.span
                animate={isInView ? { opacity: [1, 0] } : { opacity: 1 }}
                transition={isInView ? { repeat: Infinity, duration: 0.8 } : { duration: 0.2 }}
                className="inline-block w-2 h-4 ml-1"
                style={{ background: colors.neutral300 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Command-styled action buttons */}
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 mt-8 font-mono text-sm">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-4 py-2.5 transition-colors duration-200"
            style={{ border: `1px solid ${colors.primary400}80`, color: colors.primary300, borderRadius: 2 }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = `${colors.primary500}15`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            [ get-in-touch ]
          </button>
          <button
            onClick={handleDownloadResume}
            className="px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
            style={{ border: `1px solid ${colors.neutral600}`, color: colors.neutral300, borderRadius: 2 }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = `${colors.neutral700}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <Download size={14} /> [ download-resume ]
          </button>
        </div>

        {/* Social links as `$ open <platform>` rows */}
        {socialLinks.length > 0 && (
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 font-mono text-xs">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.platform} profile`}
                className="flex items-center gap-1.5 transition-colors duration-200"
                style={{ color: colors.neutral500 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = colors.primary400;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = colors.neutral500;
                }}
              >
                <span style={{ color: colors.neutral600 }}>$</span> open
                <span className="inline-flex items-center gap-1">
                  {getSocialIcon(link.platform)}
                  {link.platform}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TerminalHero;
