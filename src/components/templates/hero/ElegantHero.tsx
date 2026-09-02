import { motion } from "framer-motion";
import { useColors } from "../../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../../utils/types";
import { getSocialIcon } from "../../../utils/socialIcons";
import { usePublicResumeService } from "../../../services/usePublicResumeService";
import { getOptimizedImageUrl } from "../../../utils/helper";
import SafeImage from "../../atoms/SafeImage/SafeImage";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/** Centered, quiet-luxury hero — the "Elegant" template's structural variant
 * on HeroSection.tsx: a narrow content column, a small understated portrait
 * (no glow/gradient drama), and a thin accent rule as the recurring
 * signature motif between the name and the title. No infinite animations —
 * everything here plays once on mount and then sits still. */
const ElegantHero = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const publicResumeService = usePublicResumeService();

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" className="relative" style={{ background: colors.neutral900 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-2xl mx-auto flex flex-col items-center text-center px-6 py-32 lg:py-40"
      >
        {profile.profileImageUrl && (
          <motion.div variants={item} className="mb-8 rounded-full overflow-hidden" style={{ width: 104, height: 104, border: `1px solid ${colors.neutral700}` }}>
            <SafeImage
              src={getOptimizedImageUrl(profile.profileImageUrl, { width: 300 })}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Plain (non-animated) so the LCP text paints immediately instead of
            waiting on JS + the stagger entrance animation to reach opacity:1. */}
        <h1
          className="font-display text-4xl sm:text-5xl font-medium mb-6 leading-[1.15]"
          style={{ color: colors.neutral100 }}
        >
          {profile.fullName}
        </h1>

        <motion.div variants={item} className="mb-6" style={{ width: 56, height: 2, background: colors.accent400 }} />

        {profile.title && (
          <motion.p variants={item} className="text-base sm:text-lg mb-3" style={{ color: colors.neutral400 }}>
            {profile.title}
          </motion.p>
        )}

        {profile.location && (
          <motion.p variants={item} className="text-sm mb-10" style={{ color: colors.neutral500 }}>
            {profile.location}
          </motion.p>
        )}

        <motion.div variants={item} className="flex items-center gap-8 flex-wrap justify-center mb-10">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-medium pb-1"
            style={{ color: colors.neutral100, borderBottom: `1px solid ${colors.accent400}` }}
          >
            Get in touch
          </button>
          <button
            onClick={handleDownloadResume}
            className="text-sm"
            style={{ color: colors.neutral400 }}
          >
            Download résumé
          </button>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div variants={item} className="flex gap-6 justify-center">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.platform} profile`}
                className="text-base transition-colors duration-200"
                style={{ color: colors.neutral500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.neutral100)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.neutral500)}
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

export default ElegantHero;
