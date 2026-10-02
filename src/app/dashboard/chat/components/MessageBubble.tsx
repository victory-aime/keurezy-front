'use client';

import { ReactNode } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { getTimeValue } from 'rise-core-frontend';
import { useColorMode } from '_components/ui/color-mode';
import { Icons, BaseText } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { ENUM, MODELS } from '_types/';
import { MessageBubbleProps } from '../interface/chat';
import { MessageStatusIcon } from './MessagesStatusIcon';
import { formatFileSize } from '../utils/chat';
import { VoiceNotePlayer } from './VoiceNotePlayer';

const isRemote = (url: string) => url.startsWith('http');

function Attachments({
  attachments,
  isOwn,
  senderName,
  voiceFooter,
}: {
  attachments: MODELS.IChatAttachment[];
  isOwn: boolean;
  senderName?: string;
  /** Heure et statut, intégrés au lecteur d'une note vocale */
  voiceFooter?: ReactNode;
}) {
  const images = attachments.filter((item) => item.kind === ENUM.AttachmentKind.IMAGE);
  const documents = attachments.filter((item) => item.kind === ENUM.AttachmentKind.DOCUMENT);
  const voice = attachments.find((item) => item.kind === ENUM.AttachmentKind.AUDIO);

  return (
    <Flex direction="column" gap={1.5} mb={1}>
      {images.length > 0 && (
        <Flex gap={1.5} wrap="wrap">
          {images.map((image) => (
            <Link key={image.id} href={image.url} target="_blank" rel="noopener noreferrer">
              <Image
                src={image.url}
                alt={image.fileName}
                w={images.length === 1 ? '260px' : '120px'}
                h={images.length === 1 ? '190px' : '120px'}
                objectFit="cover"
                borderRadius="12px"
              />
            </Link>
          ))}
        </Flex>
      )}

      {documents.map((document) => (
        <Link
          key={document.id}
          href={isRemote(document.url) ? document.url : undefined}
          target="_blank"
          rel="noopener noreferrer"
          display="flex"
          alignItems="center"
          gap={2}
          px={3}
          py={2}
          borderRadius="10px"
          bg={isOwn ? 'whiteAlpha.200' : 'blackAlpha.50'}
          color="inherit"
          textDecoration="none"
          maxW="280px"
        >
          <Icons.LuFile size={22} />
          <Box minW={0} flex={1}>
            <BaseText fontSize="sm" fontWeight="600" truncate>
              {document.fileName}
            </BaseText>
            <BaseText fontSize="xs" opacity={0.75}>
              PDF{document.fileSize ? ` · ${formatFileSize(document.fileSize)}` : ''}
            </BaseText>
          </Box>
          <Icons.Download size={16} />
        </Link>
      ))}

      {voice && (
        // Le m4a (AAC) enregistré sur mobile est lu nativement par les navigateurs
        <VoiceNotePlayer
          url={voice.url}
          // Nom de fichier : identique avant et après confirmation de l'envoi
          seed={voice.fileName}
          durationMs={voice.durationMs}
          accent={isOwn ? VariablesColors.blue : 'var(--chakra-colors-primary-500)'}
          senderName={senderName}
          footer={voiceFooter}
        />
      )}
    </Flex>
  );
}

export function MessageBubble({
  message,
  isOwn,
  senderLabel,
  onRetry,
  onDiscard,
}: MessageBubbleProps) {
  const { colorMode } = useColorMode();
  const failed = message.status === 'failed';
  // Note vocale seule : l'heure et le statut prennent place dans le lecteur
  const isVoiceOnly =
    !message.content &&
    message.attachments.length === 1 &&
    message.attachments[0].kind === ENUM.AttachmentKind.AUDIO;

  const footer = (
    <Flex alignItems={'center'} justifyContent={'flex-end'} gap={1}>
      <BaseText mt={isVoiceOnly ? 0 : 1} fontSize="x-small" fontWeight={'medium'}>
        {getTimeValue(message.createdAt)}
      </BaseText>
      {isOwn && !failed && <MessageStatusIcon status={message.status} />}
    </Flex>
  );

  return (
    <Flex direction="column" align={isOwn ? 'flex-end' : 'flex-start'} mb={1.5}>
      {senderLabel && (
        <BaseText fontSize="2xs" color="fg.muted" mb={0.5} px={2}>
          {senderLabel}
        </BaseText>
      )}
      <Box
        maxW="70%"
        bg={isOwn ? 'primary.500' : colorMode !== 'light' ? 'border' : 'white'}
        color={isOwn ? 'white' : colorMode !== 'light' ? 'white' : 'black'}
        px={3}
        py={1.5}
        borderRadius="18px"
        borderBottomRightRadius={isOwn ? '4px' : '18px'}
        borderBottomLeftRadius={isOwn ? '18px' : '4px'}
        opacity={failed ? 0.7 : 1}
      >
        {message.attachments.length > 0 && (
          <Attachments
            attachments={message.attachments}
            isOwn={isOwn}
            senderName={message.sender?.name}
            voiceFooter={isVoiceOnly ? footer : undefined}
          />
        )}
        {message.content && (
          <BaseText
            fontSize="sm"
            fontWeight={'medium'}
            wordBreak="break-word"
            whiteSpace="pre-wrap"
          >
            {message.content}
          </BaseText>
        )}
        {!isVoiceOnly && footer}
      </Box>

      {failed && (
        <Flex align="center" gap={3} mt={1}>
          <Flex align="center" gap={1}>
            <Icons.InfoIcon color={VariablesColors.danger} />
            <BaseText fontSize="2xs" color="danger.solid">
              Non envoyé
            </BaseText>
          </Flex>
          <BaseText
            as="button"
            fontSize="2xs"
            fontWeight="600"
            color="primary.500"
            onClick={() => onRetry(message)}
          >
            Réessayer
          </BaseText>
          <BaseText as="button" fontSize="2xs" color="fg.muted" onClick={() => onDiscard(message)}>
            Supprimer
          </BaseText>
        </Flex>
      )}
    </Flex>
  );
}
