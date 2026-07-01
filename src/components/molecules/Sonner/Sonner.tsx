import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useColors } from "../../../utils/theme";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const colors = useColors();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: colors.neutral900,
          color: colors.neutral50,
          border: `1px solid ${colors.neutral700}`,
        },
        classNames: {
          toast:
            "group toast rounded-lg shadow-lg flex items-center gap-3 px-4 py-3",

          description: "text-sm opacity-80",

          actionButton:
            "px-3 py-1.5 rounded-md text-sm font-medium",
          
          cancelButton:
            "px-3 py-1.5 rounded-md text-sm font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };