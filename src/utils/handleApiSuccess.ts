import { CustomToast, ToastStatus } from "_components/custom/toast";

export const handleApiSuccess = (response: {
  status: number;
  message: string;
}) => {
  const statusCode = response?.status;
  const defaultMessage = "Connection Error";

  let description = "";
  let toastStatus: ToastStatus;
  const title = "Notification";

  switch (statusCode) {
    case 200:
      description = response?.message || "Success";
      toastStatus = ToastStatus.SUCCESS;
      break;
    case 201:
      description = response?.message || "Info";
      toastStatus = ToastStatus.INFO;
      break;
    case 204:
      description = "No content";
      toastStatus = ToastStatus.WARNING;
      break;
    default:
      description = response?.message || defaultMessage;
      toastStatus = ToastStatus.ERROR;
      break;
  }

  CustomToast({
    title,
    description,
    type: toastStatus,
  });
};
