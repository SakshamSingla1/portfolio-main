import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MapPin, Download } from "lucide-react";
import { TypewriterText } from "../molecules/TypewriterText/TypewriterText";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest, SkillResponse, SocialLinkResponse } from "../../utils/types";
import { useRef, useState } from "react";
import React from "react";
import { getSocialIcon } from "../../utils/socialIcons";
import { usePublicResumeService } from "../../services/usePublicResumeService";
import { getOptimizedImageUrl } from "../../utils/helper";

interface Props {
  profile: ProfileRequest;
  socialLinks: SocialLinkResponse[];
  skills?: SkillResponse[];
}


const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  },
};

const DEFAULT_TECH_STACK = ["React", "TypeScript", "Node.js", "AWS", "Docker"];

const HeroSection = ({ profile, socialLinks, skills = [] }: Props) => {
  const techStack = skills.length > 0
    ? skills.slice(0, 6).map(s => s.logoName)
    : DEFAULT_TECH_STACK;
  const colors = useColors();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  const g = gradients(colors);
  const publicResumeService = usePublicResumeService();

  const scrollToAbout = () => {
    document.getElementById("about-me")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadResume = () => {
    const url = publicResumeService.getDownloadResumeUrl(profile.userName);
    window.open(url, "_blank");
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex items-center overflow-hidden mx-auto"
    >
      {/* Ambient background orbs */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary500}08 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent500}06 0%, transparent 70%)`,
          transform: "translate(-30%, 30%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        style={{ y: yText, opacity: opacityFade, scale }}
        className="section-container relative z-10 w-full py-24 lg:py-32 xl:py-40"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 xl:gap-32">
          {/* Profile image column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 relative"
          >
            {profile.profileImageUrl && (
              <div className="relative group">
                {/* Outer conic gradient ring — slow clockwise */}
                <motion.div
                  animate={isInView ? { rotate: 360 } : {}}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 rounded-full opacity-30 blur-2xl"
                  style={{
                    background: `conic-gradient(from 0deg, ${colors.primary500}, transparent 25%, ${colors.accent500}, transparent 50%, ${colors.primary500}, transparent 75%, ${colors.accent500}, transparent 100%)`,
                  }}
                />
                {/* Inner conic gradient ring — slow counter-clockwise */}
                <motion.div
                  animate={isInView ? { rotate: -360 } : {}}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 rounded-full opacity-20 blur-xl"
                  style={{
                    background: `conic-gradient(from 180deg, ${colors.accent500}, transparent 20%, ${colors.primary500}, transparent 40%, ${colors.accent500}, transparent 60%, ${colors.primary500}, transparent 80%, ${colors.accent500}, transparent 100%)`,
                  }}
                />
                {/* Pulsing glow blob */}
                <motion.div
                  animate={isInView ? { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 rounded-3xl blur-3xl"
                  style={{ background: `linear-gradient(135deg, ${colors.primary500}40, ${colors.accent500}40)` }}
                />

                {/* Image container */}
                <div
                  className="relative
                    w-72 h-72
                    sm:w-80 sm:h-80
                    md:w-96 md:h-96
                    lg:w-105 lg:h-105
                    xl:w-120 xl:h-120
                    2xl:w-130 2xl:h-130
                    rounded-3xl overflow-hidden z-10"
                  style={{
                    border: `1px solid ${colors.neutral700}60`,
                    boxShadow: `0 0 50px ${colors.primary500}20`,
                    background: colors.neutral900,
                  }}
                >
                  <img
                    src={getOptimizedImageUrl(profile.profileImageUrl, { width: 800 })}
                    alt={profile.fullName}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Bottom vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                  {/* Inner glow layer */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary500}08 0%, transparent 50%, ${colors.accent500}08 100%)`,
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Corner accents — enhanced size + opacity */}
                <div
                  className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl opacity-70"
                  style={{ borderColor: colors.primary500 }}
                />
                <div
                  className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl opacity-70"
                  style={{ borderColor: colors.accent500 }}
                />

                {/* "Available for Work" floating badge — data-driven */}
                {profile.availableForWork && (
                  <div
                    className="absolute -bottom-3 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold"
                    style={{
                      background: `${colors.success500}15`,
                      border: `1px solid ${colors.success500}40`,
                      color: colors.success400,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: colors.success500,
                        position: "relative",
                        flexShrink: 0,
                      }}
                    >
                      <motion.span
                        animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          background: colors.success500,
                        }}
                      />
                    </span>
                    {profile.availabilityNote || "Available for Work"}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Text content column */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            <motion.p
              variants={stagger.item}
              className="text-sm lg:text-base font-mono mb-4 uppercase tracking-widest"
              style={{ color: `${colors.primary400}B3` }}
            >
              Hello, I'm
            </motion.p>

            {/* Animated gradient name */}
            <motion.h1
              variants={stagger.item}
              className="font-display
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                xl:text-8xl
                2xl:text-[96px]
                font-bold
                mb-6
                leading-[1.05]"
            >
              <motion.span
                className="bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.neutral100}, ${colors.primary400}, ${colors.accent400})`,
                  backgroundSize: "200% 200%",
                  display: "inline-block",
                }}
              >
                {profile.fullName}
              </motion.span>
            </motion.h1>

            {profile.title && (
              <motion.div
                variants={stagger.item}
                className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 h-10"
                style={{ color: colors.neutral400 }}
              >
                <TypewriterText
                  words={[profile.title]}
                  colors={colors}
                />
              </motion.div>
            )}

            {profile.location && (
              <motion.div
                variants={stagger.item}
                className="flex items-center gap-2 mb-8 justify-center lg:justify-start"
                style={{ color: colors.neutral400 }}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm lg:text-base xl:text-lg">
                  {profile.location}
                </span>
              </motion.div>
            )}

            <motion.div
              variants={stagger.item}
              className="flex gap-4 flex-wrap justify-center lg:justify-start mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-gradient px-6 py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 text-sm lg:text-base xl:text-lg"
                style={{ background: g.ctaGradient }}
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get in Touch
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleDownloadResume}
                className="px-6 py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 rounded-xl text-sm lg:text-base xl:text-lg flex items-center gap-2"
                style={{
                  border: `1px solid ${colors.primary500}33`,
                  color: colors.primary400,
                  backgroundColor: `${colors.primary500}08`,
                }}
              >
                <Download /> Resume
              </motion.button>
            </motion.div>

            {/* Social links with hover color */}
            <motion.div
              variants={stagger.item}
              className="flex gap-3 justify-center lg:justify-start"
            >
              {socialLinks.map((link) => (
                <div key={link.id} style={{ position: "relative" }} className="group">
                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${link.platform} profile`}
                    whileHover={{ scale: 1.15, y: -3 }}
                    onMouseEnter={() => setHoveredSocial(link.id)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="p-3 lg:p-4 rounded-xl text-lg flex items-center justify-center"
                    style={{
                      border: `1px solid ${colors.neutral700}50`,
                      backgroundColor:
                        hoveredSocial === link.id
                          ? `${colors.primary500}15`
                          : `${colors.neutral800}50`,
                      color:
                        hoveredSocial === link.id
                          ? colors.primary400
                          : colors.neutral400,
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                  >
                    {getSocialIcon(link.platform)}
                  </motion.a>
                </div>
              ))}
            </motion.div>

            {/* Floating tech stack pills */}
            <motion.div
              variants={stagger.item}
              className="flex gap-2 flex-wrap justify-center lg:justify-start mt-4"
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  whileHover={{ y: -2, scale: 1.05 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontFamily: "monospace",
                    background: `${colors.neutral700}40`,
                    border: `1px solid ${colors.neutral700}60`,
                    color: colors.neutral400,
                    cursor: "default",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${colors.primary500}10`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${colors.primary500}35`;
                    (e.currentTarget as HTMLElement).style.color = colors.primary300;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${colors.neutral700}40`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${colors.neutral700}60`;
                    (e.currentTarget as HTMLElement).style.color = colors.neutral400;
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Premium scroll indicator */}
        <motion.button
          onClick={scrollToAbout}
          className="mt-16 mx-auto flex flex-col items-center gap-3 group"
          aria-label="Scroll to about section"
        >
          <span
            className="text-[9px] font-mono uppercase tracking-[0.35em]"
            style={{ color: `${colors.neutral500}80` }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: 1,
              height: 48,
              position: "relative",
              overflow: "hidden",
              background: `${colors.neutral700}40`,
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "50%",
                background: `linear-gradient(to bottom, transparent, ${colors.primary400})`,
              }}
              animate={{ y: ["0%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default React.memo(HeroSection);
