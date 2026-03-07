import { Box, Flex, VStack, Span, Text, HStack } from "@chakra-ui/react";
import {
  BaseIcon,
  Icons,
  BaseText,
  CustomSkeletonLoader,
} from "_components/custom";
import { Tag } from "_components/ui/tag";
import { NotificationsModule } from "_store/state-management";
import { Colors, hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { MODELS } from "_types/*";
import { useRouter } from "next/navigation";
import { formatCreatedAt } from "rise-core-frontend";
import { DASHBOARD_ROUTES } from "../../routes";
import { notificationUIConfig } from "../constant/notification-config";

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
  const router = useRouter();
  const config = notificationUIConfig[request?.type];
  const IconComponent = Icons[config?.icon];

  const { mutateAsync: readNotification } =
    NotificationsModule.readNotificationMutation({
      mutationOptions: {
        onSuccess: () => {
          refetchNotificationList?.();
        },
      },
    });

  const onReadNotification = async (
    notificationId: string,
    recipientId: string,
  ) => {
    await readNotification({ params: { notificationId, recipientId } });
  };

  return (
    <Box
      key={index}
      width={"full"}
      border={"1px solid"}
      p={4}
      borderRadius={
        index === 0 ? "12px 12px 0 0" : isLast ? "0 0 12px 12px" : "0"
      }
      borderColor={request.isRead ? "inherit" : `${config?.color}.400`}
      bg={request.isRead ? "inherit" : `${config?.color}.50`}
      transition="all 0.2s ease"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
    >
      {isLoading ? (
        <VStack gap={4}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Flex gap={4} width={"full"} key={i}>
              <CustomSkeletonLoader
                type={"BUTTON"}
                width={10}
                colorButton="primary"
              />
              <CustomSkeletonLoader type={"TEXT"} width={"full"} />
            </Flex>
          ))}
        </VStack>
      ) : (
        <Flex
          gap={3}
          alignItems={"flex-start"}
          cursor={"pointer"}
          onClick={() => {
            if (!request.isRead) {
              onReadNotification(request?.id, request?.recipientId);
            }
            router.push(DASHBOARD_ROUTES.RENTAL_REQUEST);
          }}
        >
          <BaseIcon color={hexToRGB(config?.color as keyof Colors, 0.4)}>
            <IconComponent
              color={
                VariablesColors[config?.color as keyof typeof VariablesColors]
              }
            />
          </BaseIcon>

          <VStack alignItems={"flex-start"} gap={1} width="full">
            <HStack justifyContent="space-between" width="full">
              <BaseText fontWeight={"semibold"}>{config?.title}</BaseText>

              {!request.isRead && (
                <Tag colorPalette={config?.color}>Nouveau</Tag>
              )}
            </HStack>

            <Text color={"gray.600"} fontSize="sm">
              {request?.content}
            </Text>

            <Span color={"gray.400"} fontSize="xs">
              {formatCreatedAt(request?.createdAt!)}
            </Span>
          </VStack>
        </Flex>
      )}
    </Box>
  );
};
