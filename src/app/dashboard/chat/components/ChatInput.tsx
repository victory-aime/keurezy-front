'use client';

import { Box, Flex, Image, Text, Textarea } from '@chakra-ui/react';
import { useRef, useState, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Icons, BaseIconButton } from '_components/custom';
import { toaster } from '_components/ui/toaster';
import { ChatModule } from '_store/state-management';
import { ChatInputProps } from '../interface/chat';

const { CHAT_LIMITS } = ChatModule;
const ALLOWED = CHAT_LIMITS.ALLOWED_FILE_TYPES as readonly string[];

/** Saisie : texte (Entrée pour envoyer, Maj+Entrée pour aller à la ligne) et 3 pièces jointes. */
export function ChatInput({ onSend, onTyping, canReply }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = files.map((file) =>
    file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
  );
  useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)), [files]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasContent = value.trim().length > 0 || files.length > 0;

  const handleSend = () => {
    if (!hasContent) return;
    onSend(value.trim(), files);
    setValue('');
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onTyping();
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    const errors: string[] = [];
    const accepted = selected.filter((file) => {
      if (!ALLOWED.includes(file.type))
        errors.push(`${file.name} : format non accepté (PDF, JPG, PNG)`);
      else if (file.size > CHAT_LIMITS.MAX_FILE_SIZE) errors.push(`${file.name} : plus de 2 Mo`);
      else return true;
      return false;
    });
    const room = CHAT_LIMITS.MAX_FILES - files.length;
    if (accepted.length > room)
      errors.push(`${CHAT_LIMITS.MAX_FILES} fichiers maximum par message`);
    if (errors.length) {
      toaster.create({ type: 'warning', title: 'Pièces jointes', description: errors.join('\n') });
    }
    setFiles((current) => [...current, ...accepted.slice(0, Math.max(0, room))]);
  };

  if (!canReply) {
    return (
      <Flex px={4} py={3} borderTop="1px solid" borderColor="inherit" justify="center">
        <Text fontSize="xs" color="fg.muted">
          Lecture seule : la permission de répondre aux clients ne vous a pas été attribuée.
        </Text>
      </Flex>
    );
  }

  return (
    <Box px={4} py={3} borderTop="1px solid" borderColor="inherit" flexShrink={0}>
      {files.length > 0 && (
        <Flex gap={2} mb={2} wrap="wrap">
          {files.map((file, index) => (
            <Flex
              key={`${file.name}-${index}`}
              position="relative"
              align="center"
              gap={2}
              pr={7}
              pl={previews[index] ? 1 : 2}
              py={1}
              borderRadius="10px"
              borderWidth="1px"
              borderColor="inherit"
              maxW="220px"
            >
              {previews[index] ? (
                <Image
                  src={previews[index]!}
                  alt=""
                  boxSize="36px"
                  objectFit="cover"
                  borderRadius="8px"
                />
              ) : (
                <Icons.LuFile size={18} />
              )}
              <Text fontSize="xs" truncate>
                {file.name}
              </Text>
              <BaseIconButton
                label={`Retirer ${file.name}`}
                size="2xs"
                position="absolute"
                right={1}
                onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
              >
                <Icons.Close size={12} />
              </BaseIconButton>
            </Flex>
          ))}
        </Flex>
      )}

      <Flex align="flex-end" gap={2}>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleFiles}
        />
        <BaseIconButton
          label="Joindre des fichiers (PDF, JPG, PNG — 3 max, 2 Mo chacun)"
          size="md"
          rounded="full"
          disabled={files.length >= CHAT_LIMITS.MAX_FILES}
          onClick={() => fileInputRef.current?.click()}
        >
          <Icons.LuFiles size={18} />
        </BaseIconButton>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez un message…"
          resize="none"
          rows={1}
          minH="40px"
          maxH="120px"
          maxLength={CHAT_LIMITS.MAX_TEXT_LENGTH}
          fontSize="sm"
          borderRadius="12px"
          px={4}
          py={2.5}
          bg="bg.muted"
          borderColor={'inherit'}
          overflow="hidden"
          _focus={{ boxShadow: 'none', bg: 'bg.muted', borderColor: 'purple.focusRing' }}
        />
        <BaseIconButton
          label="Envoyer"
          colorType="primary"
          variant="solid"
          size="md"
          onClick={handleSend}
          disabled={!hasContent}
          rounded="full"
        >
          <Icons.Send size={16} />
        </BaseIconButton>
      </Flex>
    </Box>
  );
}
