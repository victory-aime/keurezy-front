import * as Constants from './constants';
import { leadsServiceInstance } from './leads.service-instance';
import {  MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const agencyLeadsListQueries = (args: QUERIES.QueryPayload<MODELS.IAgencyFilters>) => {
  const { params } = args;
  return QUERIES.useCustomQuery<MODELS.ILeadsAgency[]>({
    queryKey: [Constants.LEAD_KEYS.AGENCY_LEADS_LIST, params],
    queryFn: () => leadsServiceInstance().agencyLeadsList(params as MODELS.IAgencyFilters),
    options: args.queryOptions,
  });
};

const assignAgentLeadsMutation=(args:QUERIES.MutationPayload<MODELS.IAssignAgentLeads>)=> {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.LEAD_KEYS.ASSIGN_LEADS],
    mutationFn:({payload})=> leadsServiceInstance().assignLeads(payload!),
    options:args.mutationOptions
  })
}

const userLeadsListQueries = (args: QUERIES.QueryPayload<{ userId: string }>) => {
  const { params } = args;
  return QUERIES.useCustomQuery<any[]>({
    queryKey: [Constants.LEAD_KEYS.USER_LEADS_LIST],
    queryFn: () => leadsServiceInstance().userLeadsList(params?.userId),
    options: args.queryOptions,
  });
};

export { agencyLeadsListQueries, userLeadsListQueries, assignAgentLeadsMutation };
