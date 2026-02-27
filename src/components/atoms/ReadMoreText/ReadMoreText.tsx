import React, { memo, useMemo, useState } from "react";
import { useColors } from "../../../utils/theme";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface ReadMoreTextProps {
  text?: string;
  limit?: number;
  mobileLimit?: number;
  className?: string;
}

// ✅ Decode HTML entities first
const decodeHtml = (html: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
};

// ✅ Then remove HTML tags
const stripHtml = (html: string) => {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text = "",
  limit = 300,
  mobileLimit = 180,
  className = "",
}) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const charLimit = isMobile ? mobileLimit : limit;

  const plainText = useMemo(() => {
    if (!text) return "";

    const decoded = decodeHtml(text);   // Step 1
    return stripHtml(decoded);          // Step 2
  }, [text]);

  const shouldTruncate = plainText.length > charLimit;

  const displayText =
    expanded || !shouldTruncate
      ? plainText
      : plainText.slice(0, charLimit).trim() + "...";

  if (!plainText) return null;

  return (
    <div
      className={`text-sm leading-relaxed ${className}`}
      style={{ color: colors.neutral200 }}
    >
      {displayText}

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-2 text-xs font-semibold hover:underline cursor-pointer transition-colors duration-200"
          style={{ color: colors.accent400 }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default memo(ReadMoreText);