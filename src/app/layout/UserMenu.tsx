import { Avatar, Flex, VStack } from "@chakra-ui/react";
import { CiBellOn, CiLogout } from "react-icons/ci";
import { MODELS } from "_types/";
import { BaseButton, BaseText } from "_components/custom";

export const UserMenu = ({
  user,
  logout,
}: {
  user: MODELS.IUser | undefined;
  logout: () => void;
}) => {
  return (
    <VStack
      width={"full"}
      bgColor={"bg.muted"}
      p={3}
      mt={3}
      borderRadius={"12px"}
      gap={4}
    >
      <Flex alignItems={"center"} width={"full"} borderRadius={"12px"} gap={2}>
        <Avatar.Root size="lg">
          <Avatar.Fallback name={user?.name} />
          <Avatar.Image
            src={user?.image ?? "https://avatar.iran.liara.run/public"}
          />
        </Avatar.Root>
        <BaseText textTransform={"capitalize"}>{user?.name}</BaseText>
      </Flex>
      <BaseButton
        width={"full"}
        leftIcon={<CiBellOn size={24} />}
        colorType={"overlay"}
      >
        Notifications
      </BaseButton>
      <BaseButton
        leftIcon={<CiLogout />}
        onClick={() => logout()}
        colorType={"danger"}
        width={"full"}
      >
        Deconnexion
      </BaseButton>
    </VStack>
  );
};
