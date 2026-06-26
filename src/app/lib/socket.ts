import { io, Socket } from 'socket.io-client';
let instance: Socket | null = null;

/** Crée ou retourne l'instance unique du socket */
export function createSocket(): Socket {
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
