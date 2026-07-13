/** hooks/chat/usePresence.ts
 * Lit la présence via useQuery — réactif aux QueryCache.set() faits dans ChatProvider.
 * queryFn ne fetch jamais réellement : la donnée n'est mise à jour QUE par setPresence.
 */
import { QUERIES } from 'rise-core-frontend';

export function useChatPresence(userId: string | undefined) {
  return QUERIES.useCustomQuery<boolean>({
    queryKey: ['presence', userId ?? ''],
    queryFn: () => Promise.resolve(false),
    options: {
      enabled: !!userId,
      staleTime: Infinity,
      gcTime: Infinity,
    },
  });
}
