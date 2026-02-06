import React, { memo, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useColors, gradients } from "../../../utils/theme";

interface FullscreenImageViewerProps {
  open: boolean;
  imageUrl: string;
  alt?: string;
  onClose: () => void;
}

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  open,
  imageUrl,
  alt = "Preview",
  onClose,
}) => {
  const colors = useColors();
  const g = gradients(colors);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-5 right-5 rounded-full p-2 transition"
        style={{
          background: colors.accent50,
          color: colors.accent500,
          boxShadow: g.hoverGlowSoft,
        }}
      >
        <FiX size={22} />
      </button>
      <div
        onClick={e => e.stopPropagation()}
        className="relative rounded-3xl p-[1px]"
        style={{ background: g.cardBorderGradient }}
      >
        <div
          className="rounded-3xl p-3"
          style={{
            backgroundColor: colors.neutral900,
          }}
        >
          <img
            src={imageUrl}
            alt={alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(FullscreenImageViewer);
