'use client';

import { useEffect } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { BaseButton, BaseIcon, Icons } from '_components/custom';
import { MotionFlex } from '_constants/motion';
import { getAppNotifPreference } from '../../../helpers/push-notif';

export const RequestUserPushNotifPermission = ({
  enablePermission,
  dismiss,
  isLoading,
}: {
  enablePermission?: () => void;
  dismiss?: () => void;
  isLoading: boolean;
}) => {
  const isReactivation = getAppNotifPreference() === 'disabled';

  useEffect(() => {
    const timer = setTimeout(() => dismiss?.(), 60_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionFlex
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      position="absolute"
      top="24px"
      zIndex="50"
      px={4}
      w="full"
      justifyContent="center"
    >
      <Box
        maxW="calc(100vw - 2rem)"
        _dark={{ bg: 'gray.800' }}
        border="1px solid"
        borderColor="border"
        borderRadius="2xl"
        boxShadow="xl"
        p={4}
      >
        <Flex align="center" gap={3}>
          <BaseIcon>
            <Icons.Bell size={18} />
          </BaseIcon>

          <Box flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="600" color="fg">
              {isReactivation ? 'Notifications désactivées' : 'Restez informé en temps réel'}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {isReactivation
                ? 'Réactivez-les pour ne rien manquer'
                : 'Activez les notifications push'}
            </Text>
          </Box>
        </Flex>

        <Flex mt={4} justify="flex-end" gap={2}>
          <BaseButton
            variant="plain"
            size="sm"
            onClick={dismiss}
            color="fg.muted"
            fontSize="xs"
            px={2}
            isDisabled={isLoading}
          >
            Plus tard
          </BaseButton>

          <BaseButton size="sm" onClick={enablePermission} fontSize="xs" isLoading={isLoading}>
            {isReactivation ? 'Réactiver' : 'Activer'}
          </BaseButton>
        </Flex>
      </Box>
    </MotionFlex>
  );
};
