import { io, Socket } from 'socket.io-client';
let instance: Socket | null = null;

/** Crée ou retourne l'instance unique du socket */
/**
 * `token` : jeton de session transmis à la connexion. Le cookie n'accompagne pas le socket
 * quand le frontend et l'API sont sur des domaines différents (production).
 */
export function createSocket(token?: string): Socket {
  // Déjà connecté avec le même token → rien à faire
  if (instance?.connected) return instance;

  // Reconnexion avec un nouveau token (changement de session)
  if (instance) {
    instance.removeAllListeners();
    instance.disconnect();
    instance = null;
  }

  instance = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
    withCredentials: true,
    auth: token ? { token } : undefined,
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10_000,
  });

  return instance;
}

export const getSocket = (): Socket | null => instance;

export function destroySocket(): void {
  if (instance) {
    instance.removeAllListeners();
    instance.disconnect();
    instance = null;
  }
}
