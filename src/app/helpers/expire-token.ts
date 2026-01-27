export default function isTokenExpiringSoon(expiresAt?: number) {
  if (!expiresAt) return true;

  const now = Math.floor(Date.now() / 1000);
  const buffer = 60;
  return expiresAt - now < buffer;
}
