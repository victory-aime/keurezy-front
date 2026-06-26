import * as Constants from './constants';
import { leadsServiceInstance } from './leads.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const agencyLeadsListQueries = (
  args: QUERIES.QueryPayload<MODELS.ILeadsAgency[], undefined, MODELS.IAgencyFilters>,
) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.IAgencyFilters, undefined, MODELS.ILeadsAgency[]>({
    queryKey: [Constants.LEAD_KEYS.AGENCY_LEADS_LIST],
    queryFn: () => leadsServiceInstance().agencyLeadsList(params as MODELS.IAgencyFilters),
    options: args.queryOptions,
  });
};

const assignAgentLeadsMutation = (args: QUERIES.MutationPayload<MODELS.IAssignAgentLeads>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.LEAD_KEYS.ASSIGN_LEADS],
    mutationFn: ({ payload }) => leadsServiceInstance().assignLeads(payload!),
    options: args.mutationOptions,
  });
};

export { agencyLeadsListQueries, assignAgentLeadsMutation };
