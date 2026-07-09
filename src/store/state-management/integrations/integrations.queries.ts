import * as Constants from './constants';
import { integrationsServiceInstance } from './integrations-service.instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getProviderUrlQueries = (
  args: QUERIES.QueryPayload<{ url: string }, undefined, { provider: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<{ provider: string }, undefined, { url: string }>({
    queryKey: [Constants.INTEGRATIONS_KEYS.GET_URL],
    queryFn: () => integrationsServiceInstance().connect(params?.provider!),
    options: queryOptions,
  });
};

const getProviderFilesQueries = (
  args: QUERIES.QueryPayload<MODELS.ListedFileResult[], undefined, { provider: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<{ provider: string }, undefined, MODELS.ListedFileResult[]>({
    queryKey: [Constants.INTEGRATIONS_KEYS.GET_FILES],
    queryFn: () => integrationsServiceInstance().list_files(params?.provider!),
    options: queryOptions,
  });
};

const getTrashedFilesQueries = (
  args: QUERIES.QueryPayload<MODELS.ListedFileResult[], undefined, { provider: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<{ provider: string }, undefined, MODELS.ListedFileResult[]>({
    queryKey: [Constants.INTEGRATIONS_KEYS.GET_TRASHED_FILES],
    queryFn: () => integrationsServiceInstance().trashed_list_files(params?.provider!),
    options: queryOptions,
  });
};

const uploadFileMutation = (
  args: QUERIES.MutationPayload<{ file: string }, undefined, { provider: string }>,
) => {
  return QUERIES.useCustomMutation<{ file: string }, undefined, { provider: string }>({
    mutationKey: [Constants.INTEGRATIONS_KEYS.UPLOAD_FILE],
    mutationFn: ({ payload, params }) =>
      integrationsServiceInstance().upload_file(payload?.file!, params?.provider!),
    options: args.mutationOptions,
  });
};

const disconnectProviderMutation = (
  args: QUERIES.MutationPayload<undefined, undefined, { provider: string }>,
) => {
  return QUERIES.useCustomMutation<undefined, undefined, { provider: string }>({
    mutationKey: [Constants.INTEGRATIONS_KEYS.DISCONNECT_PROVIDER],
    mutationFn: ({ params }) => integrationsServiceInstance().disconnect(params?.provider!),
    options: args.mutationOptions,
  });
};

const trashedFileProviderMutation = (
  args: QUERIES.MutationPayload<undefined, undefined, { provider: string; fileId: string }>,
) => {
  return QUERIES.useCustomMutation<undefined, undefined, { provider: string; fileId: string }>({
    mutationKey: [Constants.INTEGRATIONS_KEYS.TRASHED_FILE],
    mutationFn: ({ params }) =>
      integrationsServiceInstance().trashed(params?.provider!, params?.fileId!),
    options: args.mutationOptions,
  });
};

const deleteFileProviderMutation = (
  args: QUERIES.MutationPayload<undefined, undefined, { provider: string; fileId: string }>,
) => {
  return QUERIES.useCustomMutation<undefined, undefined, { provider: string; fileId: string }>({
    mutationKey: [Constants.INTEGRATIONS_KEYS.DELETE_FILE],
    mutationFn: ({ params }) =>
      integrationsServiceInstance().delete_file(params?.provider!, params?.fileId!),
    options: args.mutationOptions,
  });
};

const getProviderStatusQueries = (
  args: QUERIES.QueryPayload<{ connected: boolean }, undefined, { provider: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, { provider: string }, { connected: boolean }>({
    queryKey: [Constants.INTEGRATIONS_KEYS.GET_PROVIDER_STATUS],
    queryFn: () => integrationsServiceInstance().status(params?.provider!),
    options: queryOptions,
  });
};

export {
  getProviderUrlQueries,
  disconnectProviderMutation,
  getProviderStatusQueries,
  uploadFileMutation,
  getProviderFilesQueries,
  deleteFileProviderMutation,
  trashedFileProviderMutation,
  getTrashedFilesQueries,
};
