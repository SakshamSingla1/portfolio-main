import { motion } from "framer-motion";
import type { ProfileRequest } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { useColors, gradients } from "../../utils/theme";
import { FiCode, FiCoffee, FiZap } from "react-icons/fi";
import React from "react";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

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
}

const AboutSection = ({ profile, totalExp, totalProjects }: AboutSectionProps) => {
  const colors = useColors();
  const g = gradients(colors);

  const stats = [
    { icon: FiCode, value: totalExp.value, label: totalExp.label, color: colors.primary500 },
    { icon: FiZap, value: totalProjects.value, label: totalProjects.label, color: colors.primary500 },
    { icon: FiCoffee, value: "∞", label: "Cups of Coffee", color: colors.primary500 },
  ];

  return (
    <section id="about-me" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
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
                style={{ border: `1px solid ${colors.neutral700}30` }}
              >
                <img
                  src={profile.aboutMeImageUrl}
                  alt="About me"
                  className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(135deg, ${colors.primary900}60 0%, transparent 50%, ${colors.accent900}40 100%)`,
                }} />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to top, ${colors.neutral900}90, transparent 50%)`,
                }} />
                <div
                  className="absolute bottom-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md font-mono text-xs"
                  style={{
                    background: `${colors.neutral900}90`,
                    border: `1px solid ${colors.neutral700}40`,
                    color: colors.primary400,
                  }}
                >
                  <span style={{ color: colors.success500 }}>●</span> Currently building cool stuff
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 rounded-br-xl"
                style={{ borderColor: `${colors.primary500}25` }} />
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl"
                style={{ borderColor: `${colors.accent500}25` }} />
            </FadeInView>
          )}

          <FadeInView delay={0.15} className="space-y-6">
            <div
              className="rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
              style={{
                background: `${colors.neutral800}50`,
                border: `1px solid ${colors.neutral700}40`,
              }}
            >
              <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: `1px solid ${colors.neutral700}30` }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.error500}80` }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.warning500}80` }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: `${colors.success500}80` }} />
                </div>
                <span className="font-mono text-xs ml-2" style={{ color: colors.neutral500 }}>about.ts</span>
              </div>

              <div className="font-mono text-xs mb-3" style={{ color: colors.neutral500 }}>
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
                  whileHover={{ y: -4, boxShadow: `0 8px 24px ${stat.color}18` }}
                  className="rounded-xl p-4 text-center backdrop-blur-md transition-all duration-300"
                  style={{
                    background: `${colors.neutral800}50`,
                    border: `1px solid ${colors.neutral700}35`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${stat.color}35`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.neutral700}35`; }}
                >
                  <stat.icon size={18} style={{ color: stat.color }} className="mx-auto mb-2" />
                  <div
                    className="text-2xl font-bold font-display bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${stat.color}, ${colors.accent400})` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono mt-1 leading-tight" style={{ color: colors.neutral500 }}>
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
