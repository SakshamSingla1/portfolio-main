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

  const getProgressBarColor = (progress: number, expiryDate: string): string => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    if (now > expiry) return colors.error400;
    if (progress > 0.9) return colors.error400;
    if (progress > 0.7) return colors.warning400;
    return colors.success400;
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
                className="group rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-md transition-all duration-300 relative overflow-hidden"
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

                {/* Issuer initial avatar with badge icon overlay */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary600}25, ${colors.accent600}20)`,
                      border: `1px solid ${colors.primary500}30`,
                      boxShadow: `0 4px 16px ${colors.primary500}15`,
                    }}
                  >
                    <span
                      className="font-display font-bold text-xl leading-none select-none"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary300}, ${colors.accent400})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {cert.issuer.charAt(0).toUpperCase()}
                    </span>
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary500}, ${colors.accent500})`,
                        boxShadow: `0 2px 6px ${colors.primary500}40`,
                      }}
                    >
                      <HiOutlineBadgeCheck style={{ color: "#fff" }} size={10} />
                    </div>
                  </div>

                  {/* Issuer tooltip on hover */}
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-mono whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    style={{
                      background: `${colors.neutral800}F0`,
                      border: `1px solid ${colors.neutral700}60`,
                      color: colors.neutral300,
                      boxShadow: `0 4px 12px ${colors.neutral900}80`,
                    }}
                  >
                    {cert.issuer}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: `4px solid ${colors.neutral700}60`,
                      }}
                    />
                  </div>
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

                  {/* Validity progress bar */}
                  {cert.issueDate && cert.expiryDate && (() => {
                    const now = new Date().getTime();
                    const issued = new Date(cert.issueDate).getTime();
                    const expiry = new Date(cert.expiryDate).getTime();
                    const raw = (now - issued) / (expiry - issued);
                    const progress = Math.min(1, Math.max(0, raw));
                    const barColor = getProgressBarColor(progress, cert.expiryDate);
                    return (
                      <div
                        className="mt-2.5"
                        style={{
                          height: 3,
                          borderRadius: 99,
                          background: `${colors.neutral700}40`,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 + 0.3 }}
                          style={{
                            height: "100%",
                            borderRadius: 99,
                            background: barColor,
                            boxShadow: `0 0 6px ${barColor}60`,
                          }}
                        />
                      </div>
                    );
                  })()}
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
