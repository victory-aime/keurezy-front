'use client';

import { Flex } from '@chakra-ui/react';
import { BaseTag } from '_components/custom';

export function DateSeparator({ label }: { label: string }) {
  return (
    <Flex width={'full'} align="center" justifyContent={'center'} gap={3} my={4} px={2}>
      <BaseTag label={label} color={'purple'} size={'sm'} fontSize="xs" />
    </Flex>
  );
}
