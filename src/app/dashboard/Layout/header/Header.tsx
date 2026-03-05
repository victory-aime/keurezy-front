import { Flex, Group, Separator, Text } from "@chakra-ui/react";
import { Menu, Portal } from "@chakra-ui/react";
import {
  BaseText,
  CustomSkeletonLoader,
  FormTextInput,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { SideBarProps } from "../sidebar/types";
import { NotificationsModule, UserModule } from "_store/state-management";
import { Avatar } from "_components/ui/avatar";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { useAuth } from "_hooks/useAuth";
import { VariablesColors } from "_theme/variables";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { NotificationHeaderMenu } from "../../notifications/components/NotificationHeaderMenu";

export const Header = ({ data, onShowSidebar, sideToggled }: SideBarProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();
  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: data?.session?.userId },
    queryOptions: {
      enabled: !!data?.session?.userId,
    },
  });

  const { data: unreadNotificationsList, isLoading: unreadListLoad } =
    NotificationsModule.getAllUnreadNotificationsQueries({
      params: { recipientId: user?.id },
      queryOptions: { enabled: !!user?.id },
    });

  const { refetch: refetchNotificationList } =
    NotificationsModule.getAllNotificationsQueries({
      params: { recipientId: user?.id },
      queryOptions: { enabled: !!user?.id },
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
    <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
      {({}) => (
        <Flex
          as={"header"}
          alignItems={"center"}
          gap={3}
          px={4}
          pt={3}
          bgColor={"white"}
          data-tour="header"
        >
          {sideToggled ? (
            <Icons.SideOpen
              size={18}
              color={VariablesColors.grayScale}
              onClick={onShowSidebar}
              cursor={"pointer"}
            />
          ) : (
            <Icons.SideClose
              size={18}
              color={VariablesColors.grayScale}
              onClick={onShowSidebar}
              cursor={"pointer"}
            />
          )}

          <Separator orientation="vertical" height={6} />

          {/* Search */}
          <Flex flex={1} maxW={"md"}>
            <FormTextInput
              leftAccessory={<Icons.Search />}
              name="search"
              placeholder="Rechercher propriétés, locataires, paiements..."
              isLoading={isLoading}
            />
          </Flex>

          <Flex ml={"auto"} alignItems={"center"} gap={3} position={"relative"}>
            {isLoading ? (
              <>
                <CustomSkeletonLoader
                  type="BUTTON"
                  direction={"row"}
                  width={"20px"}
                  colorButton="neutral"
                  raduis={"full"}
                />
                <CustomSkeletonLoader
                  type="BUTTON"
                  direction={"row"}
                  width={"20px"}
                  colorButton="neutral"
                  raduis={"full"}
                />
                <Separator orientation="vertical" height={6} mx={1} />
                <CustomSkeletonLoader
                  type="CIRCLE"
                  direction={"row"}
                  width={"150px"}
                  numberOfLines={1}
                />
              </>
            ) : (
              <>
                <NotificationHeaderMenu
                  notifications={unreadNotificationsList ?? []}
                  isLoading={unreadListLoad}
                  refetchUnreadList={refetchNotificationList}
                />

                <Separator orientation="vertical" height={6} mx={1} />

                {/* User dropdown */}

                <Menu.Root size={"md"} positioning={{ placement: "bottom" }}>
                  <Menu.Trigger
                    rounded="full"
                    focusRing="none"
                    width={"full"}
                    cursor={"pointer"}
                  >
                    <Flex gap={1} alignItems={"center"}>
                      <Avatar
                        size={"sm"}
                        name={user?.name}
                        src={
                          user?.image ?? "https://avatar.iran.liara.run/public"
                        }
                      />
                      <Text>{user?.name}</Text>
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
                          <BaseText
                            variant={TextVariant.XS}
                            weight={TextWeight.Bold}
                          >
                            {user?.name}
                          </BaseText>
                          <BaseText
                            variant={TextVariant.XXS}
                            color={"gray.400"}
                          >
                            {user?.email}
                          </BaseText>
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
                          onClick={() => logout()}
                        >
                          <Icons.Logout />
                          {t("COMMON.LOGOUT")}
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </>
            )}
          </Flex>
        </Flex>
      )}
    </Formik>
  );
};
