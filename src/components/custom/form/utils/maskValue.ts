export const maskValue = (
  value: string,
  visibleStart = 2,
  maskChar = "*",
): string => {
  if (!value) return "";

  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const start = local.slice(0, visibleStart);
    const masked = maskChar.repeat(Math.max(local.length - visibleStart, 0));
    return `${start}${masked}@${domain}`;
  }

  const start = value.slice(0, visibleStart);
  const masked = maskChar.repeat(Math.max(value.length - visibleStart, 0));
  return `${start}${masked}`;
};
