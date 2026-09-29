/**
 * Message affiché sous le champ de code 2FA (TOTP ou code de secours) selon le statut HTTP
 * renvoyé par Better Auth. Partagé par l'activation et la connexion.
 */
export function totpErrorMessage(status?: number): string {
  if (status === 400 || status === 401) return 'Code invalide ou expiré';
  if (status === 429) return 'Trop de tentatives, réessayez dans un instant';
  return 'Une erreur est survenue, réessayez';
}
