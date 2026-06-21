import { motion } from "framer-motion";
import type { Certification } from "../../utils/types";
import SectionHeading from "../molecules/SectionHeading/SectionHeading";
import FadeInView from "../molecules/FadeInView/FadeInView";
import { FiExternalLink, FiHash } from "react-icons/fi";
import { formatDate } from "../../utils/helper";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useColors, shadows } from "../../utils/theme";
import React from "react";

interface CertificationsSectionProps {
  certifications: Certification[];
}

interface ExpiryStatus {
  label: string;
  color: string;
}

const CertificationsSection = ({ certifications }: CertificationsSectionProps) => {
  const colors = useColors();
  const s = shadows(colors);

  const getExpiryStatus = (expiryDate?: string): ExpiryStatus | null => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { label: "Expired", color: colors.error400 };
    if (daysLeft < 90) return { label: `Expiring in ${daysLeft}d`, color: colors.warning400 };
    return { label: "Valid", color: colors.success400 };
  };

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
                className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-md transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `${colors.neutral900}80`,
                  border: `1px solid ${colors.neutral700}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary500}40`;
                  e.currentTarget.style.boxShadow = `0 4px 24px ${colors.primary500}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.neutral700}40`;
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl transition-all duration-300"
                  style={{ background: `linear-gradient(to bottom, ${colors.primary500}60, ${colors.accent500}40)` }}
                />
                <div
                  className="absolute top-2 right-3 font-mono text-xs font-bold select-none pointer-events-none"
                  style={{ color: `${colors.primary500}15` }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary600}25, ${colors.accent600}20)`,
                    border: `1px solid ${colors.primary500}30`,
                    boxShadow: `0 4px 16px ${colors.primary500}15`,
                  }}
                >
                  <HiOutlineBadgeCheck style={{ color: colors.primary300 }} size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold" style={{ color: colors.neutral50 }}>
                    {cert.title}
                  </h3>
                  <p className="text-sm font-mono" style={{ color: colors.primary400 }}>
                    {cert.issuer}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-mono" style={{ color: colors.neutral400 }}>
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                    {cert.expiryDate && (
                      <span className="inline-flex items-center gap-1.5">
                        Expires: {formatDate(cert.expiryDate)}
                        {(() => {
                          const status = getExpiryStatus(cert.expiryDate);
                          return status ? (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono"
                              style={{
                                background: `${status.color}12`,
                                border: `1px solid ${status.color}30`,
                                color: status.color,
                              }}
                            >
                              {status.label}
                            </span>
                          ) : null;
                        })()}
                      </span>
                    )}
                    {cert.credentialId && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          background: `${colors.neutral700}40`,
                          border: `1px solid ${colors.neutral700}60`,
                          color: colors.neutral400,
                        }}
                      >
                        <FiHash size={10} />
                        {cert.credentialId}
                      </span>
                    )}
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono shrink-0 transition-all duration-300 px-4 py-1.5"
                    style={{
                      background: `${colors.primary500}12`,
                      border: `1px solid ${colors.primary500}30`,
                      color: colors.primary300,
                      borderRadius: 99,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${colors.primary500}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${colors.primary500}12`;
                    }}
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
