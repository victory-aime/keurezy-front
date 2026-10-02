import { Box, Flex, VStack, Span, HStack } from '@chakra-ui/react';
import {
  BaseIcon,
  Icons,
  BaseText,
  BaseTag,
  CustomSkeletonLoader,
  type BaseTagProps,
} from '_components/custom';
import { NotificationsModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { formatCreatedAt } from 'rise-core-frontend';
import { getNotificationUIConfig } from '../constant/notification-config';

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
  const config = getNotificationUIConfig(request?.notification?.type);
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
    await readNotification({ params: { data: { notificationId } } });
  };

  return (
    <Box
      key={index}
      width={'full'}
      border={'1px solid'}
      p={4}
      mb={2}
      borderRadius={'12px'}
      // Non lue : teinte de son type (jetons de la charte, clair et sombre)
      borderColor={request.isRead ? 'border' : `${config.color}.border`}
      bg={request.isRead ? 'bg' : `${config.color}.subtle`}
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
          <BaseIcon color={`${config.color}.muted`} flexShrink={0}>
            <Box as="span" color={`${config.color}.fg`} display="flex">
              <IconComponent aria-hidden />
            </Box>
          </BaseIcon>

          <VStack alignItems={'flex-start'} gap={1} width="full">
            <HStack justifyContent="space-between" width="full">
              <BaseText fontWeight={'semibold'}>{config?.title}</BaseText>

              {!request.isRead && (
                <BaseTag label="Nouveau" color={config.color as BaseTagProps['color']} />
              )}
            </HStack>

            <BaseText color="fg.muted" fontSize="sm">
              {request?.notification?.content}
            </BaseText>

            <Span color="fg.muted" fontSize="xs">
              {formatCreatedAt(request?.notification.createdAt!)}
            </Span>
          </VStack>
        </Flex>
      )}
    </Box>
  );
};
