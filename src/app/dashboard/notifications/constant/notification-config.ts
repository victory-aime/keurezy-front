import { Icons, variantColorType } from '_components/custom';
import { ENUM } from '_types/*';

export const notificationUIConfig: Record<
  ENUM.NotificationType,
  {
    title: string;
    icon: keyof typeof Icons;
    /** Palette de la charte */
    color: variantColorType;
  }
> = {
  BOOKING: {
    title: 'Réservation',
    icon: 'Calendar',
    color: 'tertiary',
  },
  VISIT: {
    title: 'Nouvelle visite',
    icon: 'Calendar',
    color: 'primary',
  },
  LEAD: {
    title: 'Nouvelle demande',
    icon: 'Request',
    color: 'info',
  },
  MESSAGE: {
    title: 'Nouveau message',
    icon: 'Chat',
    color: 'tertiary',
  },
  PAYMENT: {
    title: 'Paiement reçu',
    icon: 'CreditCard',
    color: 'success',
  },
  MAINTENANCE: {
    title: 'Maintenance',
    icon: 'Wrench',
    color: 'warning',
  },
  TICKET: {
    title: 'Reclamation',
    icon: 'Wrench',
    color: 'secondary',
  },
  SYSTEM: {
    title: 'Notification système',
    icon: 'BellOff',
    color: 'neutral',
  },
};

/** Configuration d'affichage d'un type ; un type inconnu (nouveau côté API) retombe sur SYSTEM. */
export const getNotificationUIConfig = (type?: ENUM.NotificationType) =>
  (type && notificationUIConfig[type]) || notificationUIConfig.SYSTEM;
