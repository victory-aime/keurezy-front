import { Flex, VStack, HStack } from "@chakra-ui/react";
import { BaseIcon, Icons, BaseText, BaseTag } from "_components/custom";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import { t } from "i18next";

export const SelectedPermissionsRecap = ({
  permissions,
}: {
  permissions: {
    category: string;
    permissions: {
      id: string;
      name: string;
      description: string;
    }[];
  }[];
}) => {
  if (!permissions)
    return <NoDataAnimation notFoundTitle="Aucune permissions disponible" />;

  return (
    <VStack gap={3} alignItems={"flex-start"} width={"full"}>
      <Flex alignItems={"center"} gap={2} mb={2} mt={4}>
        <BaseIcon>
          <Icons.Shield />
        </BaseIcon>
        <BaseText>
          Permissions accordées :{" "}
          {permissions.reduce(
            (acc, group) => acc + group.permissions.length,
            0,
          )}
        </BaseText>
      </Flex>
      <VStack align="stretch" width="full">
        {permissions.map((group) => (
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
  );
};
