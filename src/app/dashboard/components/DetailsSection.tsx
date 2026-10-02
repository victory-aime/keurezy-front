import { VStack, Flex, HStack, Span, StackProps } from '@chakra-ui/react';
import { BaseText } from '_components/custom';
import React from 'react';

/** Section titrée d'une modale de détail (réservations, visites). */
export const DetailsModalSection = ({
  icon,
  title,
  children,
  ...rest
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
} & StackProps) => (
  <VStack alignItems="flex-start" width="full" {...rest}>
    <Flex alignItems="center" gap={2} color="primary.500">
      {icon}
      <BaseText fontWeight="semibold">{title}</BaseText>
    </Flex>
    {children}
  </VStack>
);

export const DetailsInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <HStack>
    {icon}
    <BaseText>
      {label}: <Span>{value ?? '-'}</Span>
    </BaseText>
  </HStack>
);
