import React, { type ReactNode } from "react";
import MuiAccordion, { type AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { FaChevronDown } from "react-icons/fa";
import { styled } from "@mui/system";
import { useColors, gradients } from "../../../utils/theme";

/* ---------- Types ---------- */

interface CustomAccordionProps {
  index: number;
  expanded: number[];
  component: ReactNode;
  heading: string;
  onChange: (index: number) => void;
  showStatus?: boolean;
  isFilled?: boolean;
}

/* ---------- Styled Components ---------- */

const StyledAccordion = styled(
  (props: AccordionProps & {
    colors: any;
    g: ReturnType<typeof gradients>;
    expandedProp: boolean;
  }) => {
    const { colors, g, expandedProp, ...rest } = props;
    return <MuiAccordion disableGutters elevation={0} square {...rest} />;
  }
)(({ colors, g, expandedProp }) => ({
  borderRadius: 14,
  marginBottom: 12,
  overflow: "hidden",

  backgroundImage: `
    linear-gradient(${colors.neutral900}, ${colors.neutral900}),
    ${g.cardBorderGradient}
  `,
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
  border: "1px solid transparent",

  /* 🔥 only animate shadow, nothing else */
  transition: "box-shadow 180ms ease-out",

  "::before": { display: "none" },

  /* apply glow only AFTER expanded */
  boxShadow: expandedProp ? g.hoverGlowSoft : "none",
}));

const StyledSummary = styled(MuiAccordionSummary)<{
  colors: any;
}>(({ colors }) => ({
  minHeight: 52,
  padding: "0 20px",
  flexDirection: "row-reverse",
  backgroundColor: colors.neutral900,

  "&:hover": {
    backgroundColor: colors.neutral800,
  },

  "& .MuiAccordionSummary-content": {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },

  /* 🔥 CHEVRON ONLY COLOR (no bg, no gradient) */
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: colors.accent400,
    transition: "transform 200ms ease",
  },

  "&.Mui-expanded .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(180deg)",
  },
}));

const StyledDetails = styled(MuiAccordionDetails)<{
  colors: any;
}>(({ colors }) => ({
  padding: 20,
  backgroundColor: colors.neutral900,
  borderTop: `1px solid ${colors.neutral800}`,

  /* 🚀 smoother content appearance */
  animation: "fadeIn 180ms ease-out",

  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-4px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

/* ---------- Component ---------- */

export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  index,
  expanded,
  component,
  heading,
  onChange,
  showStatus = false,
  isFilled = false,
}) => {
  const colors = useColors();
  const g = gradients(colors);

  const isExpanded = expanded.includes(index);

  return (
    <StyledAccordion
      expanded={isExpanded}
      expandedProp={isExpanded}
      onChange={() => onChange(index)}
      colors={colors}
      g={g}
      /* 🔥 force fast collapse timing */
      TransitionProps={{ timeout: 180 }}
    >
      <StyledSummary
        colors={colors}
        expandIcon={<FaChevronDown size={14} />}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: colors.neutral50,
            }}
          >
            {heading}
          </span>

          {showStatus && (
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 6,
                backgroundColor: isFilled
                  ? colors.success700
                  : colors.neutral800,
                border: `1px solid ${
                  isFilled ? colors.success800 : colors.neutral700
                }`,
                color: isFilled ? colors.success50 : colors.neutral400,
              }}
            >
              {isFilled ? "Filled" : "Empty"}
            </span>
          )}
        </div>
      </StyledSummary>

      <StyledDetails colors={colors}>{component}</StyledDetails>
    </StyledAccordion>
  );
};
