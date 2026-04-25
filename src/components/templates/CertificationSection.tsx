import { motion } from "framer-motion";
import type { Certification } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiExternalLink } from "react-icons/fi";
import { formatDate } from "../../utils/helper";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useColors, shadows } from "../../utils/theme";
import React from "react";

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertificationsSection = ({ certifications }: CertificationsSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  return (
    <section
      id="certifications"
      className="section-padding relative"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Certifications" subtitle="Professional certifications and credentials" />

        <div className="space-y-4">
          {certifications.map((cert, idx) => (
            <FadeInView key={cert.id} delay={idx * 0.1}>
              <motion.div
                whileHover={{ x: 4, boxShadow: s.card }}
                className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-md transition-all duration-300"
                style={{
                  background: `${colors.neutral900}80`,
                  border: `1px solid ${colors.neutral700}40`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${colors.primary500}30`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.neutral700}40`; }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors.primary500}20, ${colors.accent500}20)` }}
                >
                  <HiOutlineBadgeCheck style={{ color: colors.primary400 }} size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold" style={{ color: colors.neutral50 }}>{cert.title}</h3>
                  <p className="text-sm font-mono" style={{ color: colors.primary400 }}>{cert.issuer}</p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs font-mono" style={{ color: colors.neutral500 }}>
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                    {cert.expiryDate && <span>Expires: {formatDate(cert.expiryDate)}</span>}
                    {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono shrink-0 transition-colors duration-300"
                    style={{ color: colors.primary400 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = colors.primary300; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = colors.primary400; }}
                  >
                    <FiExternalLink size={14} /> Verify
                  </a>
                )}
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(CertificationsSection);
