import React, { memo, useMemo } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseStyles } from "react-jss";

import { useColors, gradients, shadows } from "../../../utils/theme";

interface ButtonV2Props {
  label: string;
  variant?:
    | "primaryContained"
    | "primaryOutlined"
    | "secondaryContained"
    | "ghost"
    | "danger";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const useStyles = createUseStyles({
  root: {
    borderRadius: "18px",
    labelTransform: "none",
    fontWeight: 600,
    letterSpacing: "0.4px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },

  small: {
    padding: "6px 16px",
    fontSize: "13px",
    borderRadius: "14px",
  },

  medium: {
    padding: "10px 24px",
    fontSize: "14px",
  },

  large: {
    padding: "14px 30px",
    fontSize: "16px",
    borderRadius: "22px",
  },
});

const ButtonV2: React.FC<ButtonV2Props> = memo(
  ({
    label,
    variant = "primaryContained",
    size = "medium",
    onClick,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
  }) => {
    const colors = useColors();

    const g = useMemo(() => gradients(colors), [colors]);
    const s = useMemo(() => shadows(colors), [colors]);

    const classes = useStyles();

    /* ================= VARIANT STYLES ================= */

    const variantStyle = useMemo(() => {
      switch (variant) {
        case "primaryContained":
          return {
            background: g.ctaGradient,
            color: colors.neutral50,
            boxShadow: s.soft,
            border: "none",

            "&:hover": {
              boxShadow: s.medium,
              transform: "translateY(-2px)",
            },
          };

        case "primaryOutlined":
          return {
            background: "transparent",
            color: colors.accent500,
            border: `2px solid ${colors.accent500}`,
            boxShadow: "none",

            "&:hover": {
              background: colors.accent50,
              boxShadow: g.hoverGlowSoft,
            },
          };

        case "secondaryContained":
          return {
            background: `linear-gradient(135deg, ${colors.secondary500}, ${colors.accent500})`,
            color: colors.neutral50,
            boxShadow: s.soft,

            "&:hover": {
              boxShadow: s.medium,
              transform: "translateY(-2px)",
            },
          };

        case "ghost":
          return {
            background: "transparent",
            color: colors.neutral800,
            border: `1px solid ${colors.neutral300}`,

            "&:hover": {
              background: colors.neutral100,
              boxShadow: g.hoverGlowInset,
            },
          };

        case "danger":
          return {
            background: `linear-gradient(135deg, ${colors.error500}, ${colors.error700})`,
            color: colors.neutral50,
            boxShadow: `0 20px 50px -25px ${colors.error400}66`,

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 30px 70px -20px ${colors.error500}77`,
            },
          };

        default:
          return {};
      }
    }, [variant, colors, g, s]);

    return (
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        className={`${classes.root} ${classes[size]}`}
        style={variantStyle}
      >
        {loading ? (
          <CircularProgress size={20} style={{ color: colors.neutral50 }} />
        ) : (
          <>
            {leftIcon}
            {label}
            {rightIcon}
          </>
        )}
      </Button>
    );
  }
);

export default ButtonV2;