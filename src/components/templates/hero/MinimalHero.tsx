import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useColors } from "../../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../../utils/types";
import { getSocialIcon } from "../../../utils/socialIcons";
import { usePublicResumeService } from "../../../services/usePublicResumeService";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/** Centered, typography-first hero — the "Minimal" template's structural
 * variant on HeroSection.tsx: no photo, no glow/gradient effects, no tech
 * chips — just generous whitespace and plain text/icon links. */
const MinimalHero = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const publicResumeService = usePublicResumeService();

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" className="relative">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="section-container flex flex-col items-center text-center py-32 lg:py-44"
      >
        <motion.p variants={item} className="text-xs font-mono mb-5 uppercase tracking-[0.35em]" style={{ color: colors.neutral500 }}>
          {profile.title || "Portfolio"}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-[104px] font-light mb-6 leading-[1.05] tracking-tight"
          style={{ color: colors.neutral100 }}
        >
          {profile.fullName}
        </motion.h1>

        {profile.location && (
          <motion.p variants={item} className="text-sm mb-10" style={{ color: colors.neutral500 }}>
            {profile.location}
          </motion.p>
        )}

        <motion.div variants={item} className="flex items-center gap-6 flex-wrap justify-center mb-10">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: colors.neutral100 }}
          >
            Get in touch
          </button>
          <button
            onClick={handleDownloadResume}
            className="text-sm font-medium flex items-center gap-1.5 underline-offset-4 hover:underline"
            style={{ color: colors.neutral100 }}
          >
            <Download size={14} /> Resume
          </button>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div variants={item} className="flex gap-5 justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.platform} profile`}
                className="text-lg"
                style={{ color: colors.neutral400 }}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default MinimalHero;
