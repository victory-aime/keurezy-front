import { ColorPalette } from '@chakra-ui/react';
import { Icons } from '_components/custom';
import { ENUM } from '_types/*';

export const notificationUIConfig: Record<
  ENUM.NotificationType,
  {
    title: string;
    icon: keyof typeof Icons;
    color: ColorPalette;
  }
> = {
  VISIT: {
    title: 'Nouvelle visite',
    icon: 'Home',
    color: 'purple',
  },
  LEAD: {
    title: 'Nouvelle demande',
    icon: 'Home',
    color: 'blue',
  },
  MESSAGE: {
    title: 'Nouveau message',
    icon: 'Chat',
    color: 'teal',
  },
  PAYMENT: {
    title: 'Paiement reçu',
    icon: 'CreditCard',
    color: 'green',
  },
  MAINTENANCE: {
    title: 'Maintenance',
    icon: 'Wrench',
    color: 'orange',
  },
  TICKET: {
    title: 'Reclamation',
    icon: 'Wrench',
    color: 'yellow',
  },
  SYSTEM: {
    title: 'Notification système',
    icon: 'BellOff',
    color: 'cyan',
  },
};
