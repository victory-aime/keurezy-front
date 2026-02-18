import {
  Box,
  Flex,
  Group,
  Input,
  InputGroup,
  Separator,
  VStack,
  Text,
  Float,
  Circle,
} from "@chakra-ui/react";
import { Menu, Portal } from "@chakra-ui/react";
import {
  BaseBadge,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { SideBarProps } from "../sidebar/types";
import { UserModule } from "_store/state-management";
import { Avatar } from "_components/ui/avatar";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { useAuth } from "_hooks/useAuth";
import { APP_ROUTES } from "_config/routes";

export const HeaderV2 = ({ data, onShowSidebar }: SideBarProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: data?.session?.userId },
    queryOptions: {
      enabled: !!data?.session?.userId,
    },
  });

  const links = [
    {
      label: "Profile",
      path: DASHBOARD_ROUTES.PROFILE,
      icon: Icons.User,
    },
    {
      label: "Paramètres",
      path: DASHBOARD_ROUTES.PROFILE,
      icon: Icons.Setting,
    },
  ];

  return (
    <Flex
      as={"header"}
      alignItems={"center"}
      gap={3}
      px={4}
      pt={3}
      bgColor={"white"}
    >
      <Icons.Bath onClick={onShowSidebar} />

      <Separator orientation="vertical" height={6} />

      {/* Search */}
      <Flex flex={1} maxW={"md"}>
        <InputGroup startElement={<Icons.Search />}>
          <Input placeholder="Rechercher propriétés, locataires, paiements..." />
        </InputGroup>
      </Flex>

      <Flex ml={"auto"} alignItems={"center"} gap={3} position={"relative"}>
        <Flex alignItems={"center"} gap={4}>
          <Box position="relative">
            <Icons.Chat size={24} />
            <Float>
              <Circle fontSize={"xs"} size="4" bg="red" color="white">
                3
              </Circle>
            </Float>
          </Box>
          <Box position="relative">
            <Icons.Bell size={24} />
            <Float>
              <Circle fontSize={"xs"} size="4" bg="red" color="white">
                12
              </Circle>
            </Float>
          </Box>
        </Flex>

        <Separator orientation="vertical" height={6} mx={1} />

        {/* User dropdown */}

        <Menu.Root size={"md"} positioning={{ placement: "bottom" }}>
          <Menu.Trigger rounded="full" focusRing="none" width={"full"}>
            <Flex gap={1}>
              <Avatar
                size={"sm"}
                name={user?.name}
                src={user?.image ?? "https://avatar.iran.liara.run/public"}
              />
              <VStack alignItems={"start"} gap={"0"} fontSize={"xs"}>
                <Text>{user?.name}</Text>
                <Text lineClamp={1}>Administrateur</Text>
              </VStack>
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content width={"full"}>
                <Group
                  grow
                  gap={"0"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                  borderBottom={"1px solid"}
                  borderColor="gray.200"
                  px={{ base: 4, md: 2 }}
                  py={2}
                >
                  <BaseText variant={TextVariant.XS} weight={TextWeight.Bold}>
                    {user?.name}
                  </BaseText>
                  <BaseText variant={TextVariant.XXS} color={"gray.400"}>
                    {user?.email}
                  </BaseText>
                  <BaseBadge
                    label={"Administrateur"}
                    borderRadius={"full"}
                    variant={"subtle"}
                    color="primary"
                    size={"xs"}
                    p={1}
                    textSize={TextVariant.XXS}
                  />
                </Group>
                {links?.map((link, i) => (
                  <Menu.Item
                    key={i}
                    value={link?.label}
                    onClick={() => router.push(link?.path)}
                    cursor={"pointer"}
                  >
                    <link.icon />
                    {link.label}
                  </Menu.Item>
                ))}

                <Menu.Item
                  value="delete"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                  cursor={"pointer"}
                  onClick={() => logout(APP_ROUTES.AUTH.SIGN_IN)}
                >
                  <Icons.Logout />
                  Deconnexion
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
};
