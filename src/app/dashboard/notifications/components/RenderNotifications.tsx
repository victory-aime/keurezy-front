import { MODELS } from '_types/*';
import { NotificationsDisplay } from './NotificationsDisplay';
import { BaseText, Icons } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { VStack } from '@chakra-ui/react';

export const RenderNotifications = ({
  list,
  isLoading,
  refetchNotificationList,
  isSlice = false,
  displayLenght = 3,
}: {
  list: MODELS.INotificationListResponse[];
  isLoading?: boolean;
  refetchNotificationList?: () => void;
  displayLenght?: number;
  isSlice?: boolean;
}) => {
  if (isLoading) {
    return (
      <NotificationsDisplay request={{} as MODELS.INotificationListResponse} index={0} isLoading />
    );
  }

  if (list?.length === 0) {
    return (
      <VStack>
        <Icons.BellOff size={44} color={VariablesColors.grayScale} />
        <BaseText color={VariablesColors.grayScale}>
          C'est calme pour l'instant. Revenez plus tard.
        </BaseText>
      </VStack>
    );
  }

  if (isSlice) {
    return list
      ?.slice(0, displayLenght ?? 3)
      .map((item, i) => (
        <NotificationsDisplay
          key={item.id}
          request={item}
          index={i}
          refetchNotificationList={refetchNotificationList}
          isLast={i === list?.slice(0, displayLenght ?? 3).length - 1}
        />
      ));
  }

  return list?.map((request, i) => (
    <NotificationsDisplay
      key={request.id}
      request={request}
      index={i}
      refetchNotificationList={refetchNotificationList}
      isLast={i === list?.length - 1}
    />
  ));
};
