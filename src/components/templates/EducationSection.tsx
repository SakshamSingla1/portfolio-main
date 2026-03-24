import { motion } from "framer-motion";
import { GraduationCap, MapPin, Award, BookOpen } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { useColors } from "../../utils/theme";
import type { Education } from "../../utils/types";
import { getEducationLabel } from "../../utils/helper";

interface Props {
  educations: Education[];
}

export const EducationSection = ({ educations }: Props) => {
  const colors = useColors();

  return (
    <section id="education" className="section-container">
      <SectionHeading title="Education" subtitle="Academic background and qualifications" />
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {educations.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card-premium p-6 relative overflow-hidden group"
          >
            {/* Decorative background */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: `${colors.primary500}0D` }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="p-3 rounded-xl shrink-0"
                  style={{ backgroundColor: `${colors.primary500}1A`, color: colors.primary400 }}
                >
                  <GraduationCap className="w-6 h-6" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg" style={{ color: colors.neutral100 }}>
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-medium mt-1 flex items-center gap-1" style={{ color: `${colors.primary400}CC` }}>
                    <BookOpen className="w-3 h-3" />
                    {getEducationLabel(edu.degree)}
                  </p>
                  <p className="text-sm" style={{ color: colors.neutral400 }}>{edu.fieldOfStudy}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className="text-xs font-mono px-2.5 py-1 rounded-md"
                      style={{ color: colors.neutral400, backgroundColor: `${colors.neutral700}60`, border: `1px solid ${colors.neutral700}4D` }}
                    >
                      {edu.startYear} — {edu.endYear}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: colors.neutral500 }}>
                      <MapPin className="w-3 h-3" />{edu.location}
                    </span>
                  </div>

                  {edu.grade && (
                    <div
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${colors.success500}1A`, border: `1px solid ${colors.success500}26` }}
                    >
                      <Award className="w-3.5 h-3.5" style={{ color: colors.success400 }} />
                      <span className="text-sm font-semibold" style={{ color: colors.success400 }}>{edu.grade}</span>
                    </div>
                  )}

                  {edu.description && (
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.neutral400 }}>{edu.description}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
