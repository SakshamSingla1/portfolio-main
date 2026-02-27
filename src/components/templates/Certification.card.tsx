import React, { memo, useMemo, useState } from "react";
import { FiCheckCircle, FiCalendar, FiAward } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Certification } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import FullscreenImageViewer from "../atoms/FullScreenImagePreviewer/FullScreenImagePreviewer";

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ certification }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const [openPreview, setOpenPreview] = useState(false);

  const issuedAt = useMemo(
    () =>
      certification.issueDate
        ? new Date(certification.issueDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        : "—",
    [certification.issueDate]
  );

  return (
    <>
      <div className="relative rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: g.cardBorderGradient }} />

        <div
          className="relative rounded-3xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {certification.credentialUrl && (
            <div onClick={() => setOpenPreview(true)} className="relative px-6 pt-6 cursor-pointer">
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: colors.neutral800,
                  border: `1px solid ${colors.accent500}22`,
                }}
              >
                <img
                  src={certification.credentialUrl}
                  alt={certification.title}
                  className="w-full h-48 md:h-56 object-cover transition-transform duration-500 hover:scale-105"
                />

                <div
                  className="absolute top-4 left-4 flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: `${colors.neutral900}DD`,
                    color: colors.accent400,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <FiCheckCircle size={14} />
                  Certified
                </div>
              </div>
            </div>
          )}

          <div className={`flex flex-col ${isMobile ? "p-6 gap-4" : "p-8 gap-5"}`}>
            <ReadMoreText
              text={certification.title}
              limit={80}
              mobileLimit={60}
              className="font-semibold text-lg md:text-xl tracking-tight"
            />

            <div className="flex flex-col gap-2 text-[15px] md:text-[16px]">
              <div className="flex items-center gap-2">
                <FiAward size={16} style={{ color: colors.accent400 }} />
                <span style={{ color: colors.neutral300 }}>
                  {certification.issuer}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FiCalendar size={15} style={{ color: colors.accent500 }} />
                <span style={{ color: colors.neutral400 }}>
                  Issued {issuedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {certification.credentialUrl && (
        <FullscreenImageViewer
          open={openPreview}
          imageUrl={certification.credentialUrl}
          alt={certification.title}
          onClose={() => setOpenPreview(false)}
        />
      )}
    </>
  );
};

export default memo(CertificationCard);