import { VStack, Box, Flex } from '@chakra-ui/react';
import { BaseModal, Icons, BaseText, ModalOpenProps } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { ENUM } from '_types/*';
import { DAY_MONTH_YEAR_SHORT, formatDisplayDate } from 'rise-core-frontend';
import { ApplicationModalSection, ApplicationInfoItem } from './ApplicationSection';
import { useColorMode } from '_components/ui/color-mode';

export const ApplicationModal = ({
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
      buttonRejectTitle={data?.status === ENUM.COMMON.Status.PENDING ? 'Rejeter' : ''}
      iconRejectButton={<Icons.Close />}
      iconSaveButton={<Icons.Check />}
      buttonSaveTitle={data?.status === ENUM.COMMON.Status.PENDING ? 'Accepter' : ''}
      alignItems={'flex-end'}
      justifyContent={'flex-end'}
      isLoading={isLoading}
      disabled={!isEmailVerified}
    >
      <VStack alignItems="flex-start" gap={6}>
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
        <ApplicationModalSection icon={<Icons.User />} title="Informations">
          <Flex width="full" gap={4} justifyContent="space-between" flexWrap="wrap">
            <ApplicationInfoItem icon={<Icons.User />} label="Nom" value={data?.tenant?.name} />
            <ApplicationInfoItem icon={<Icons.Mail />} label="Email" value={data?.tenant?.email} />
            <ApplicationInfoItem icon={<Icons.Phone />} label="Phone" value={data?.phone} />
          </Flex>
        </ApplicationModalSection>

        <ApplicationModalSection icon={<Icons.RiBuildingLine />} title="Détails de la demande">
          <Flex width="full" gap={4} justifyContent="space-between" flexWrap="wrap">
            <ApplicationInfoItem
              icon={<Icons.RiBuildingLine />}
              label="Bien"
              value={data?.property?.title}
            />
            <ApplicationInfoItem
              icon={<Icons.User />}
              label="Date d'emménagement"
              value={formatDisplayDate(data?.startDate, DAY_MONTH_YEAR_SHORT)}
            />
            <ApplicationInfoItem
              icon={<Icons.User />}
              label="Date de Candidature"
              value={formatDisplayDate(data?.createdAt)}
            />
          </Flex>
        </ApplicationModalSection>

        <ApplicationModalSection icon={<Icons.Chat />} title="Message du candidat">
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
        </ApplicationModalSection>
      </VStack>
    </BaseModal>
  );
};
