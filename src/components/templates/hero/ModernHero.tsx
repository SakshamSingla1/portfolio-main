import { motion } from "framer-motion";
import { MapPin, Download } from "lucide-react";
import { TypewriterText } from "../../molecules/TypewriterText/TypewriterText";
import { useColors, gradients } from "../../../utils/theme";
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
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } },
};

/** Centered, gradient-forward hero — the "Modern" template's structural
 * variant on HeroSection.tsx (image-left/text-right there vs. a single
 * centered column here with a full-bleed gradient backdrop). */
const ModernHero = ({ profile, socialLinks, skills = [] }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const publicResumeService = usePublicResumeService();
  const techStack = skills.slice(0, 6).map((s) => s.logoName);

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${colors.primary700}, ${colors.accent700} 65%, ${colors.neutral900})` }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(circle at 50% 0%, ${colors.accent400}30, transparent 60%)` }}
      />

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 flex flex-col items-center text-center py-28 lg:py-36"
      >
        {profile.profileImageUrl && (
          <motion.div variants={stagger.item} className="relative mb-8">
            <div
              className="rounded-full overflow-hidden"
              style={{ width: 132, height: 132, border: `3px solid rgba(255,255,255,0.35)`, boxShadow: `0 0 60px ${colors.accent400}55` }}
            >
              <SafeImage
                src={getOptimizedImageUrl(profile.profileImageUrl, { width: 400 })}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                fetchPriority="high"
                loading="eager"
              />
            </div>
            {profile.availableForWork && (
              <div
                className="absolute -bottom-1 right-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: colors.success500, color: "#fff" }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#fff" }} />
                Open to work
              </div>
            )}
          </motion.div>
        )}

        <motion.p variants={stagger.item} className="text-xs font-mono mb-3 uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.7)" }}>
          Hello, I'm
        </motion.p>

        <motion.h1
          variants={stagger.item}
          className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black mb-4 leading-[1.02]"
          style={{ color: "#fff" }}
        >
          {profile.fullName}
        </motion.h1>

        {profile.title && (
          <motion.div variants={stagger.item} className="text-lg md:text-2xl mb-5 h-9" style={{ color: "rgba(255,255,255,0.85)" }}>
            <TypewriterText words={[profile.title]} colors={colors} />
          </motion.div>
        )}

        {profile.location && (
          <motion.div variants={stagger.item} className="flex items-center justify-center gap-2 mb-8 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            <MapPin className="w-4 h-4" /> {profile.location}
          </motion.div>
        )}

        <motion.div variants={stagger.item} className="flex gap-3 flex-wrap justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-7 py-3.5 rounded-full text-sm font-semibold"
            style={{ background: "#fff", color: colors.primary700 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get in Touch
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleDownloadResume}
            className="px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2"
            style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", background: "rgba(255,255,255,0.08)" }}
          >
            <Download size={16} /> Resume
          </motion.button>
        </motion.div>

        <motion.div variants={stagger.item} className="flex gap-2.5 justify-center flex-wrap mb-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit my ${link.platform} profile`}
              whileHover={{ scale: 1.15, y: -2 }}
              className="p-3 rounded-full text-lg flex items-center justify-center"
              style={{ border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "#fff" }}
            >
              {getSocialIcon(link.platform)}
            </motion.a>
          ))}
        </motion.div>

        {techStack.length > 0 && (
          <motion.div variants={stagger.item} className="flex gap-2 flex-wrap justify-center">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-[11px] font-mono"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
              >
                {tech}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>

      <div style={{ height: 4, background: g.ctaGradient }} />
    </section>
  );
};

export default ModernHero;
