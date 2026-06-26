import { Box, Flex, VStack, Span, Text, HStack } from '@chakra-ui/react';
import { BaseIcon, Icons, BaseText, CustomSkeletonLoader } from '_components/custom';
import { Tag } from '_components/ui/tag';
import { NotificationsModule } from '_store/state-management';
import { VariablesColors } from '_theme/variables';
import { MODELS } from '_types/*';
import { formatCreatedAt } from 'rise-core-frontend';
import { notificationUIConfig } from '../constant/notification-config';
import { useColorMode } from '_components/ui/color-mode';
import { useThemeColors } from '_theme/useThemeColors';

export const NotificationsDisplay = ({
  request,
  index = 0,
  isLoading = false,
  refetchNotificationList,
  isLast = false,
}: {
  request: MODELS.INotificationListResponse;
  index?: number;
  isLoading?: boolean;
  refetchNotificationList?: () => void;
  isLast?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const config = notificationUIConfig[request?.notification?.type];
  const { hexToRGB } = useThemeColors(config?.color);
  const IconComponent = Icons[config?.icon];

  const { mutateAsync: readNotification } = NotificationsModule.readNotificationMutation({
    mutationOptions: {
      onSuccess: () => {
        NotificationsModule.NotificationsCache.invalidateAllUnreadNotificationCache();
        refetchNotificationList?.();
      },
    },
  });

  const onReadNotification = async (notificationId: string, userId: string) => {
    await readNotification({ params: { data: { notificationId, userId } } });
  };

  return (
    <Box
      key={index}
      width={'full'}
      border={'1px solid'}
      p={4}
      mb={2}
      borderRadius={'12px'}
      borderColor={request.isRead ? 'inherit' : `${config?.color}.400`}
      bg={
        request.isRead
          ? 'inherit'
          : colorMode === 'light'
            ? `${config?.color}.50`
            : `${config?.color}.800`
      }
      transition="all 0.2s ease"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      {isLoading ? (
        <VStack gap={4}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Flex gap={4} width={'full'} key={i}>
              <CustomSkeletonLoader type={'BUTTON'} width={10} colorButton="primary" />
              <CustomSkeletonLoader type={'TEXT'} width={'full'} />
            </Flex>
          ))}
        </VStack>
      ) : (
        <Flex
          gap={3}
          alignItems={'flex-start'}
          cursor={'pointer'}
          onClick={async () => {
            if (!request.isRead) {
              await onReadNotification(request?.notificationId, request?.userId);
            }
          }}
        >
          <BaseIcon color={hexToRGB(600, 50)}>
            <IconComponent color={VariablesColors[config?.color as keyof typeof VariablesColors]} />
          </BaseIcon>

          <VStack alignItems={'flex-start'} gap={1} width="full">
            <HStack justifyContent="space-between" width="full">
              <BaseText fontWeight={'semibold'}>{config?.title}</BaseText>

              {!request.isRead && <Tag colorPalette={config?.color}>Nouveau</Tag>}
            </HStack>

            <Text color={'gray.400'} fontSize="sm">
              {request?.notification?.content}
            </Text>

            <Span color={'gray.400'} fontSize="xs">
              {formatCreatedAt(request?.notification.createdAt!)}
            </Span>
          </VStack>
        </Flex>
      )}
    </Box>
  );
};
