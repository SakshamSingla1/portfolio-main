import { motion } from "framer-motion";
import { MapPin, Download, Sparkles } from "lucide-react";
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
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } },
  item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } },
};

/** Organic blob shape via mismatched corner radii — a static decorative
 * fill, never animated (perpetual motion here previously caused real perf
 * issues, so entrance-only stagger is as far as motion goes). */
const Blob = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute pointer-events-none" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", filter: "blur(60px)", ...style }} />
);

/** Asymmetric, color-forward hero — the "Creative" template's structural
 * variant on HeroSection.tsx: organic blob backdrops instead of a hard
 * gradient panel, a squircle-framed portrait instead of a circle, and a
 * pill-badge title instead of plain/typewriter text. */
const CreativeHero = ({ profile, socialLinks, skills = [] }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const publicResumeService = usePublicResumeService();
  const techStack = skills.slice(0, 6).map((s) => s.logoName);
  const nameParts = (profile.fullName || "").trim().split(/\s+/);
  const lastWord = nameParts.length > 1 ? nameParts.pop() : nameParts[0];
  const leadingName = nameParts.length > 0 && nameParts.join(" ") !== lastWord ? nameParts.join(" ") + " " : "";

  const socialPalette = [colors.primary400, colors.accent400, colors.success400, colors.warning400];

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: colors.neutral900 }}>
      {/* Static organic blobs — background decoration only, no motion loops */}
      <Blob style={{ width: 460, height: 460, top: -140, left: -160, opacity: 0.32, background: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})` }} />
      <Blob
        style={{
          width: 520, height: 480, bottom: -200, right: -140, opacity: 0.28,
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          background: `linear-gradient(135deg, ${colors.accent500}, ${colors.primary400})`,
        }}
      />
      <Blob
        style={{
          width: 320, height: 320, top: "18%", right: "8%", opacity: 0.22,
          borderRadius: "70% 30% 60% 40% / 40% 70% 30% 60%",
          background: `linear-gradient(135deg, ${colors.accent400}, ${colors.accent600})`,
        }}
      />

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center py-24 lg:py-32"
      >
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          {profile.title && (
            <motion.div
              variants={stagger.item}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: `${colors.accent400}22`, color: colors.accent300, border: `1px solid ${colors.accent400}44` }}
            >
              <Sparkles size={14} />
              {profile.title}
            </motion.div>
          )}

          <motion.h1
            variants={stagger.item}
            className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-[5.5rem] font-extrabold mb-5 leading-[1.05]"
            style={{ color: colors.neutral100 }}
          >
            {leadingName}
            <span style={{ background: g.textGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {lastWord}
            </span>
          </motion.h1>

          {profile.location && (
            <motion.div variants={stagger.item} className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-sm" style={{ color: colors.neutral400 }}>
              <MapPin className="w-4 h-4" /> {profile.location}
            </motion.div>
          )}

          <motion.div variants={stagger.item} className="flex gap-4 flex-wrap justify-center lg:justify-start mb-8">
            <motion.button
              whileHover={{ scale: 1.06, rotate: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-full text-sm font-semibold"
              style={{ background: g.ctaGradient, color: "#fff", boxShadow: `0 15px 40px -15px ${colors.accent500}88` }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Let's Talk
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06, rotate: 2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadResume}
              className="px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{ border: `1.5px solid ${colors.primary400}66`, color: colors.neutral100, background: `${colors.primary400}14` }}
            >
              <Download size={16} /> Resume
            </motion.button>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div variants={stagger.item} className="flex gap-3 justify-center lg:justify-start flex-wrap mb-6">
              {socialLinks.map((link, i) => {
                const tint = socialPalette[i % socialPalette.length];
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${link.platform} profile`}
                    whileHover={{ scale: 1.12, rotate: -6 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-11 h-11 rounded-2xl text-lg flex items-center justify-center"
                    style={{ background: `${tint}22`, color: tint }}
                  >
                    {getSocialIcon(link.platform)}
                  </motion.a>
                );
              })}
            </motion.div>
          )}

          {techStack.length > 0 && (
            <motion.div variants={stagger.item} className="flex gap-2 flex-wrap justify-center lg:justify-start">
              {techStack.map((tech, i) => {
                const tint = socialPalette[i % socialPalette.length];
                return (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium"
                    style={{ background: `${tint}18`, color: tint, border: `1px solid ${tint}33` }}
                  >
                    {tech}
                  </span>
                );
              })}
            </motion.div>
          )}
        </div>

        {profile.profileImageUrl && (
          <motion.div variants={stagger.item} className="relative flex justify-center order-1 lg:order-2">
            <div
              className="relative rounded-[2.5rem] p-2 rotate-[-3deg]"
              style={{ background: g.ctaGradient, boxShadow: `0 30px 70px -25px ${colors.accent500}66` }}
            >
              <div className="rounded-[2.1rem] overflow-hidden rotate-[3deg]" style={{ width: 260, height: 260, background: colors.neutral900 }}>
                <SafeImage
                  src={getOptimizedImageUrl(profile.profileImageUrl, { width: 500 })}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
            </div>

            {profile.availableForWork && (
              <div
                className="absolute -bottom-3 -right-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold rotate-[-3deg]"
                style={{ background: g.ctaGradient, color: "#fff", boxShadow: `0 10px 25px -8px ${colors.accent500}aa` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#fff" }} />
                Open to work
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CreativeHero;
