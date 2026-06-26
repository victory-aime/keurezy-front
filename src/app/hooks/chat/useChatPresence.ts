// hooks/chat/usePresence.ts
// Lit la présence via useQuery — réactif aux QueryCache.set() faits dans ChatProvider.
// queryFn ne fetch jamais réellement : la donnée n'est mise à jour QUE par setPresence.

import { QUERIES } from 'rise-core-frontend';

export function useChatPresence(userId: string | undefined) {
  return QUERIES.useCustomQuery<boolean>({
    queryKey: ['presence', userId ?? ''],
    queryFn: () => Promise.resolve(false), // valeur initiale tant qu'aucun event n'est arrivé
    options: {
      enabled: !!userId,
      staleTime: Infinity, // jamais refetch automatiquement — uniquement mis à jour par socket
      gcTime: Infinity, // ne pas garbage-collect entre deux ouvertures de conversation
    },
  });
}
