import { MODELS } from "_types/*";
import { BaseApi } from "rise-core-frontend";

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

  acceptInvitation(token: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.ACCEPT_INVITATION,
      {},
      { params: { token } },
    );
  }

  cancelInvitation(inviteId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INVITATION.CANCEL_INVITATION,
      {},
      { params: { inviteId } },
    );
  }
}
