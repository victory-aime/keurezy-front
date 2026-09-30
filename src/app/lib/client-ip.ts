import { pickClientIp } from '_utils/client-ip';

/** En-têtes lus par le backend (`config/throttle.ts`, `IP_HEADERS`). */
const CLIENT_IP = 'x-keurezy-client-ip';
const PROXY_SECRET = 'x-keurezy-proxy-secret';

/**
 * Transmet au backend l'IP réelle du visiteur, signée par le secret partagé : sans cela, tous
 * les visiteurs web anonymes arrivent avec l'IP du serveur Next et partagent un même compteur
 * de limite de débit. Toute valeur envoyée par le navigateur pour ces en-têtes est retirée.
 * Serveur uniquement : `INTERNAL_PROXY_SECRET` n'est jamais exposé au navigateur (pas de NEXT_PUBLIC_).
 */
export function forwardClientIp(outgoing: Headers, incoming: Headers): void {
  outgoing.delete(CLIENT_IP);
  outgoing.delete(PROXY_SECRET);

  const secret = process.env.INTERNAL_PROXY_SECRET;
  const ip = pickClientIp(
    incoming.get('x-forwarded-for'),
    Number(process.env.TRUST_PROXY_HOPS ?? 1),
  );
  if (!secret || !ip) return;

  outgoing.set(CLIENT_IP, ip);
  outgoing.set(PROXY_SECRET, secret);
}
