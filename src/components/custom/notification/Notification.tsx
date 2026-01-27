import {
  Box,
  Circle,
  Flex,
  Float,
  Menu,
  Portal,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { BaseStatus, BaseText, TextVariant } from "_components/custom";
import { ENUM } from "_types/index";
import { FC } from "react";
import { CiBellOn, CiBellOff } from "react-icons/ci";
import { formatCreatedAt } from "rise-core-frontend";
import { VariablesColors } from "_theme/variables";

interface INotification {
  notification: {
    userId: string;
    title: string;
    message: string;
    type: ENUM.COMMON.Status;
    createdAt: string;
    data: {
      paymentId: string;
      studentId: string;
    };
  }[];
}

export const Notification: FC<INotification> = ({ notification }) => {
  return (
    <Menu.Root
      positioning={{ strategy: "fixed", hideWhenDetached: true }}
      size={"md"}
      variant={"subtle"}
    >
      <Menu.Trigger asChild>
        <Flex
          position="relative"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CiBellOn size={"24px"} />
          <Float>
            <Circle size="5" bg="red" color="white">
              <BaseText variant={TextVariant.XS} color={"white"}>
                {notification.length}
              </BaseText>
            </Circle>
          </Float>
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content p={3} minWidth="500px">
            <Box mb={2}>
              <Flex justifyContent={"space-between"}>
                <BaseText>Notifications</BaseText>
                <BaseText>Voir tout</BaseText>
              </Flex>
            </Box>
            <Separator mb={4} />
            {notification.map((data, index) => (
              <Menu.Item key={index} p={0} value={data?.message}>
                <Box key={index} mb={2} width={"full"} p={2}>
                  <Flex justifyContent={"space-between"}>
                    <BaseText>{data?.title}</BaseText>
                    <BaseStatus status={data?.type} />
                  </Flex>
                  <BaseText maxW={"400px"} truncate lineClamp={2}>
                    {data?.message}
                  </BaseText>
                  <BaseText
                    variant={TextVariant.XS}
                    color={"gary.600"}
                    mt={"2px"}
                  >
                    {formatCreatedAt(data?.createdAt)}
                  </BaseText>
                </Box>
              </Menu.Item>
            ))}
            {notification.length === 0 && (
              <VStack>
                <CiBellOff size={44} color={VariablesColors.grayScale} />
                <BaseText color={VariablesColors.grayScale}>
                  C&#39;est calme pour l&#39;instant. Revenez plus tard.
                </BaseText>
              </VStack>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
