import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useColors } from "../../../utils/theme";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = "", sideOffset = 4, ...props }, ref) => {
  const colors = useColors();

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md ${className}`}
      style={{
        background: colors.neutral900,
        color: colors.neutral50,
        border: `1px solid ${colors.neutral700}`,
      }}
      {...props}
    />
  );
});

TooltipContent.displayName = "TooltipContent";