import * as Constants from './constants';
import { annoncesServiceInstance } from './annonce.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';
import { IAnnonceResponse } from '../../../types/models';

const getAllAnnoncesByAgency = (
  args: QUERIES.QueryPayload<{ agencyId: string; userId: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<IAnnonceResponse[]>({
    queryKey: [Constants.ANNONCES_KEY.ANNONCES_LIST_BY_AGENCY],
    queryFn: () =>
      annoncesServiceInstance().get_annonces_by_agency(params?.agencyId, params?.userId),
    options: queryOptions,
  });
};

const createAnnonceMutation = (args: QUERIES.MutationPayload<MODELS.ICreateAnnonce>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.ANNONCES_KEY.CREATE_ANNONCE],
    mutationFn: ({ payload }) => annoncesServiceInstance().create_annonce(payload!),
    options: args.mutationOptions,
  });
};

const updateAnnonceMutation = (args: QUERIES.MutationPayload<MODELS.IUpdateAnnonce>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.ANNONCES_KEY.UPDATE_ANNONCE],
    mutationFn: ({ payload }) => annoncesServiceInstance().update_annonce(payload!),
    options: args.mutationOptions,
  });
};

const deleteAnnonceMutation = (args: QUERIES.MutationPayload<any, any, { id: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.ANNONCES_KEY.UPDATE_ANNONCE],
    mutationFn: ({ params }) => annoncesServiceInstance().delete_annonce(params?.id!),
    options: args.mutationOptions,
  });
};

export {
  createAnnonceMutation,
  getAllAnnoncesByAgency,
  updateAnnonceMutation,
  deleteAnnonceMutation,
};
