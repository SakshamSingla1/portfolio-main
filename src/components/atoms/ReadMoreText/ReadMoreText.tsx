import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const plainText = useMemo(() => {
    const div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || div.innerText || "";
  }, [text]);

  const shouldTrim = plainText.length > textLimit;

  const trimmedText = useMemo(() => {
    if (!shouldTrim) return text;
    const trimmed = plainText.slice(0, textLimit) + "...";
    return `<p>${trimmed}</p>`;
  }, [text, plainText, textLimit, shouldTrim]);

  return (
    <div
      className={className}
      style={{
        color: colors.neutral200,
        fontSize: "14px",
        lineHeight: "1.7",
      }}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: trimmedText }}
          />
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
      </AnimatePresence>

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