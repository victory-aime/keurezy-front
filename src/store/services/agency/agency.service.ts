import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * AgencyService provides methods for handling agency-related operations
 * such as fetching all agency and creating a new agency through API endpoints.
 */
export class AgencyService extends BaseApi {
  agency_info(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.AGENCY_INFO,
      {},
      { params: { agencyId } },
    );
  }
  agency_subscription_info(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.AGENCY_SUBSCRIPTION_INFO,
      {},
      { params: { agencyId } },
    );
  }
  create_agency(data: MODELS.ICreateAgency | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CREATE_AGENCY,
      data,
    );
  }
  update_agency(data: MODELS.IUpdateAgency | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.UPDATE_AGENCY,
      data,
    );
  }
  close_agency(data: MODELS.ICloseAgency) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CLOSE_AGENCY,
      {},
      {
        params: { agencyId: data.agencyId },
      },
    );
  }
  /** Annule la fermeture programmée (owner uniquement). */
  cancel_close(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CANCEL_CLOSE,
      {},
      { params: { agencyId } },
    );
  }
  /** Ce que la fermeture de l'agence entraîne (owner uniquement). */
  close_impact(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CLOSE_IMPACT,
      {},
      { params: { agencyId } },
    );
  }
  check_name(name: string) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().AGENCY.CHECK_NAME, {
      name,
    });
  }

  stats_agency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.STATS,
      {},
      {
        params: { agencyId },
      },
    );
  }
}
