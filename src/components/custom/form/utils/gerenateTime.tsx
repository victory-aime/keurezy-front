export const generateTimeOptions = (locale: string = 'fr') => {
  const options: { value: string; label: string }[] = [];
  const start = 8 * 60;
  const end = 21 * 60;

  for (let minutes = start; minutes <= end; minutes += 15) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const value = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    const label = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(0, 0, 0, hours, mins));

    options.push({ value, label });
  }

  return options;
};
