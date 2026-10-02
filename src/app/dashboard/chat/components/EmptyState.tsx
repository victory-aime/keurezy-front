'use client';

import { Flex } from '@chakra-ui/react';
import { BaseIcon, Icons, BaseText } from '_components/custom';

export function EmptyState() {
  return (
    <Flex direction="column" align="center" justify="center" h="2xl" gap={3} px={8}>
      <BaseIcon rounded={'full'} boxSize={'56px'} color="bg.subtle">
        <Icons.Chat size={24} strokeWidth={1.5} color="var(--chakra-colors-fg-subtle)" />
      </BaseIcon>
      <BaseText fontSize="sm" color="fg.muted" textAlign="center">
        Sélectionnez une conversation pour commencer
      </BaseText>
    </Flex>
  );
}
