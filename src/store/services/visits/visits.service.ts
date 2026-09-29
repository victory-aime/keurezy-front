import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/';

export class VisitsService extends BaseApi {
  getAllVisits(data: { agencyId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().VISITS.ALL_BY_AGENCY,
      {},
      { params: data },
    );
  }

  /** Clients pouvant être invités à une visite (réservation ou discussion avec l'agence). */
  getAgencyClients(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().VISITS.AGENCY_CLIENTS,
      {},
      { params: data },
    );
  }

  create_visit(payload: MODELS.IVisitPayload, data: { agencyId: string }) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().VISITS.CREATE, payload, {
      params: data,
    });
  }

  update_visit(payload: MODELS.IVisitPayload) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().VISITS.UPDATE, payload);
  }

  cancel_visit(data: { visitId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().VISITS.CANCEL_VISIT,
      {},
      {
        params: data,
      },
    );
  }
}
