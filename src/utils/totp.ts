/**
 * Better Auth (plugin two-factor) limite les essais à deux niveaux :
 * - **par compte** : 5 échecs consécutifs verrouillent la 2FA pendant 15 minutes
 *   (`ACCOUNT_TEMPORARILY_LOCKED`, 429 ; `accountLockout` dans `lib/auth.ts` du backend) ;
 * - **par connexion** : 5 essais, et le défi 2FA expire au bout de quelques minutes
 *   (`TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE`, `INVALID_TWO_FACTOR_COOKIE`) : il faut se reconnecter.
 * Un 429 sans code vient de la limite par IP (5 par minute).
 */
export const ATTEMPTS_PER_SIGN_IN = 5;

export type TotpFailure = 'invalid' | 'challenge-expired' | 'locked' | 'rate-limited' | 'unknown';

export function totpFailureKind(status?: number, code?: string): TotpFailure {
  if (code === 'ACCOUNT_TEMPORARILY_LOCKED') return 'locked';
  if (code === 'TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE' || code === 'INVALID_TWO_FACTOR_COOKIE')
    return 'challenge-expired';
  if (status === 429) return 'rate-limited';
  if (status === 400 || status === 401) return 'invalid';
  return 'unknown';
}

/**
 * Message affiché sous le champ de code 2FA (TOTP ou code de secours) selon la réponse de
 * Better Auth. Partagé par l'activation et la connexion.
 */
export function totpErrorMessage(status?: number, code?: string): string {
  switch (totpFailureKind(status, code)) {
    case 'invalid':
      return 'Code invalide ou expiré';
    case 'challenge-expired':
      return 'Trop d’essais pour cette connexion, ou vérification expirée : reconnectez-vous';
    case 'locked':
      return 'Trop d’échecs : la vérification est bloquée 15 minutes pour protéger votre compte';
    case 'rate-limited':
      return 'Trop de tentatives, réessayez dans un instant';
    default:
      return 'Une erreur est survenue, réessayez';
  }
}

/** Code de secours Better Auth : 10 caractères alphanumériques, affichés `xxxxx-xxxxx`. */
export const BACKUP_LENGTH = 10;
export const BACKUP_SPLIT = 5;

/** Cases saisies → code au format stocké par Better Auth (`ycCnP-aU7hc`), casse conservée. */
export const toBackupCode = (chars: string[]) =>
  `${chars.slice(0, BACKUP_SPLIT).join('')}-${chars.slice(BACKUP_SPLIT).join('')}`;
