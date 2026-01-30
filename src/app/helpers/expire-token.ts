export function isExpired(expiresAt: string | Date): boolean {
  const expirationDate =
    typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;

  return new Date() >= expirationDate;
}
