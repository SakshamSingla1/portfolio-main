import React, { memo, useMemo, useState } from "react";
import { useColors } from "../../../utils/theme";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ReadMoreTextProps {
  text: string;
  limit?: number;
  mobileLimit?: number;
  className?: string;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text,
  limit = 160,
  mobileLimit = 120,
  className = "",
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const charLimit = isMobile ? mobileLimit : limit;

  const shouldTruncate = text.length > charLimit;

  const displayText = useMemo(() => {
    if (!shouldTruncate || expanded) return text;
    return text.slice(0, charLimit).trim() + "…";
  }, [text, expanded, shouldTruncate, charLimit]);

  return (
    <p
      className={`text-sm leading-relaxed ${className}`}
      style={{ color: colors.neutral200 }}
    >
      {displayText}

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="ml-1 inline text-xs font-medium"
          style={{ color: colors.accent400 }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};

export default memo(ReadMoreText);
