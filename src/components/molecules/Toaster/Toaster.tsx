import { useToast } from "../../../hooks/useToast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./Toast";
import { useColors } from "../../../utils/theme";

export function Toaster() {
  const { toasts } = useToast();
  const colors = useColors();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          style={{
            background: colors.neutral900,
            color: colors.neutral50,
            border: `1px solid ${colors.neutral700}`,
          }}
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle
                style={{ color: colors.neutral50 }}
              >
                {title}
              </ToastTitle>
            )}

            {description && (
              <ToastDescription
                style={{ color: colors.neutral400 }}
              >
                {description}
              </ToastDescription>
            )}
          </div>

          {action}

          <ToastClose
            style={{ color: colors.neutral400 }}
          />
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
}