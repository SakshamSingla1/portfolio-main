import { motion } from "framer-motion";
import { useState } from "react";
import type { ProfileRequest, SkillResponse } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { useColors, gradients } from "../../utils/theme";
import { FiCode, FiCoffee, FiZap } from "react-icons/fi";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import { getOptimizedImageUrl } from "../../utils/helper";

interface AboutSectionProps {
  profile: ProfileRequest;
  totalExp: {
    value: string;
    label: string;
  };
  totalProjects: {
    value: string;
    label: string;
  };
  skills?: SkillResponse[];
}

const AboutSection = ({ profile, totalExp, totalProjects, skills = [] }: AboutSectionProps) => {
  const badgePositions = [
    { position: { top: "-10px", left: "-12px" }, delay: 0 },
    { position: { top: "-10px", right: "-12px" }, delay: 0.6 },
    { position: { bottom: "-10px", left: "-12px" }, delay: 1.2 },
    { position: { bottom: "-10px", right: "-12px" }, delay: 1.8 },
  ];

  const badges = skills.length > 0
    ? skills.slice(0, 4).map((skill, index) => ({
        label: skill.logoName,
        position: badgePositions[index % badgePositions.length].position,
        delay: badgePositions[index % badgePositions.length].delay,
      }))
    : [
        { label: "TypeScript", position: { top: "-10px", left: "-12px" }, delay: 0 },
        { label: "React", position: { top: "-10px", right: "-12px" }, delay: 0.6 },
        { label: "Spring Boot", position: { bottom: "-10px", left: "-12px" }, delay: 1.2 },
        { label: "MongoDB", position: { bottom: "-10px", right: "-12px" }, delay: 1.8 },
      ];
  const colors = useColors();
  const g = gradients(colors);
  const [codeCardHovered, setCodeCardHovered] = useState(false);

  const stats = [
    { icon: FiCode, value: totalExp.value, label: totalExp.label, color: colors.primary500 },
    { icon: FiZap, value: totalProjects.value, label: totalProjects.label, color: colors.success500 },
    { icon: FiCoffee, value: "∞", label: "Cups of Coffee", color: colors.warning500 },
  ];

  return (
    <section id="about-me" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="About Me" />

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {profile.aboutMeImageUrl && (
            <FadeInView className="relative group">
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-700"
                style={{ background: g.cardBorderGradient }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${colors.neutral700}30`, background: colors.neutral900 }}
              >
                <img
                  src={getOptimizedImageUrl(profile.aboutMeImageUrl, { width: 1000 })}
                  alt="About me"
                  className="w-full h-auto block max-h-120 object-contain group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(135deg, ${colors.primary900}60 0%, transparent 50%, ${colors.accent900}40 100%)`,
                }} />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to top, ${colors.neutral900}90, transparent 50%)`,
                }} />

                {/* Available badge */}
                <div
                  className="absolute bottom-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md font-mono text-xs flex items-center gap-2"
                  style={{
                    background: `${colors.neutral900}90`,
                    border: `1px solid ${colors.neutral700}40`,
                    color: colors.primary400,
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{ background: colors.success500 }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: colors.success500 }}
                    />
                  </span>
                  Available for opportunities
                </div>
              </div>

              {/* Floating tech-label badges */}
              {badges.map((badge) => (
                <motion.div
                  key={badge.label}
                  className="absolute z-10 px-2.5 py-1 rounded-full font-mono text-xs whitespace-nowrap pointer-events-none"
                  style={{
                    ...badge.position,
                    background: `${colors.neutral800}CC`,
                    border: `1px solid ${colors.primary500}30`,
                    color: colors.neutral300,
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: badge.delay,
                  }}
                >
                  {badge.label}
                </motion.div>
              ))}

              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 rounded-br-xl"
                style={{ borderColor: `${colors.primary500}45` }} />
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl"
                style={{ borderColor: `${colors.accent500}45` }} />
            </FadeInView>
          )}

          <FadeInView delay={0.15} className="space-y-6">
            <div
              className="rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
              style={{
                background: `${colors.neutral800}50`,
                border: `1px solid ${codeCardHovered ? `${colors.primary500}30` : `${colors.neutral700}40`}`,
                boxShadow: codeCardHovered ? `0 8px 40px ${colors.primary500}08` : undefined,
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={() => setCodeCardHovered(true)}
              onMouseLeave={() => setCodeCardHovered(false)}
            >
              {/* Shimmer scanner line */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${colors.primary500}80, transparent)`,
                  transformOrigin: "left center",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />

              <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: `1px solid ${colors.neutral700}30` }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.error500}80` }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.warning500}80` }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.success500}80` }} />
                </div>
                <span className="font-mono text-xs ml-2" style={{ color: colors.neutral400 }}>about.ts</span>
              </div>

              <div className="font-mono text-xs mb-3" style={{ color: colors.neutral400 }}>
                <span style={{ color: colors.accent400 }}>const</span>{" "}
                <span style={{ color: colors.primary400 }}>aboutMe</span>{" "}
                <span style={{ color: colors.neutral600 }}>=</span>{" "}
                <span style={{ color: colors.success400 }}>{"{"}</span>
              </div>
              <div
                className="text-lg md:text-xl leading-relaxed mb-8 font-light flex items-center"
                style={{ color: `${colors.neutral300}E6` }}
              >
                <ReadMoreText
                  text={profile.aboutMe || ""}
                  limit={200}
                  mobileLimit={100}
                  className="text-sm leading-relaxed border-l-4 pl-4"
                />
              </div>
              <div className="font-mono text-xs mt-3" style={{ color: colors.success400 }}>{"}"}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5, boxShadow: `0 16px 40px ${stat.color}20` }}
                  className="rounded-xl p-4 text-center backdrop-blur-md transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: `${colors.neutral800}50`,
                    border: `1px solid ${colors.neutral700}35`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${stat.color}40`;
                    e.currentTarget.style.background = `${colors.neutral800}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${colors.neutral700}35`;
                    e.currentTarget.style.background = `${colors.neutral800}50`;
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg mx-auto mb-2.5 flex items-center justify-center"
                    style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
                  >
                    <stat.icon size={16} style={{ color: stat.color }} />
                  </div>
                  <div
                    className="text-2xl font-bold font-display bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${stat.color}, ${colors.accent400})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono mt-1.5 leading-tight" style={{ color: colors.neutral500 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default React.memo(AboutSection);
