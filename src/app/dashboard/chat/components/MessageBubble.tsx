'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { getTimeValue } from 'rise-core-frontend';
import { useColorMode } from '_components/ui/color-mode';
import { MessageBubbleProps } from '../interface/chat';
import { MessageStatusIcon } from './MessagesStatusIcon';
import { BaseTooltip, Icons } from '_components/custom';
import { VariablesColors } from '_theme/variables';

export function MessageBubble({
  message,
  isOwn,
  conversationId,
  retryMessage,
}: MessageBubbleProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" align={isOwn ? 'flex-end' : 'flex-start'} mb={1.5}>
      <Flex align="center" gap={2} maxW="70%" flexDirection={isOwn ? 'row-reverse' : 'row'}>
        {isOwn && message?.status === 'failed' && (
          <Flex align="center" gap={1} mt={0.5}>
            <Text
              as="button"
              fontSize="2xs"
              color="fg.muted"
              textDecoration="underline"
              onClick={() => retryMessage(conversationId, message)}
            >
              Réessayer
            </Text>
          </Flex>
        )}
        <Box
          maxW={'xl'}
          bg={isOwn ? 'primary.500' : colorMode !== 'light' ? 'border' : 'white'}
          color={isOwn ? 'white' : colorMode !== 'light' ? 'white' : 'black'}
          px={3}
          py={1}
          borderRadius="18px"
          borderBottomRightRadius={isOwn ? '4px' : '18px'}
          borderBottomLeftRadius={isOwn ? '18px' : '4px'}
          position="relative"
        >
          <Text fontSize="sm" fontWeight={'medium'} wordBreak="break-word">
            {message.content}
          </Text>
          <Flex alignItems={'center'} justifyContent={'flex-end'}>
            <Text
              textAlign={'right'}
              mt={1}
              fontSize="x-small"
              fontWeight={'medium'}
              wordBreak="break-word"
            >
              {getTimeValue(message.createdAt)}
            </Text>
            {isOwn && (
              <Flex align="center" gap={1} mt={0.5} px={1}>
                <MessageStatusIcon status={message.status} />
              </Flex>
            )}
          </Flex>
        </Box>

        {isOwn && message?.status === 'failed' && (
          <BaseTooltip show message={"Problème survenu lors de l'envoi du message"} placement="top">
            <Icons.InfoIcon color={VariablesColors.danger} />
          </BaseTooltip>
        )}
      </Flex>
    </Flex>
  );
}
