import { BaseToast, ToastStatus } from "_components/custom/toast";

export const handleApiError = (response: {
  status: number;
  message: string;
}) => {
  const statusCode = response?.status || 500;
  const defaultMessage =
    "Une erreur de connexion est survenue. Veuillez vérifier votre réseau et réessayer.";

  let description = "";
  let toastStatus: ToastStatus = ToastStatus.ERROR;
  const title = "Notification";

  switch (statusCode) {
    case 400:
      description =
        response?.message ||
        "La requête envoyée est invalide. Veuillez vérifier les informations saisies.";
      toastStatus = ToastStatus.WARNING;
      break;
    case 401:
      description =
        response?.message ||
        "Votre session a expiré ou vos identifiants sont incorrects. Veuillez vous reconnecter.";
      toastStatus = ToastStatus.ERROR;
      break;
    case 403:
      description =
        response?.message ||
        "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez contacter un administrateur.";
      toastStatus = ToastStatus.WARNING;
      break;
    case 404:
      description =
        response?.message ||
        "La ressource demandée est introuvable. Elle a peut-être été déplacée ou supprimée.";
      toastStatus = ToastStatus.INFO;
      break;
    case 500:
      description =
        response?.message ||
        "Une erreur inattendue s'est produite. Veuillez réessayer dans quelques instants.";
      toastStatus = ToastStatus.ERROR;
      break;
    default:
      description = response?.message || defaultMessage;
      toastStatus = ToastStatus.ERROR;
      break;
  }

  BaseToast({
    title,
    description,
    type: toastStatus,
  });
};
