import { ENUM, MODELS } from '_types/';

/** Aperçu du dernier message d'une conversation. */
export function getLastMessagePreview(conversation: MODELS.Conversation, viewerId?: string) {
  const last = conversation.lastMessage;
  if (!last) return 'Nouvelle discussion';
  const prefix = last.senderId === viewerId ? 'Vous : ' : '';
  if (last.content) return `${prefix}${last.content}`;
  if (last.type === ENUM.MessageType.AUDIO) return `${prefix}🎤 Note vocale`;
  if (last.type === ENUM.MessageType.IMAGE) {
    return `${prefix}📷 ${last.attachmentsCount > 1 ? `${last.attachmentsCount} photos` : 'Photo'}`;
  }
  return `${prefix}📎 ${last.attachmentsCount > 1 ? `${last.attachmentsCount} fichiers` : 'Pièce jointe'}`;
}

/** « 1,2 Mo » / « 350 Ko » */
export function formatFileSize(bytes: number) {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

/** « 1:05 » */
export function formatDuration(ms?: number | null) {
  const total = Math.max(0, Math.round((ms ?? 0) / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * Onde d'une note vocale, en niveaux 0–1 : l'enregistrement ne conserve pas les niveaux
 * réels, l'onde est donc dérivée d'un identifiant stable (même calcul que sur le mobile).
 */
export function voiceWaveform(seed: string, count: number): number[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  }
  return Array.from({ length: count }, (_, index) => {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822519) ^ index;
    const noise = ((hash >>> 0) % 1000) / 1000;
    // Enveloppe douce : des « mots » plus marqués au centre de chaque groupe
    const envelope = 0.55 + 0.45 * Math.abs(Math.sin((index / count) * Math.PI * 3));
    return Math.max(0.12, noise * envelope);
  });
}
