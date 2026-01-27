import { toaster } from "_components/ui/toaster";
import { ToastStatus, DEFAULT_TIME, ToastProps } from "./interface/toats";

interface CustomToastProps extends ToastProps {
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
  title = "Notification",
  type = ToastStatus.SUCCESS,
  description,
  duration,
  asPromise,
}: CustomToastProps) => {
  if (asPromise) {
    return toaster.promise(asPromise.promise, {
      loading: {
        title: asPromise.config?.loading?.title || "Loading...",
        description: asPromise.config?.loading?.description || "",
      },
      success: {
        title: asPromise.config?.success?.title || "Success",
        description: asPromise.config?.success?.description || "",
      },
      error: {
        title: asPromise.config?.error?.title || "Errorr",
        description: asPromise.config?.error?.description || "",
      },
      finally: () => {
        asPromise.config?.loader?.();
      },
    });
  }
  return toaster.create({
    title,
    description,
    type,
    duration: duration ?? DEFAULT_TIME,
    meta: {
      closable: true,
    },
  });
};
