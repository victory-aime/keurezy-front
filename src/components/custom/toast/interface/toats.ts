export const DEFAULT_TIME = 5000;

export enum ToastStatus {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastStatus | undefined;
  duration?: number;
}

export type { ToastProps };
