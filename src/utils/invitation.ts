/** États d'une invitation qu'on ne peut pas accepter, avec leur message (écran d'erreur). */
export type InvitationErrorState = 'expired' | 'used' | 'notFound' | 'unknown';

export const INVITATION_ERROR_COPY: Record<InvitationErrorState, { title: string; text: string }> =
  {
    expired: {
      title: 'Cette invitation a expiré',
      text: 'Demandez à l’administrateur de votre agence de vous la renvoyer.',
    },
    used: {
      title: 'Cette invitation a déjà été utilisée ou annulée',
      text: 'Si vous avez déjà rejoint l’équipe, connectez-vous. Sinon, contactez votre agence.',
    },
    notFound: {
      title: 'Invitation introuvable',
      text: 'Vérifiez le lien reçu par e-mail ou contactez votre agence.',
    },
    unknown: {
      title: 'Impossible d’ouvrir cette invitation',
      text: 'Réessayez dans un instant. Si le problème persiste, contactez votre agence.',
    },
  };

/** Code d'erreur du backend (`errorCode`) → état d'écran. */
export function invitationErrorState(errorCode?: string): InvitationErrorState {
  switch (errorCode) {
    case 'INVITATION_EXPIRED':
      return 'expired';
    case 'INVITATION_ALREADY_USED_OR_CANCELLED':
      return 'used';
    case 'INVITATION_NOT_FOUND':
      return 'notFound';
    default:
      return 'unknown';
  }
}

/** Codes d'erreur de l'acceptation qui concernent le code saisi (affichés sous les cases). */
export const INVITATION_CODE_ERRORS = [
  'INVITATION_CODE_INVALID',
  'INVITATION_CODE_EXPIRED',
  'INVITATION_CODE_LOCKED',
];
