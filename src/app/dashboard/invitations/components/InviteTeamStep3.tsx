import { MotionBox } from "_constants/motion";
import { FormCard } from "../../components/FormCard";
import { useFormikContext } from "formik";
import { Avatar } from "_components/ui/avatar";
import { Flex, Stack, VStack } from "@chakra-ui/react";
import { BaseTag, BaseText } from "_components/custom";
import { ISelectPermissions, IInviteTeamUserInfo } from "../constants/team";
import { MODELS } from "_types/*";
import { useGroupedPermissions } from "_hooks/useGroupedPermissions";
import { SelectedPermissionsRecap } from "../../components/SelectedPermissionsRecap";

export const InviteTeamStep3 = ({
  permissions,
  isLoading,
}: {
  permissions: MODELS.COMMON.IGetAllPermissionResponse[];
  isLoading: boolean;
}) => {
  const { values } = useFormikContext<{
    account: IInviteTeamUserInfo;
    permissions: ISelectPermissions[];
  }>();

  const groupedPermissions = useGroupedPermissions(
    permissions,
    values?.permissions,
  );

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
          <SelectedPermissionsRecap permissions={groupedPermissions} />
        </VStack>
      </FormCard>
    </MotionBox>
  );
};
