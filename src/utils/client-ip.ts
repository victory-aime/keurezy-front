/**
 * IP du visiteur vue par le serveur Next : l'entrée de X-Forwarded-For ajoutée par le dernier
 * proxy de confiance (`hops` depuis la droite). L'entrée la plus à gauche, que le navigateur
 * peut écrire, n'est retenue que si la chaîne est plus courte que prévu.
 */
export function pickClientIp(forwardedFor: string | null, hops: number): string | undefined {
  const chain = (forwardedFor ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return chain[Math.max(0, chain.length - Math.max(1, hops))];
}
