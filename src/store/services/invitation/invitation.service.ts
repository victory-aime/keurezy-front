import { MODELS } from '_types/*';
import { BaseApi } from 'rise-core-frontend';

export class InvitationService extends BaseApi {
  getAllInvitationsByAgency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.ALL_INVITATIONS_AGENCY,
      {},
      { params: { agencyId } },
    );
  }

  createInvitation(data: MODELS.ICreateInvitation) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.CREATE_INVITATION,
      data,
    );
  }

  /** Aperçu en lecture seule (lien d'invitation) : agence, rôle, permissions, e-mail masqué. */
  previewInvitation(token: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.PREVIEW_INVITATION,
      {},
      { params: { token } },
    );
  }

  /** Envoie le code de confirmation à l'adresse invitée. */
  sendInvitationCode(token: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.SEND_INVITATION_CODE,
      { token },
    );
  }

  /** Acceptation : code reçu et mot de passe choisi ; renvoie l'e-mail du compte, jamais de secret. */
  acceptInvitation(data: MODELS.IAcceptInvitation) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.ACCEPT_INVITATION,
      data,
    );
  }

  cancelInvitation(inviteId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.CANCEL_INVITATION,
      {},
      { params: { inviteId } },
    );
  }

  /** Renvoie une invitation en attente avec un nouveau mot de passe temporaire. */
  resendInvitation(inviteId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.RESEND_INVITATION,
      {},
      { params: { inviteId } },
    );
  }
}
