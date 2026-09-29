import * as Constants from './constants';
import { visitsServiceInstance } from './visits.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

/** Période facultative (AAAA-MM-JJ, fin incluse) : visites planifiées dans l'intervalle. */
type AgencyVisitsParams = MODELS.IAgencyCommonParams & { from?: string; to?: string };

const getAllVisitByAgencyQueries = (
  args: QUERIES.QueryPayload<MODELS.IVisitResponse[], undefined, AgencyVisitsParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, AgencyVisitsParams, MODELS.IVisitResponse[]>({
    queryKey: [Constants.VISITS_KEYS.ALL_AGENCY_VISITS, params],
    queryFn: () => visitsServiceInstance().getAllVisits(params as AgencyVisitsParams),
    options: queryOptions,
  });
};

/** Clients proposés dans le formulaire de visite (remplace l'ancienne liste des leads). */
const agencyClientsQueries = (
  args: QUERIES.QueryPayload<MODELS.IVisitClient[], undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyCommonParams, MODELS.IVisitClient[]>({
    queryKey: [Constants.VISITS_KEYS.AGENCY_CLIENTS, params],
    queryFn: () => visitsServiceInstance().getAgencyClients(params as MODELS.IAgencyCommonParams),
    options: queryOptions,
  });
};

const createNewVisitsMutation = (
  args: QUERIES.MutationPayload<MODELS.IVisitPayload, any, { data: MODELS.IAgencyCommonParams }>,
) => {
  return QUERIES.useCustomMutation<MODELS.IVisitPayload, any, { data: MODELS.IAgencyCommonParams }>(
    {
      mutationKey: [Constants.VISITS_KEYS.CREATE_VISITS],
      mutationFn: ({ payload, params }) =>
        visitsServiceInstance().create_visit(payload!, params?.data!),
      options: args.mutationOptions,
    },
  );
};

const updateVisitMutation = (args: QUERIES.MutationPayload<MODELS.IVisitPayload>) => {
  return QUERIES.useCustomMutation<MODELS.IVisitPayload, unknown>({
    mutationKey: [Constants.VISITS_KEYS.UPDATE_VISIT],
    mutationFn: ({ payload }) => visitsServiceInstance().update_visit(payload!),
    options: args.mutationOptions,
  });
};

const cancelVisitMutation = (
  args: QUERIES.MutationPayload<any, any, { data: { visitId: string } }>,
) => {
  return QUERIES.useCustomMutation<any, any, { data: { visitId: string } }>({
    mutationKey: [Constants.VISITS_KEYS.CANCEL_VISIT],
    mutationFn: ({ params }) => visitsServiceInstance().cancel_visit(params?.data!),
    options: args.mutationOptions,
  });
};

export {
  getAllVisitByAgencyQueries,
  agencyClientsQueries,
  createNewVisitsMutation,
  updateVisitMutation,
  cancelVisitMutation,
};
