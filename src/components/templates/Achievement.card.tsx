import React, { memo, useMemo, useState } from "react";
import { FiAward, FiCalendar } from "react-icons/fi";
import { useColors, gradients } from "../../utils/theme";
import { type Achievement } from "../../utils/types";
import { useIsMobile } from "../../hooks/useIsMobile";
import ReadMoreText from "../atoms/ReadMoreText/ReadMoreText";
import FullscreenImageViewer from "../atoms/FullScreenImagePreviewer/FullScreenImagePreviewer";

interface AchievementProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementProps> = ({ achievement }) => {
  const colors = useColors();
  const g = gradients(colors);
  const isMobile = useIsMobile();
  const [openPreview, setOpenPreview] = useState(false);

  const issuedAt = useMemo(
    () =>
      achievement.achievedAt
        ? new Date(achievement.achievedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    [achievement.achievedAt]
  );

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
          {achievement.proofUrl && (
            <div
              onClick={() => setOpenPreview(true)}
              className="relative px-5 pt-5 cursor-pointer group"
            >
              <div
                className="relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  backgroundColor: colors.neutral800,
                  border: `1px solid ${colors.accent500}22`,
                }}
              >
                <img
                  src={achievement.proofUrl}
                  alt={achievement.title}
                  className="w-full h-44 object-cover"
                />

                <div
                  className="absolute top-4 left-4 flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.neutral900}DD`,
                    color: colors.accent400,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <FiAward size={13} />
                  Achievement
                </div>
              </div>
            </div>
          )}

          <div className={`flex flex-col ${isMobile ? "p-6 gap-4" : "p-8 gap-5"}`}>
            {/* Bigger Title */}
            <ReadMoreText
              text={achievement.title}
              limit={90}
              mobileLimit={60}
              className="font-semibold text-lg leading-7"
            />

            <div className="flex flex-col gap-2 text-base">
              <div className="flex items-center gap-2">
                <FiAward size={16} style={{ color: colors.accent400 }} />
                <span style={{ color: colors.neutral300 }}>
                  {achievement.issuer}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FiCalendar size={15} style={{ color: colors.accent500 }} />
                <span style={{ color: colors.neutral400 }}>
                  Achieved {issuedAt}
                </span>
              </div>
            </div>

            {achievement.description && (
              <div
                className="rounded-2xl p-5 text-base leading-7"
                style={{
                  backgroundColor: colors.neutral800,
                  border: `1px solid ${colors.accent500}33`,
                }}
              >
                <ReadMoreText
                  text={achievement.description}
                  limit={220}
                  mobileLimit={160}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {achievement.proofUrl && (
        <FullscreenImageViewer
          open={openPreview}
          imageUrl={achievement.proofUrl}
          alt={achievement.title}
          onClose={() => setOpenPreview(false)}
        />
      )}
    </>
  );
};

export default memo(AchievementCard);