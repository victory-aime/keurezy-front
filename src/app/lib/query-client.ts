import { QUERIES } from "rise-core-frontend";

export const queryClient = QUERIES.createQueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});
