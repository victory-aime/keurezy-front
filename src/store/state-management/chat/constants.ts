export enum CHAT_KEYS {
  CONVERSATIONS = 'CHAT_CONVERSATIONS',
  CONVERSATION = 'CHAT_CONVERSATION',
  MESSAGES = 'CHAT_MESSAGES',
  OPEN_BOOKING = 'CHAT_OPEN_BOOKING',
  SEND_MESSAGE = 'CHAT_SEND_MESSAGE',
  MARK_READ = 'CHAT_MARK_READ',
}

/** Limites du chat, identiques à celles vérifiées par le backend. */
export const CHAT_LIMITS = {
  MAX_FILES: 3,
  MAX_FILE_SIZE: 2 * 1024 * 1024,
  MAX_TEXT_LENGTH: 2000,
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const;
