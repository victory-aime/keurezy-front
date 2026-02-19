import { toaster } from "_components/ui/toaster";
import { ToastStatus, DEFAULT_TIME, ToastProps } from "./interface/toats";

interface CustomToastProps extends ToastProps {
  id?: string;
  persist?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  showStatus?: {
    success?: boolean;
    error?: boolean;
  };
  asPromise?: {
    promise: Promise<any>;
    config?: {
      loading?: ToastProps;
      success?: ToastProps;
      error?: ToastProps;
      loader?: () => void;
    };
  };
}

export const CustomToast = ({
  id,
  title = "Notification",
  type = ToastStatus.SUCCESS,
  description,
  duration,
  persist,
  action,
  asPromise,
  showStatus,
}: CustomToastProps) => {
  const showSuccess = showStatus?.success ?? true;
  const showError = showStatus?.error;

  if (asPromise) {
    return toaster.promise(asPromise.promise, {
      loading: {
        title: asPromise.config?.loading?.title || "Loading...",
        description: asPromise.config?.loading?.description || null,
      },
      success: showSuccess
        ? {
            title: asPromise.config?.success?.title || null,
            description: asPromise.config?.success?.description || null,
          }
        : undefined,
      error: showError
        ? {
            title: asPromise.config?.error?.title || null,
            description: asPromise.config?.error?.description || null,
          }
        : undefined,
      finally: () => {
        asPromise.config?.loader?.();
      },
    });
  }

  return toaster?.create({
    id,
    title,
    description,
    type,
    duration: persist ? Number.MAX_SAFE_INTEGER : (duration ?? DEFAULT_TIME),
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    meta: {
      closable: true,
    },
  });
};
