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
  BOOKING: {
    title: 'Réservation',
    icon: 'Calendar',
    color: 'teal',
  },
  VISIT: {
    title: 'Nouvelle visite',
    icon: 'Calendar',
    color: 'purple',
  },
  LEAD: {
    title: 'Nouvelle demande',
    icon: 'Request',
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

/** Configuration d'affichage d'un type ; un type inconnu (nouveau côté API) retombe sur SYSTEM. */
export const getNotificationUIConfig = (type?: ENUM.NotificationType) =>
  (type && notificationUIConfig[type]) || notificationUIConfig.SYSTEM;
