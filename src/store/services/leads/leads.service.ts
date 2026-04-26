import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * LeadsService provides methods for handling application-related operations
 * such as fetching all leads and creating a new application through API endpoints.
 */
export class LeadsService extends BaseApi {
  createLeadsRequest(data: MODELS.ILeadsRequest) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().LEADS.CREATE, data);
  }
  assignLeads(data: MODELS.IAssignAgentLeads) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().LEADS.ASSIGN, data);
  }
  deleteLeads(data: MODELS.ILeadsRequest) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().LEADS.DELETE, data);
  }

  agencyLeadsList(params: MODELS.IAgencyFilters) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().LEADS.AGENCY_LEADS_LIST,
      {},
      { params },
    );
  }
  userLeadsList(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().LEADS.USER_LEADS_LIST,
      {},
      { params: { userId } },
    );
  }
}
