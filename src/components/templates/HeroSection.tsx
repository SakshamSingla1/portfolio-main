import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowDown, Download } from "lucide-react";
import { TypewriterText } from "../molecules/TypewriterText/TypewriterText";
import { useColors, gradients } from "../../utils/theme";
import type { ProfileRequest, SocialLinkResponse } from "../../utils/types";
import { useRef } from "react";
import { SocialLinkPlatform } from "../../utils/constants";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaGitlab,
  FaBitbucket,
  FaStackOverflow,
  FaHackerrank,
  FaInstagram,
  FaFacebook,
  FaLink,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";
import { usePublicResumeService } from "../../services/usePublicResumeService";

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

const HeroSection = ({ profile, socialLinks }: Props) => {
  const colors = useColors();
  const ref = useRef<HTMLElement>(null);

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
      className="relative min-h-screen flex items-center overflow-hidden max-w-400 mx-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/5 w-150 h-150 rounded-full blur-[220px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ backgroundColor: colors.primary500 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-125 h-125 rounded-full blur-[220px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 14, repeat: Infinity }}
          style={{ backgroundColor: colors.accent500 }}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <motion.div
        style={{ y: yText, opacity: opacityFade, scale }}
        className="section-container relative z-10 w-full py-24 lg:py-32 xl:py-40"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 xl:gap-32">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="shrink-0 relative"
          >
            {profile.profileImageUrl && (
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-6 rounded-3xl opacity-40"
                  style={{
                    background: `conic-gradient(from 0deg, ${colors.primary500}33, transparent 30%, ${colors.accent500}33, transparent 60%)`,
                  }}
                />

                <div
                  className="relative 
                    w-72 h-72 
                    sm:w-80 sm:h-80 
                    md:w-96 md:h-96 
                    lg:w-105 lg:h-105 
                    xl:w-120 xl:h-120 
                    2xl:w-130 2xl:h-130 
                    rounded-3xl overflow-hidden"
                  style={{ border: `2px solid ${colors.neutral700}50` }}
                >
                  <img
                    src={profile.profileImageUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Content */}
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
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.neutral100}, ${colors.primary400}, ${colors.accent400})`,
                }}
              >
                {profile.fullName}
              </span>
            </motion.h1>

            <motion.div
              variants={stagger.item}
              className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 h-10"
              style={{ color: colors.neutral400 }}
            >
              <TypewriterText
                words={[
                  "Full-Stack Developer",
                  "UI/UX Enthusiast",
                  profile.title,
                ]}
                colors={colors}
              />
            </motion.div>

            <motion.div
              variants={stagger.item}
              className="flex items-center gap-2 mb-8 justify-center lg:justify-start"
              style={{ color: colors.neutral500 }}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm lg:text-base xl:text-lg">
                {profile.location}
              </span>
            </motion.div>

            {/* Buttons */}
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

            {/* Social */}
            <motion.div
              variants={stagger.item}
              className="flex gap-3 justify-center lg:justify-start"
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="p-3 lg:p-4 rounded-xl"
                  style={{
                    border: `1px solid ${colors.neutral700}50`,
                    backgroundColor: `${colors.neutral800}50`,
                    color: colors.neutral500,
                  }}
                >
                  {getSocialIcon(link.platform)}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.button
          onClick={scrollToAbout}
          className="mt-20 mx-auto block"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs lg:text-sm tracking-widest">SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown className="w-5 h-5 lg:w-6 lg:h-6" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default React.memo(HeroSection);