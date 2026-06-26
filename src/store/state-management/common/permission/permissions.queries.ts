import * as Constants from './constants';
import { permissionServiceInstance } from './permissions.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPermissionsByAgencyQueries = (
  args: QUERIES.QueryPayload<
    MODELS.COMMON.IGetAllPermissionResponse[],
    undefined,
    { agencyId: string }
  >,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<
    undefined,
    { agencyId: string },
    MODELS.COMMON.IGetAllPermissionResponse[]
  >({
    queryKey: [Constants.PERMS_KEYS.GET_ALL_PERMS, params],
    queryFn: () => permissionServiceInstance().getAllPerms(params?.agencyId!),
    options: queryOptions,
  });
};

export { getAllPermissionsByAgencyQueries };
