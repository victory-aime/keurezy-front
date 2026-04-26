import { VStack, Box, Flex, Separator, HStack, Stack } from '@chakra-ui/react';
import {
  BaseModal,
  Icons,
  BaseText,
  ModalOpenProps,
  BaseFormatNumber,
  BaseTag,
  BaseButton,
  BaseIcon,
  CustomSkeletonLoader,
} from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { ENUM } from '_types/*';
import { formatDisplayDate } from 'rise-core-frontend';
import { LeadsModalSection } from './LeadsSection';
import { useColorMode } from '_components/ui/color-mode';
import { FormCard } from '../../components/FormCard';

export const LeadsDetailsModal = ({
  isOpen,
  onChange,
  isLoading,
  pendingRequestCountForSelected,
  data,
  callback,
  onReject,
  isEmailVerified,
}: ModalOpenProps) => {
  const { colorMode } = useColorMode();

  return (
    <BaseModal
      isOpen={isOpen}
      onChange={onChange}
      onReject={onReject}
      onClick={callback}
      title="Candidature"
      description={`Candidature pour : ${data?.property?.title}`}
      status={data?.status}
      buttonCancelTitle="Fermer"
      buttonRejectTitle={data?.status === ENUM.COMMON.Status.NEW ? 'Rejeter' : ''}
      iconRejectButton={<Icons.Close />}
      iconSaveButton={<Icons.Check />}
      buttonSaveTitle={data?.status === ENUM.COMMON.Status.NEW ? 'Accepter' : ''}
      alignItems={'flex-end'}
      justifyContent={'flex-end'}
      isLoading={isLoading}
      disabled={!isEmailVerified}
    >
      <VStack alignItems="flex-start" gap={3}>
        {pendingRequestCountForSelected > 1 && (
          <Box
            width="full"
            p={4}
            rounded="lg"
            bgColor={colorMode === 'light' ? 'red.100' : 'red.900'}
            border="1px solid"
            borderColor="red.200"
          >
            <Flex gap={2}>
              <Icons.Warn size={44} color={VariablesColors.danger} />
              <BaseText fontWeight="medium">
                Ce bien possède {pendingRequestCountForSelected} candidatures en attente. En
                acceptant cette demande, les autres seront automatiquement rejetées.
              </BaseText>
            </Flex>
          </Box>
        )}

        <Box
          borderLeftWidth={2}
          boxShadow={'sm'}
          borderRadius={'lg'}
          borderColor={'primary.500'}
          p={4}
          width={'full'}
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
                <Stack gap={0}>
                  <BaseText>{data?.client?.user?.name}</BaseText>
                  <BaseText fontSize={'sm'} color={'gray.500'}>
                    {data?.client?.user?.email}
                  </BaseText>
                  <BaseText fontSize={'sm'} color={'gray.500'}>
                    {data?.client?.phone}
                  </BaseText>
                </Stack>
              </HStack>
              <BaseButton colorType="danger" variant={'outline'} onClick={() => callback?.()}>
                Supprimer
              </BaseButton>
            </Flex>
          )}
        </Box>
        <FormCard title="" loader={isLoading}>
          <VStack align="stretch" gap={0} width={'full'}>
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Bien demande</BaseText>
              <BaseText>{data?.property?.title ?? 'N/A'}</BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Date de Candidature</BaseText>
              <BaseText>{formatDisplayDate(data?.createdAt)}</BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Prix de location</BaseText>
              <BaseFormatNumber value={data?.property?.price ?? 0} />
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Status</BaseText>
              <BaseTag status={data?.status} />
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Agent Traiteur</BaseText>
              <BaseText textTransform={'capitalize'}> {data?.assignedTo?.user?.name} </BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Modifié le</BaseText>
              <BaseText> {formatDisplayDate(data?.updatedAt)} </BaseText>
            </Flex>
            <Separator />
          </VStack>
          <LeadsModalSection icon={<Icons.Chat />} title="Message du candidat">
            <Box
              width="full"
              p={4}
              rounded="lg"
              bgColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
              border="1px solid"
              borderColor="border"
            >
              {data?.message}
            </Box>
          </LeadsModalSection>
        </FormCard>
      </VStack>
    </BaseModal>
  );
};
