export const parseUserAgent = (ua: string | undefined) => {
  if (!ua) return "Unknown device";

  // détecter navigateur
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/);
  const browser = browserMatch
    ? `${browserMatch[1]} ${browserMatch[2]}`
    : "Browser";

  // détecter OS
  const osMatch = ua.match(/\(([^)]+)\)/);
  const os = osMatch ? osMatch[1].split(";")[0] : "OS";

  return `${browser} sur ${os}`;
};
