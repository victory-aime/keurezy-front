/** hooks/chat/useDateSeparators.ts
 Insère des séparateurs de date entre les messages selon WhatsApp :
 "Aujourd'hui", "Hier", "Lundi 18 juin", etc.
*/
import { useMemo } from 'react';
import { MODELS } from '_types/*';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export type ChatItem =
  | { type: 'message'; message: MODELS.MessagePayload }
  | { type: 'date-separator'; label: string; date: Date };

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return 'Hier';
  return format(date, 'EEEE d MMMM', { locale: fr });
}

export function useDateSeparators(messages: MODELS.MessagePayload[]): ChatItem[] {
  return useMemo(() => {
    const items: ChatItem[] = [];
    let lastDate: Date | null = null;

    for (const message of messages) {
      const messageDate = new Date(message.createdAt);

      if (!lastDate || !isSameDay(lastDate, messageDate)) {
        items.push({
          type: 'date-separator',
          label: formatDateLabel(messageDate),
          date: messageDate,
        });
        lastDate = messageDate;
      }

      items.push({ type: 'message', message });
    }

    return items;
  }, [messages]);
}
