import { QUERIES } from 'rise-core-frontend';

export const queryClient = QUERIES.createQueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 5000,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
