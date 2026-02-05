import React, { memo } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Certification } from "../../utils/types";

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ certification }) => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <article className="relative group rounded-3xl p-[1px]">
      <div className="absolute inset-0 rounded-3xl opacity-60"
           style={{ background: g.cardBorderGradient }} />

      <div className="relative rounded-3xl p-6 flex flex-col gap-3"
           style={{ backgroundColor: colors.neutral900, boxShadow: g.hoverGlowSoft }}>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
               style={{ background: g.iconGradient }}>
            <FiCheckCircle size={20} />
          </div>

          <div>
            <h3 className="font-semibold" style={{ color: colors.neutral50 }}>
              {certification.title}
            </h3>
            <span className="text-sm" style={{ color: colors.neutral400 }}>
              {certification.issuer}
            </span>
          </div>
        </div>

        <span className="text-sm" style={{ color: colors.neutral300 }}>
          Issued: {certification.issueDate}
        </span>
      </div>
    </article>
  );
};

export default memo(CertificationCard);
