import { Flex, Box, Stack, HStack } from '@chakra-ui/react';
import {
  BaseButton,
  BaseDrawer,
  BaseIcon,
  BaseTag,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  ModalOpenProps,
} from '_components/custom';
import { FormCard } from '../../components/FormCard';
import { CONSTANTS, MODELS } from '_types/*';
import { SelectedPermissionsRecap } from '../../components/SelectedPermissionsRecap';
import { useMemo } from 'react';
import { groupPermissionsByCategory } from '_hooks/groupedPermissions';

interface TeamDetails extends ModalOpenProps {
  data: MODELS.ITeam | null;
}

export const TeamDetails = ({ isOpen, onChange, data, isLoading, callback }: TeamDetails) => {
  const defaultPermissions = useMemo(() => {
    if (!data?.permissions) return [];

    return groupPermissionsByCategory(data);
  }, [data]);

  return (
    <BaseDrawer
      title={'Detail du membre'}
      description={' Visualisation des informations du membre'}
      size={'xl'}
      icon={<Icons.User />}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter
    >
      <Box
        borderLeftWidth={2}
        boxShadow={'sm'}
        borderRadius={'lg'}
        borderColor={'primary.500'}
        p={4}
        mb={4}
      >
        {isLoading ? (
          <Flex gap={2} justifyContent={'space-between'}>
            <HStack gap={2}>
              <CustomSkeletonLoader type="BUTTON" colorButton="primary" width={'40px'} />
              <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
            </HStack>
            <CustomSkeletonLoader type="BUTTON" colorButton="primary" width={'110px'} />
          </Flex>
        ) : (
          <Flex alignItems={'center'} justifyContent={'space-between'} gap={5}>
            <HStack alignItems={'flex-start'}>
              <BaseIcon>
                <Icons.User />
              </BaseIcon>
              <Stack gap={1} alignItems={'flex-start'}>
                <BaseText>{data?.name}</BaseText>
                <BaseText color={'gray.600'}>{data?.email}</BaseText>
                <BaseTag
                  label={
                    CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === (data?.role as string))
                      ?.label ?? data?.role
                  }
                  textTransform={'capitalize'}
                />
              </Stack>
            </HStack>
            <BaseButton
              colorType={data?.status ? 'danger' : 'tertiary'}
              variant={'outline'}
              onClick={() => callback?.()}
            >
              {data?.status ? 'Desactiver' : 'Activer'}
            </BaseButton>
          </Flex>
        )}
      </Box>
      <FormCard title="" loader={isLoading}>
        <SelectedPermissionsRecap permissions={defaultPermissions} />
      </FormCard>
    </BaseDrawer>
  );
};
