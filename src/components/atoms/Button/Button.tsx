import React, { useMemo } from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import { useColors, gradients } from "../../../utils/theme";

type CustomVariant =
  | "primaryContained"
  | "secondaryContained"
  | "tertiaryContained"
  | "primaryText"
  | "secondaryText"
  | "underlined"
  | "tertiaryText";

type CustomSize = "extraSmall" | "small" | "medium" | "large";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: CustomVariant;
  label?: React.ReactNode;
  isLoading?: boolean;
  iconButton?: React.ReactNode;
  size?: CustomSize;
  buttonWithImg?: boolean;
}

const StyledButton = styled(MuiButton)<{
  $variant: CustomVariant;
  $size: CustomSize;
  colors: any;
  g: ReturnType<typeof gradients>;
}>(({ colors, $variant, $size, g }) => ({
  textTransform: "capitalize",
  fontWeight: 500,
  lineHeight: 1,
  minWidth: "auto",
  willChange: "transform, box-shadow",

  ...({
    extraSmall: { minHeight: 32, padding: "4px 12px", fontSize: 14, borderRadius: 6 },
    small: { minHeight: 36, padding: "6px 16px", fontSize: 14, borderRadius: 6 },
    medium: { minHeight: 40, padding: "8px 20px", fontSize: 16, borderRadius: 8 },
    large: { minHeight: 48, padding: "12px 24px", fontSize: 16, borderRadius: 10 },
  }[$size]),

  ...({
    primaryContained: {
      background: g.ctaGradient,
      color: colors.neutral50,
      boxShadow: g.hoverGlowSoft,

      "&:hover:not(.Mui-disabled)": {
        boxShadow: g.hoverGlowMedium,
      },

      "&:active:not(.Mui-disabled)": {
        boxShadow: g.hoverGlowSoft,
      },
    },

    secondaryContained: {
      backgroundColor: colors.neutral50,
      color: colors.primary300,
      border: `1px solid ${colors.primary300}`,

      "&:hover:not(.Mui-disabled)": {
        boxShadow: g.hoverGlowSoft,
      },
    },

    tertiaryContained: {
      backgroundColor: colors.neutral50,
      color: colors.primary300,
      border: `1px solid ${colors.neutral200}`,

      "&:hover:not(.Mui-disabled)": {
        backgroundColor: colors.neutral100,
      },
    },

    primaryText: {
      color: colors.primary300,

      "&:hover:not(.Mui-disabled)": {
        textDecoration: "underline",
      },
    },

    secondaryText: {
      color: colors.neutral700,

      "&:hover:not(.Mui-disabled)": {
        color: colors.primary300,
      },
    },

    tertiaryText: {
      color: colors.neutral700,

      "&:hover:not(.Mui-disabled)": {
        backgroundColor: colors.neutral50,
      },
    },

    underlined: {
      color: colors.neutral700,
      textDecoration: "underline",
    },
  }[$variant]),

  "&:focus-visible": {
    outline: "none",
    boxShadow: `
      0 0 0 2px ${colors.neutral50},
      0 0 0 4px ${colors.accent400}66
    `,
  },

  "&.Mui-disabled": {
    opacity: 0.6,
    boxShadow: "none",
  },
}));

const Button: React.FC<ButtonProps> = ({
  variant = "primaryContained",
  size = "medium",
  label,
  iconButton,
  isLoading,
  buttonWithImg,
  disabled,
  ...props
}) => {
  const colors = useColors();
  const g = gradients(colors);

  const content = useMemo(() => {
    if (isLoading) return <CircularProgress size={18} color="inherit" />;
    if (buttonWithImg)
      return (
        <span className="inline-flex items-center gap-2">
          {iconButton}
          {label}
        </span>
      );
    return iconButton || label;
  }, [isLoading, buttonWithImg, iconButton, label]);

  return (
    <StyledButton
      colors={colors}
      g={g}
      $variant={variant}
      $size={size}
      variant="text"
      disableRipple
      disableElevation
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </StyledButton>
  );
};

export default Button;
