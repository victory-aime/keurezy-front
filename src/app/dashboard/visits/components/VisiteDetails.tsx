import { Box, HStack, VStack, Flex, Separator, Span } from '@chakra-ui/react';
import { BaseModal, Icons, BaseText, BaseFormatNumber, ModalOpenProps } from '_components/custom';
import { ENUM } from '_types/*';
import { formatDisplayDate, getTimeValue } from 'rise-core-frontend';
import { FormCard } from '../../components/FormCard';
import { DetailsModalSection, DetailsInfoItem } from '../../components/DetailsSection';
import { useColorMode } from '_components/ui/color-mode';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';

export const VisitDetails = ({
  isOpen,
  onChange,
  data,
  isLoading,
  onEdit = () => {},
  onDelete = () => {},
}: ModalOpenProps) => {
  const { colorMode } = useColorMode();
  const { hasPermission } = usePermissions();

  return (
    <BaseModal
      title={'Détail du rendez-vous'}
      isOpen={isOpen}
      onChange={onChange}
      icon={<Icons.Agenda />}
      status={data?.status}
      ignoreFooter
      showEditButton={
        data?.status !== ENUM.COMMON.Status.DONE && hasPermission(AppPermissions.VISITS.UPDATE)
      }
      showDeleteButton={
        data?.status !== ENUM.COMMON.Status.DONE && hasPermission(AppPermissions.VISITS.CANCEL)
      }
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <FormCard title="" loader={isLoading}>
        <VStack align="stretch" gap={0} width={'full'}>
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Programmé</BaseText>
            <BaseText fontWeight="semibold">
              {formatDisplayDate(data?.scheduledAt)}{' '}
              <Span color="gray.500" fontWeight="normal">
                - {getTimeValue(data?.startTime!)} - {getTimeValue(data?.endTime!)}
              </Span>
            </BaseText>
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Bien concerné</BaseText>
            <BaseText>{data?.property?.title ?? 'N/A'}</BaseText>
          </Flex>

          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Prix de location</BaseText>
            <BaseFormatNumber value={data?.property?.price ?? 0} />
          </Flex>

          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Agent Traiteur</BaseText>
            <BaseText textTransform={'capitalize'}>{data?.agent?.user?.name ?? 'Aucun'}</BaseText>
          </Flex>
          <Separator />
        </VStack>
        <DetailsModalSection icon={<Icons.User />} title="Informations sur le prospect" mt={4}>
          <Flex width="full" alignItems={'flex-start'} gap={4} mt={2} mb={2}>
            <DetailsInfoItem icon={<Icons.User />} label={'Nom'} value={data?.client?.user?.name} />
            <DetailsInfoItem
              icon={<Icons.Mail />}
              label={'Email'}
              value={data?.client?.user?.email}
            />
            <DetailsInfoItem
              icon={<Icons.Phone />}
              label={'Tel'}
              value={data?.client?.phone || 'Non renseigné'}
            />
          </Flex>
        </DetailsModalSection>
        <DetailsModalSection icon={<Icons.Chat />} title="Message du candidat" mt={4}>
          <Box
            width="full"
            p={4}
            rounded="lg"
            bgColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
            border="1px solid"
            borderColor="border"
          >
            {data?.notes}
          </Box>
        </DetailsModalSection>
      </FormCard>
    </BaseModal>
  );
};
