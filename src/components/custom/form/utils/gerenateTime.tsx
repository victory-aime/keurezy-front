export const generateTimeOptions = (locale: string = 'fr') => {
  const options: { value: string; label: string }[] = [];

  const start = 8 * 60;
  const end = 18 * 60;

  for (let minutes = start; minutes <= end; minutes += 15) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const label = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(2026, 0, 1, hours, mins));

    const value = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    options.push({
      value,
      label,
    });
  }

  return options;
};

export const getCurrentTime = () => {
  const now = new Date();

  const rounded = Math.round(now.getMinutes() / 15) * 15;

  now.setMinutes(rounded);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const normalizeToDate = (value: any): Date | null => {
  if (!value) return null;

  // ISO string
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  // Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // DatePicker object
  if (value?.year && value?.month && value?.day) {
    const d = new Date(value.year, value.month - 1, value.day);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
};

export const mergeDateAndTime = (date: any, time: string) => {
  const base = normalizeToDate(date);

  if (!base) {
    throw new Error('Invalid date provided to mergeDateAndTime');
  }

  const [hours, minutes] = time.split(':').map(Number);

  const merged = new Date(base);
  merged.setHours(hours || 0);
  merged.setMinutes(minutes || 0);
  merged.setSeconds(0);
  merged.setMilliseconds(0);

  return merged.toISOString();
};

export const extractTime = (iso?: string | null) => {
  if (!iso) return '';

  const date = new Date(iso);

  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const timeToMinutes = (t?: string) => {
  if (!t) return NaN;

  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
