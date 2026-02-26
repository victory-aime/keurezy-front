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

interface BaseToastProps extends ToastProps {
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

export type { ToastProps, BaseToastProps };
