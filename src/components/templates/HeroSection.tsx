import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowDown, Download, Sparkles, Code2, Layers, Rocket } from "lucide-react";
import { TypewriterText } from "../molecules/TypewriterText/TypewriterText";
import { AnimatedCounter } from "../molecules/AnimatedCounter/AnimatedCounter";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../utils/types";
import { useRef } from "react";
import { SocialLinkPlatform } from "../../utils/constants";
import { FaGithub, FaLinkedin, FaGlobe, FaGitlab, FaBitbucket, FaStackOverflow, FaHackerrank, FaInstagram, FaFacebook, FaLink } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";

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

const stats = [
  { value: 6, suffix: "+", label: "Years Exp.", icon: Rocket },
  { value: 50, suffix: "K+", label: "Users Served", icon: Layers },
  { value: 15, suffix: "+", label: "Projects", icon: Code2 },
  { value: 99, suffix: "%", label: "Satisfaction", icon: Sparkles },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } },
  item: { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
      } 
    } 
  },
};

const HeroSection = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
  const g = gradients(colors);

  const scrollToAbout = () => {
    document.getElementById("about-me")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[200px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: colors.primary500 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-[400px] h-[400px] rounded-full blur-[200px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.10, 0.04] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: colors.accent500 }}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <motion.div style={{ y: yText, opacity: opacityFade, scale }} className="section-container relative z-10 w-full py-20 md:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT — Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0 relative"
          >
            {profile.profileImageUrl && (
              <div className="relative">
                {/* Subtle rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 rounded-3xl opacity-40"
                  style={{
                    background: `conic-gradient(from 0deg, ${colors.primary500}33, transparent 30%, ${colors.accent500}33, transparent 60%, ${colors.primary500}33)`,
                  }}
                />

                <div
                  className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-80 lg:h-80 rounded-3xl overflow-hidden"
                  style={{ border: `2px solid ${colors.neutral700}50` }}
                >
                  <img src={profile.profileImageUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent" />
                </div>

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full glass-card-premium text-xs font-medium"
                  style={{ border: `1px solid ${colors.success500}26`, color: colors.success400 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: colors.success400 }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colors.success400 }} />
                  </span>
                  Available for work
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            <motion.p
              variants={stagger.item}
              className="text-sm font-mono mb-4 tracking-wider uppercase"
              style={{ color: `${colors.primary400}B3` }}
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              variants={stagger.item}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-[1.1] tracking-tight"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${colors.neutral100}, ${colors.primary400}, ${colors.accent400})` }}
              >
                {profile.fullName}
              </span>
            </motion.h1>

            <motion.div
              variants={stagger.item}
              className="text-lg md:text-xl lg:text-2xl font-light mb-4 h-8"
              style={{ color: colors.neutral400 }}
            >
              <TypewriterText words={["Full-Stack Developer", "Creative Technologist", "Open Source Contributor", "UI/UX Enthusiast"]} colors={colors} />
            </motion.div>

            <motion.p
              variants={stagger.item}
              className="text-sm max-w-lg mb-6 lg:mx-0 mx-auto leading-relaxed"
              style={{ color: `${colors.neutral500}CC` }}
            >
              {profile.title}
            </motion.p>

            <motion.div
              variants={stagger.item}
              className="flex items-center gap-2 mb-8 justify-center lg:justify-start"
              style={{ color: colors.neutral500 }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: `${colors.primary400}80` }} />
              <span className="text-sm">{profile.location}</span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={stagger.item} className="flex items-center gap-3 mb-8 justify-center lg:justify-start flex-wrap">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-gradient flex items-center gap-2"
                style={{ background: g.ctaGradient }}
              >
                <span>Get in Touch</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 backdrop-blur-sm transition-all duration-400"
                style={{
                  border: `1px solid ${colors.primary500}33`,
                  color: colors.primary400,
                  backgroundColor: `${colors.primary500}08`,
                }}
              >
                <Download className="w-4 h-4" /> Resume
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={stagger.item} className="flex items-center gap-2.5 justify-center lg:justify-start">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform)
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl transition-all duration-300 group"
                    style={{
                      border: `1px solid ${colors.neutral700}50`,
                      backgroundColor: `${colors.neutral800}50`,
                      color: colors.neutral500,
                    }}
                  >
                    {Icon}
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="glass-card-premium p-5 text-center cursor-default group"
            >
              <stat.icon className="w-4 h-4 mx-auto mb-2 transition-colors duration-300" style={{ color: `${colors.primary400}60` }} />
              <AnimatedCounter end={stat.value} suffix={stat.suffix} colors={colors} />
              <p className="text-[11px] mt-1 font-medium tracking-wide" style={{ color: `${colors.neutral500}B3` }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={scrollToAbout}
          className="mt-16 mx-auto block group"
          style={{ color: `${colors.neutral500}80` }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono group-hover:text-primary transition-colors">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default React.memo(HeroSection);