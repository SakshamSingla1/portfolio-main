import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { MapPin, Download, ArrowUpRight } from "lucide-react";
import { useColors, gradients } from "../../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../../utils/types";
import { getSocialIcon } from "../../../utils/socialIcons";
import { usePublicResumeService } from "../../../services/usePublicResumeService";
import { getOptimizedImageUrl } from "../../../utils/helper";
import SafeImage from "../../atoms/SafeImage/SafeImage";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } },
  item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Editorial, high-contrast split-screen hero — the "Bold" template's
 * structural variant on HeroSection.tsx: an asymmetric two-column layout
 * (oversized cutout-style photo/color block on one side, poster-scale
 * name/title stack on the other) instead of Modern's centered gradient
 * column or Minimal's centered typography block. */
const BoldHero = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const g = gradients(colors);
  const publicResumeService = usePublicResumeService();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const initials = getInitials(profile.fullName || "");

  const setRefs = (node: HTMLElement | null) => {
    sectionRef.current = node;
    inViewRef(node);
  };

  const handleDownloadResume = () => {
    window.open(publicResumeService.getDownloadResumeUrl(profile.userName), "_blank");
  };

  return (
    <section id="hero" ref={setRefs} className="relative overflow-hidden" style={{ background: colors.neutral900 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image / color-block side */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="relative flex items-center justify-center p-8 sm:p-14 lg:p-16 lg:min-h-[92vh] order-1"
          style={{ background: `linear-gradient(160deg, ${colors.primary900}, ${colors.neutral900} 70%)` }}
        >
          <motion.div variants={stagger.item} className="relative w-full max-w-md">
            <div className="relative aspect-[4/5]">
              {/* offset color-block "cutout" shadow */}
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6"
                style={{ background: colors.accent500 }}
                aria-hidden
              />
              <div
                className="relative w-full h-full overflow-hidden"
                style={{ border: `6px solid ${colors.neutral100}` }}
              >
                {profile.profileImageUrl ? (
                  <SafeImage
                    src={getOptimizedImageUrl(profile.profileImageUrl, { width: 800 })}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                    fetchPriority="high"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: g.heroGradient }}>
                    <span className="font-display font-black text-white text-[7rem] sm:text-[8rem] leading-none">
                      {initials || "?"}
                    </span>
                  </div>
                )}
              </div>

              {profile.availableForWork && (
                <div
                  className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 flex items-center gap-2 px-4 py-2"
                  style={{ background: colors.success500 }}
                >
                  <motion.span
                    className="h-2 w-2 shrink-0"
                    style={{ background: "#fff" }}
                    animate={inView ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
                    transition={inView ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : undefined}
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-white whitespace-nowrap">
                    Available for work
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Name / title / CTA side */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-20 lg:py-0 order-2"
        >
          <motion.p
            variants={stagger.item}
            className="font-mono text-xs uppercase tracking-[0.4em] mb-5"
            style={{ color: colors.neutral500 }}
          >
            Portfolio
          </motion.p>

          <motion.h1
            variants={stagger.item}
            className="font-display font-black uppercase text-7xl sm:text-8xl xl:text-9xl leading-[0.85] tracking-tight mb-7"
            style={{ color: colors.neutral100 }}
          >
            {profile.fullName}
          </motion.h1>

          {profile.title && (
            <motion.div variants={stagger.item} className="mb-7">
              <span
                className="inline-block px-4 py-2.5 font-extrabold uppercase text-sm sm:text-base tracking-wide"
                style={{ background: colors.accent500, color: "#fff", transform: "rotate(-1deg)" }}
              >
                {profile.title}
              </span>
            </motion.div>
          )}

          {profile.location && (
            <motion.div
              variants={stagger.item}
              className="flex items-center gap-2 mb-9 text-sm font-semibold"
              style={{ color: colors.neutral400 }}
            >
              <MapPin size={16} /> {profile.location}
            </motion.div>
          )}

          <motion.div variants={stagger.item} className="flex flex-wrap gap-4 mb-9">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-lg font-black uppercase text-sm tracking-wide flex items-center gap-2"
              style={{ background: colors.neutral100, color: colors.neutral900 }}
            >
              Get in Touch <ArrowUpRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              onClick={handleDownloadResume}
              className="px-8 py-4 rounded-lg font-black uppercase text-sm tracking-wide flex items-center gap-2"
              style={{ border: `3px solid ${colors.neutral100}`, color: colors.neutral100 }}
            >
              <Download size={16} /> Resume
            </motion.button>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div variants={stagger.item} className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${link.platform} profile`}
                  whileHover={{ scale: 1.08, rotate: -3 }}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: colors.neutral800, color: colors.neutral100, border: `1px solid ${colors.neutral700}` }}
                >
                  {getSocialIcon(link.platform)}
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BoldHero;
