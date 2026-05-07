import { HStack } from '@chakra-ui/react';
import { Icons } from '_components/custom/icons';
import { ViewDefinition } from '../interface/agenda';

export type AppointmentStatus = 'planned' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentPriority = 'low' | 'normal' | 'high';

export const STATUS_META_AGENDA: Record<
  AppointmentStatus,
  {
    label: string;
    /** Chakra color token for the dot indicator */
    dotColor: string;
    /** Chakra bg token for the event chip / row background */
    chipBg: string;
    /** Chakra color token for text inside the chip */
    chipColor: string;
    /** Chakra border color token */
    chipBorderColor: string;
    /** Chakra color token for the vertical accent bar (agenda view) */
    barColor: string;
  }
> = {
  planned: {
    label: 'Planifiée',
    dotColor: 'blue.500',
    chipBg: 'blue.50',
    chipColor: 'blue.700',
    chipBorderColor: 'blue.200',
    barColor: 'blue.500',
  },
  confirmed: {
    label: 'Confirmée',
    dotColor: 'green.500',
    chipBg: 'green.50',
    chipColor: 'green.700',
    chipBorderColor: 'green.200',
    barColor: 'green.500',
  },
  completed: {
    label: 'Terminée',
    dotColor: 'gray.500',
    chipBg: 'gray.50',
    chipColor: 'gray.600',
    chipBorderColor: 'gray.200',
    barColor: 'gray.400',
  },
  cancelled: {
    label: 'Annulée',
    dotColor: 'red.500',
    chipBg: 'red.50',
    chipColor: 'red.700',
    chipBorderColor: 'red.200',
    barColor: 'red.400',
  },
};

export const AGENDA_HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8..20
export const AGENDA_SLOT_HEIGHT = 48; // px per hour
// ---------------------------------------------------------------------------
// Static data — defined once outside the component so it is never re-created
// ---------------------------------------------------------------------------

export const DEFAULT_VIEW_DEFS: ViewDefinition[] = [
  {
    value: 'month',
    label: (
      <HStack gap={1.5}>
        <Icons.Calendar size={14} />
        Mois
      </HStack>
    ),
  },
  {
    value: 'week',
    label: (
      <HStack gap={1.5}>
        <Icons.Grid size={14} />
        Semaine
      </HStack>
    ),
  },
  {
    value: 'day',
    label: (
      <HStack gap={1.5}>
        <Icons.Timer size={14} />
        Jour
      </HStack>
    ),
  },
  {
    value: 'agenda',
    label: (
      <HStack gap={1.5}>
        <Icons.List size={14} />
        Planning
      </HStack>
    ),
  },
];
