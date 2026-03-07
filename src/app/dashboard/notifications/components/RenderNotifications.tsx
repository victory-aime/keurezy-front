import { MODELS } from "_types/*";
import { NotificationsDisplay } from "./NotificationsDisplay";
import { BaseText, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { VStack } from "@chakra-ui/react";

export const RenderNotifications = ({
  list,
  isLoading,
  refetchNotificationList,
}: {
  list: MODELS.INotificationListResponse[];
  isLoading?: boolean;
  refetchNotificationList?: () => void;
}) => {
  if (isLoading) {
    return (
      <NotificationsDisplay
        request={{} as MODELS.INotificationListResponse}
        index={0}
        isLoading
      />
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
