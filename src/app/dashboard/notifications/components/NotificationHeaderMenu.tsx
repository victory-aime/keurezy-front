import {
  Circle,
  Flex,
  Float,
  Menu,
  Portal,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { BaseText, TextVariant, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { MODELS } from "_types/*";
import { NotificationsDisplay } from "./NotificationsDisplay";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";

export const NotificationHeaderMenu = ({
  notifications,
  isLoading,
  refetchUnreadList,
}: {
  notifications: MODELS.INotificationListResponse[];
  refetchUnreadList: () => void;
  isLoading?: boolean;
}) => {
  const router = useRouter();

  return (
    <Menu.Root
      positioning={{ strategy: "fixed", hideWhenDetached: true }}
      size={"md"}
      variant={"subtle"}
    >
      <Menu.Trigger asChild cursor={"pointer"}>
        <Flex
          position="relative"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icons.Bell size={"24px"} />
          <Float>
            <Circle fontSize={"xs"} size="4" bg="red" color="white">
              {notifications?.length}
            </Circle>
          </Float>
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content p={3} minWidth="500px">
            <Flex
              justifyContent={"flex-end"}
              mb={2}
              cursor={"pointer"}
              onClick={() => router.push(DASHBOARD_ROUTES.NOTIFICATION)}
            >
              <BaseText fontWeight={"semibold"} color={"primary.500"}>
                Voir tout
              </BaseText>
            </Flex>
            <Separator mb={4} />
            {notifications.map((data, index) => {
              return (
                <Menu.Item key={index} p={0} value={data?.id}>
                  <NotificationsDisplay
                    request={data}
                    index={index}
                    isLoading={isLoading}
                    refetchNotificationList={refetchUnreadList}
                  />
                </Menu.Item>
              );
            })}
            {notifications.length === 0 && (
              <VStack>
                <Icons.BellOff size={44} color={VariablesColors.grayScale} />
                <BaseText color={VariablesColors.grayScale}>
                  C'est calme pour l'instant. Revenez plus tard.
                </BaseText>
              </VStack>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
