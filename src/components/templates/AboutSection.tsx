import { motion } from "framer-motion";
import { FadeInView } from "../molecules/FadeInView/FadeInView";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { Code, Palette, Zap, Coffee } from "lucide-react";
import { useColors } from "../../utils/theme";
import type { ProfileRequest } from "../../utils/types";

interface Props {
  profile: ProfileRequest;
}

const highlights = [
  { icon: Code, title: "Clean Code", desc: "Well-architected, maintainable solutions", color: "primary" },
  { icon: Zap, title: "Performance", desc: "Optimized for speed and scalability", color: "warning" },
  { icon: Palette, title: "Design-Driven", desc: "Beautiful, intuitive user experiences", color: "accent" },
  { icon: Coffee, title: "Passionate", desc: "Driven by curiosity and craftsmanship", color: "success" },
];

export const AboutSection = ({ profile }: Props) => {
  const colors = useColors();

  const colorMap: Record<string, { bg: string; icon: string }> = {
    primary: { bg: `${colors.primary500}0A`, icon: colors.primary400 },
    warning: { bg: `${colors.warning500}0A`, icon: colors.warning400 },
    accent: { bg: `${colors.accent500}0A`, icon: colors.accent400 },
    success: { bg: `${colors.success500}0A`, icon: colors.success400 },
  };

  return (
    <section id="about-me" className="section-container">
      <SectionHeading title="About Me" subtitle="A little bit about who I am" />
      <div className="grid md:grid-cols-5 gap-10 items-center">
        {profile.aboutMeImageUrl && (
          <FadeInView className="md:col-span-2">
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden glow-border">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  src={profile.aboutMeImageUrl}
                  alt="About"
                  className="w-full h-72 md:h-96 object-cover"
                />
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl backdrop-blur-sm -z-10"
                style={{ backgroundColor: `${colors.primary500}0A`, border: `1px solid ${colors.primary500}15` }}
              />
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -left-3 w-14 h-14 rounded-2xl backdrop-blur-sm -z-10"
                style={{ backgroundColor: `${colors.accent500}0A`, border: `1px solid ${colors.accent500}15` }}
              />
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -right-2 top-6 glass-card px-4 py-2.5 text-center"
              >
                <p className="text-2xl font-display font-bold" style={{ color: colors.primary400 }}>6+</p>
                <p className="text-[10px]" style={{ color: `${colors.neutral500}B3` }}>Years Exp</p>
              </motion.div>
            </div>
          </FadeInView>
        )}
        <FadeInView delay={0.15} className="md:col-span-3 space-y-6">
          <p className="text-base md:text-lg leading-relaxed" style={{ color: `${colors.neutral300}E6` }}>
            <div
              className="preview"
              dangerouslySetInnerHTML={{ __html: profile.aboutMe || "" }}
            />
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {highlights.map((h, i) => {
              const c = colorMap[h.color];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="glass-card-premium p-4 cursor-default"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: c.bg }}
                  >
                    <h.icon className="w-4 h-4" style={{ color: c.icon }} />
                  </div>
                  <h4 className="font-display text-sm font-semibold mb-1" style={{ color: colors.neutral100 }}>{h.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: `${colors.neutral500}CC` }}>{h.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </FadeInView>
      </div>
    </section>
  );
};