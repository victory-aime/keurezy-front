import * as Constants from './constants';
import { visitsServiceInstance } from './visits.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllVisitByAgencyQueries = (
  args: QUERIES.QueryPayload<{ data: { agencyId: string; userId: string } }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IVisistResponse[]>({
    queryKey: [Constants.VISITS_KEYS.ALL_AGENCY_VISITS],
    queryFn: () => visitsServiceInstance().getAllVisits(params?.data),
    options: queryOptions,
  });
};

export { getAllVisitByAgencyQueries };
