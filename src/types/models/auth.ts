export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IAuthSession {
  expiresAt: string | undefined;
  token: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | undefined;
  userAgent: string | undefined;
  id: string | undefined;
  userId: string | undefined;
  permissions: {
    name: string;
    feature: string;
    category: string;
  }[];
}

/** Récupération de compte (2FA perdue), étape 1. */
export interface ITwoFactorRecoveryRequest {
  email: string;
  password: string;
}

/** Étape 2 : mêmes identifiants et code reçu par e-mail. */
export interface ITwoFactorRecoveryConfirm extends ITwoFactorRecoveryRequest {
  code: string;
}

/** Code envoyé : validité et délai avant renvoi, en secondes. */
export interface IOneTimeCodeSent {
  expiresIn: number;
  retryIn: number;
}
