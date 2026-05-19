import { VerificationState } from './auth.types';

export function resolveState(key: string): VerificationState {
  switch (key) {
    case 'token':
      return 'loading';
    case 'TOKEN_EXPIRED':
      return 'TOKEN_EXPIRED';
    case 'INVALID_TOKEN':
      return 'INVALID_TOKEN';
    default:
      return 'loading';
  }
}
