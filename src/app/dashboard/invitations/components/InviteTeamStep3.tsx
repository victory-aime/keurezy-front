import { MotionBox } from "_constants/motion";
import { FormCard } from "../../components/FormCard";
import { useFormikContext } from "formik";
import { CommonModule } from "_store/state-management";
import { Avatar } from "_components/ui/avatar";
import { Flex, HStack, Stack, VStack } from "@chakra-ui/react";
import { BaseIcon, BaseTag, BaseText, Icons } from "_components/custom";
import { ISelectPermissions, IInviteTeamUserInfo } from "../constants/team";
import { MODELS } from "_types/*";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const InviteTeamStep3 = ({
  permissions,
  isLoading,
}: {
  permissions: MODELS.COMMON.IGetAllPermissionResponse[];
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<{
    account: IInviteTeamUserInfo;
    permissions: ISelectPermissions[];
  }>();

  const groupedPermissions = useMemo(() => {
    if (!permissions || !values.permissions) return [];

    const selectedIds = new Set(
      values.permissions.filter((p) => p.granted).map((p) => p.permissionId),
    );

    return permissions
      .map((group) => ({
        category: group.category,
        permissions: group.permissions.filter((perm) =>
          selectedIds.has(perm.id),
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [permissions, values.permissions]);

  return (
    <MotionBox
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <FormCard title="Vérification & Envoi" isLoading={isLoading}>
        <VStack gap={3} alignItems={"flex-start"} width={"full"} p={3}>
          <Flex alignItems={"flex-start"} gap={3} width={"full"} mt={4}>
            <Avatar name={values?.account?.name} size={"lg"} />
            <Stack gap={0}>
              <BaseText fontWeight="bold">{values?.account?.name}</BaseText>
              <BaseText color="gray.500">{values?.account?.email}</BaseText>
              <BaseTag color="green" label={values?.account?.role} />
            </Stack>
          </Flex>
          <Flex alignItems={"center"} gap={2} mb={2} mt={4}>
            <BaseIcon>
              <Icons.Shield />
            </BaseIcon>
            <BaseText>
              Permissions accordées :{" "}
              {groupedPermissions.reduce(
                (acc, group) => acc + group.permissions.length,
                0,
              )}
            </BaseText>
          </Flex>
          <VStack align="stretch" width="full">
            {groupedPermissions.map((group) => (
              <Flex
                justifyContent={"space-between"}
                key={group.category}
                align="start"
                width="full"
                gap={2}
                bgColor={"bg.muted"}
                p={2}
                rounded={"lg"}
              >
                {/* Category title */}
                <BaseText fontWeight="bold">
                  {t("PERMISSIONS.MODULES." + group.category)}
                </BaseText>

                {/* Permissions list */}
                <HStack wrap={"wrap"}>
                  {group.permissions.map((perm) => (
                    <BaseTag
                      key={perm.id}
                      fontSize="sm"
                      color="orange"
                      label={perm.name}
                    />
                  ))}
                </HStack>
              </Flex>
            ))}
          </VStack>
        </VStack>
      </FormCard>
    </MotionBox>
  );
};
