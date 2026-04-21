import { createListCollection } from '@chakra-ui/react';

export function getTimeZones(): { label: string; value: string }[] {
  const timeZones = Intl.supportedValuesOf?.('timeZone') ?? [];

  return timeZones.map((tz) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const formatted = formatter.format(now);
    return {
      label: `${tz} (${formatted})`,
      value: tz,
    };
  });
}

export const selectTimeZones = () => {
  const timeZones = Intl.supportedValuesOf?.('timeZone') ?? [];

  const items = timeZones.map((tz) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const formatted = formatter.format(now);
    return {
      label: `${tz} (${formatted})`,
      value: tz,
    };
  });

  return createListCollection({ items });
};
