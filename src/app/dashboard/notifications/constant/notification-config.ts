import { ColorPalette } from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { ENUM } from "_types/*";

export const notificationUIConfig: Record<
  ENUM.NotificationType,
  {
    title: string;
    icon: keyof typeof Icons;
    color: ColorPalette;
  }
> = {
  REQUEST: {
    title: "Nouvelle demande",
    icon: "Home",
    color: "purple",
  },
  MESSAGE: {
    title: "Nouveau message",
    icon: "Chat",
    color: "green",
  },
  PAYMENT: {
    title: "Paiement reçu",
    icon: "CreditCard",
    color: "blue",
  },
  MAINTENANCE: {
    title: "Maintenance",
    icon: "Wrench",
    color: "orange",
  },
  SYSTEM: {
    title: "Notification système",
    icon: "BellOff",
    color: "gray",
  },
};
