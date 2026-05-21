'use client';

import { ReactNode } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { CustomSkeletonLoader } from '_components/custom';

type KpiCardProps = {
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  isLoading?: boolean;
};

export default function KpiCard({
  title,
  value,
  unit,
  description,
  icon,
  color = 'gray.700',
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return <CustomSkeletonLoader type="TEXT" width="full" numberOfLines={3} />;
  }

  return (
    <Box bg="white" p={5} borderRadius="2xl" shadow="sm" width="full">
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Text fontSize="sm" fontWeight="medium" color="gray.500">
          {title}
        </Text>
        {icon && <Box color={color}>{icon}</Box>}
      </Flex>

      <Stack gap={1}>
        <Text fontSize="3xl" fontWeight="bold" color={color}>
          {value}
          {unit ? ` ${unit}` : ''}
        </Text>
        {description && (
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
