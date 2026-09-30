/**
 * Message affiché sous le champ de code 2FA (TOTP ou code de secours) selon le statut HTTP
 * renvoyé par Better Auth. Partagé par l'activation et la connexion.
 */
export function totpErrorMessage(status?: number): string {
  if (status === 400 || status === 401) return 'Code invalide ou expiré';
  if (status === 429) return 'Trop de tentatives, réessayez dans un instant';
  return 'Une erreur est survenue, réessayez';
}

/** Code de secours Better Auth : 10 caractères alphanumériques, affichés `xxxxx-xxxxx`. */
export const BACKUP_LENGTH = 10;
export const BACKUP_SPLIT = 5;

/** Cases saisies → code au format stocké par Better Auth (`ycCnP-aU7hc`), casse conservée. */
export const toBackupCode = (chars: string[]) =>
  `${chars.slice(0, BACKUP_SPLIT).join('')}-${chars.slice(BACKUP_SPLIT).join('')}`;
