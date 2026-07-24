import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useColors } from "../../../utils/theme";

interface ReadMoreTextProps {
  text?: string;
  limit?: number;
  mobileLimit?: number;
  className?: string;
}

export const ReadMoreText: React.FC<ReadMoreTextProps> = ({
  text = "",
  limit = 100,
  mobileLimit = 200,
  className = "",
}) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  const textLimit = isMobile ? mobileLimit : limit;
  const cleanText = DOMPurify.sanitize(text ?? '');

  // Only used to decide whether a "Read More" toggle is needed at all — the collapsed view
  // itself renders the full cleanText and visually clips it with line-clamp (below), rather
  // than truncating the HTML string on a character count, which used to strip all markup
  // (bullets, bold, paragraphs) down to a single flattened <p> of plain text.
  const plainTextLength = useMemo(() => {
    const div = document.createElement("div");
    div.innerHTML = cleanText;
    return (div.textContent || div.innerText || "").length;
  }, [cleanText]);

  const shouldTrim = plainTextLength > textLimit;
  const approxLineCount = Math.max(2, Math.ceil(textLimit / 60));

  return (
    <div
      className={className}
      style={{
        color: colors.neutral200,
        fontSize: "14px",
        lineHeight: "1.7",
      }}
    >
      <motion.div
        layout
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={
          !expanded && shouldTrim
            ? {
                display: "-webkit-box",
                WebkitLineClamp: approxLineCount,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
        dangerouslySetInnerHTML={{ __html: cleanText }}
      />

      {shouldTrim && (
        <motion.div
          onClick={() => setExpanded((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260 }}
          style={{
            marginTop: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            color: colors.accent400,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {expanded ? "Read Less" : "Read More"}

          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            ▼
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default ReadMoreText;