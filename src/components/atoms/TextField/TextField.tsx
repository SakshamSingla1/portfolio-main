import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/system";
import { useColors, gradients } from "../../../utils/theme";

const StyledTextField = styled(MuiTextField)<{
  colors: any;
  g: ReturnType<typeof gradients>;
}>(({ colors, g }) => ({
  width: "100%",

  "& .MuiInputBase-root": {
    borderRadius: 12,
    fontSize: 15,
    border: "1px solid transparent",
    backgroundImage: `
      linear-gradient(${colors.neutral900}, ${colors.neutral900}),
      ${g.cardBorderGradient}
    `,
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition:
      "box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",

    "&:hover": {
      boxShadow: g.hoverGlowSoft,
    },

    "&.Mui-focused": {
      boxShadow: g.hoverGlowMedium,
    },

    "&.Mui-disabled": {
      backgroundImage: "none",
      backgroundColor: colors.neutral800,
      border: `1px solid ${colors.neutral700}`,
      color: colors.neutral500,
      cursor: "not-allowed",
    },

    "& input, & textarea": {
      padding: "14px 14px",
      color: colors.neutral50,
      fontSize: 15,

      "&::placeholder": {
        color: colors.neutral400,
        opacity: 1,
      },

      "&:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 1000px ${colors.neutral900} inset`,
        WebkitTextFillColor: colors.neutral50,
      },
    },
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "& .Mui-error .MuiInputBase-root": {
    backgroundImage: "none",
    backgroundColor: colors.neutral900,
    border: `1px solid ${colors.error500}`,
    boxShadow: `0 0 0 3px ${colors.error500}33`,
  },
}));

interface Props extends Omit<TextFieldProps, "label" | "helperText" | "error"> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

const TextField: React.FC<Props> = ({
  label,
  helperText,
  error,
  InputProps,
  ...props
}) => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          style={{
            color: colors.neutral400,
            fontSize: 13,
            fontWeight: 500,
            marginLeft: 10,
          }}
        >
          {label}
        </label>
      )}

      <StyledTextField
        {...props}
        colors={colors}
        g={g}
        label=""
        error={error}
        helperText={null}
        InputProps={{
          ...InputProps,
          readOnly: InputProps?.readOnly,
        }}
      />

      {error && helperText && (
        <span
          style={{
            fontSize: 12,
            marginLeft: 10,
            color: colors.error400,
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;
