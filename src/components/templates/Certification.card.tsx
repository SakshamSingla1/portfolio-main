import React, { memo, useState } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
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

  return (
    <>
      <div className="relative rounded-3xl p-[1px]">
        <div
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{ background: g.cardBorderGradient }}
        />

        <div
          className="relative rounded-3xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: colors.neutral900,
            boxShadow: g.hoverGlowSoft,
          }}
        >
          {certification.credentialUrl && (
            <div
              onClick={() => setOpenPreview(true)}
              className="relative px-4 pt-4 cursor-pointer"
            >
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
                  className="w-full h-40 object-cover"
                />

                <div
                  className="absolute top-3 left-3 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.neutral900}DD`,
                    color: colors.accent400,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <FiCheckCircle size={12} />
                  Certified
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex flex-col ${
              isMobile ? "p-5 gap-3" : "p-6 gap-4"
            }`}
          >
            <ReadMoreText
              text={certification.title}
              limit={70}
              mobileLimit={46}
              className="font-semibold text-base"
            />

            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center gap-2">
                <FiAward size={14} style={{ color: colors.accent400 }} />
                <span style={{ color: colors.neutral400 }}>
                  {certification.issuer}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <FiCalendar size={13} style={{ color: colors.accent500 }} />
                <span style={{ color: colors.neutral300 }}>
                  Issued {certification.issueDate}
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
