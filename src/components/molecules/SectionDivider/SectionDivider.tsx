import { useColors, gradients } from "../../../utils/theme";

const SectionDivider = () => {
  const colors = useColors();
  const g = gradients(colors);

  return (
    <div className="relative h-24 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: g.dividerGradient, opacity: 0.3 }}
      />
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-32 h-12 blur-[60px]"
        style={{ background: colors.primary500, opacity: 0.15 }}
      />
    </div>
  );
};

export default SectionDivider;
