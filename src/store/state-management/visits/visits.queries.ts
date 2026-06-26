import * as Constants from './constants';
import { visitsServiceInstance } from './visits.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllVisitByAgencyQueries = (
  args: QUERIES.QueryPayload<MODELS.IVisitResponse[], undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyCommonParams, MODELS.IVisitResponse[]>({
    queryKey: [Constants.VISITS_KEYS.ALL_AGENCY_VISITS],
    queryFn: () => visitsServiceInstance().getAllVisits(params as MODELS.IAgencyCommonParams),
    options: queryOptions,
  });
};

const createNewVisitsMutation = (
  args: QUERIES.MutationPayload<
    MODELS.IVisitPayload,
    any,
    { data: { agencyId: string; userId: string } }
  >,
) => {
  return QUERIES.useCustomMutation<
    MODELS.IVisitPayload,
    any,
    { data: { agencyId: string; userId: string } }
  >({
    mutationKey: [Constants.VISITS_KEYS.CREATE_VISITS],
    mutationFn: ({ payload, params }) =>
      visitsServiceInstance().create_visit(payload!, params?.data!),
    options: args.mutationOptions,
  });
};

const updateVisitMutation = (
  args: QUERIES.MutationPayload<
    MODELS.IVisitPayload,
    any,
    { data: { agencyId: string; userId: string } }
  >,
) => {
  return QUERIES.useCustomMutation<
    MODELS.IVisitPayload,
    any,
    { data: { agencyId: string; userId: string } }
  >({
    mutationKey: [Constants.VISITS_KEYS.UPDATE_VISIT],
    mutationFn: ({ payload, params }) =>
      visitsServiceInstance().update_visit(payload!, params?.data!),
    options: args.mutationOptions,
  });
};

const cancelVisitMutation = (
  args: QUERIES.MutationPayload<any, any, { data: { agencyId: string; userId: string } }>,
) => {
  return QUERIES.useCustomMutation<
    any,
    any,
    { data: { agencyId: string; userId: string; visitId: string } }
  >({
    mutationKey: [Constants.VISITS_KEYS.CANCEL_VISIT],
    mutationFn: ({ params }) => visitsServiceInstance().cancel_visit(params?.data!),
    options: args.mutationOptions,
  });
};

export {
  getAllVisitByAgencyQueries,
  createNewVisitsMutation,
  updateVisitMutation,
  cancelVisitMutation,
};
