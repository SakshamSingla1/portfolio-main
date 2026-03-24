import { motion } from "framer-motion";
import { Trophy, ShieldCheck, ExternalLink, Calendar, Award } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading/SectionHeading";
import { FadeInView } from "../molecules/FadeInView/FadeInView";
import { useColors } from "../../utils/theme";
import type { Achievement, Certification } from "../../utils/types";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";

export const AchievementsSection = ({ achievements }: { achievements: Achievement[] }) => {
  const colors = useColors();

  return (
    <section id="achievements" className="section-container">
      <SectionHeading title="Achievements" subtitle="Recognition and milestones" />
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {achievements.map((a, i) => (
          <FadeInView key={a.id || i} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card-premium p-6 flex items-start gap-4 group"
            >
              <motion.div
                whileHover={{ rotate: 12 }}
                className="p-3 rounded-xl shrink-0"
                style={{ backgroundColor: `${colors.warning500}1A`, color: colors.warning400 }}
              >
                <Trophy className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="font-display font-bold" style={{ color: colors.neutral100 }}>{a.title}</h3>
                <p className="text-sm font-medium mt-0.5" style={{ color: `${colors.primary400}B3` }}>{a.issuer}</p>
                {a.achievedAt && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono mt-1.5 px-2 py-0.5 rounded" style={{ color: colors.neutral500, backgroundColor: `${colors.neutral700}4D` }}>
                    <Calendar className="w-3 h-3" /> {a.achievedAt}
                  </span>
                )}
                <p className="text-sm mt-3 leading-relaxed" style={{ color: colors.neutral400 }}>
                  <ReadMoreText text={a.description || ""} limit={100} mobileLimit={50} />
                </p>
              </div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
};

export const CertificationsSection = ({ certifications }: { certifications: Certification[] }) => {
  const colors = useColors();

  return (
    <section id="certifications" className="section-container">
      <SectionHeading title="Certifications" subtitle="Professional credentials and qualifications" />
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {certifications.map((c, i) => (
          <FadeInView key={c.id || i} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card-premium p-6 flex items-start gap-4 group"
            >
              <motion.div
                whileHover={{ rotate: -12 }}
                className="p-3 rounded-xl shrink-0"
                style={{ backgroundColor: `${colors.accent500}1A`, color: colors.accent400 }}
              >
                <ShieldCheck className="w-6 h-6" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-display font-bold" style={{ color: colors.neutral100 }}>{c.title}</h3>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1" style={{ color: `${colors.primary400}B3` }}>
                  <Award className="w-3 h-3" /> {c.issuer}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ color: colors.success400, backgroundColor: `${colors.success500}1A`, border: `1px solid ${colors.success500}26` }}
                  >
                    Issued: {c.issueDate}
                  </span>
                  {c.expiryDate && (
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ color: colors.warning400, backgroundColor: `${colors.warning500}1A`, border: `1px solid ${colors.warning500}26` }}
                    >
                      Expires: {c.expiryDate}
                    </span>
                  )}
                </div>
                {c.credentialUrl && (
                  <motion.a
                    whileHover={{ x: 2 }}
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs inline-flex items-center gap-1.5 transition-colors"
                    style={{ color: colors.primary400 }}
                  >
                    <ExternalLink className="w-3 h-3" /> View Credential
                  </motion.a>
                )}
              </div>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
};