import { Box, HStack, VStack, Flex, Separator } from '@chakra-ui/react';
import {
  BaseModal,
  Icons,
  BaseText,
  BaseTag,
  BaseFormatNumber,
  ModalOpenProps,
} from '_components/custom';
import { ENUM } from '_types/*';
import { formatDisplayDate, getTimeValue } from 'rise-core-frontend';
import { FormCard } from '../../components/FormCard';
import { LeadsModalSection, LeadsInfoItem } from '../../leads/components/LeadsSection';
import { useColorMode } from '_components/ui/color-mode';

export const VisitDetails = ({
  isOpen,
  onChange,
  data,
  isLoading,
  onEdit = () => {},
  onDelete = () => {},
}: ModalOpenProps) => {
  const { colorMode } = useColorMode();

  return (
    <BaseModal
      title={'Détail du rendez-vous'}
      isOpen={isOpen}
      onChange={onChange}
      icon={<Icons.Agenda />}
      status={data?.status}
      ignoreFooter
      showEditButton={data?.status !== ENUM.COMMON.Status.DONE}
      showDeleteButton={data?.status !== ENUM.COMMON.Status.DONE}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <Box p={1.5}>
        <HStack gap={3} justifyContent={'space-between'}>
          <HStack>
            <Icons.Calendar />
            <BaseText fontWeight="semibold">{formatDisplayDate(data?.scheduledAt)}</BaseText>
            <BaseText color="gray.500">
              {getTimeValue(data?.startTime!)} - {getTimeValue(data?.endTime!)}
            </BaseText>
          </HStack>
          <BaseTag status={data?.status} />
        </HStack>
      </Box>

      <FormCard title="" loader={isLoading}>
        <VStack align="stretch" gap={0} width={'full'}>
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Bien concerné</BaseText>
            <BaseText>{data?.lead?.property?.title ?? 'N/A'}</BaseText>
          </Flex>

          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Prix de location</BaseText>
            <BaseFormatNumber value={data?.lead?.property?.price ?? 0} />
          </Flex>

          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Agent Traiteur</BaseText>
            <BaseText textTransform={'capitalize'}>
              {data?.lead?.assignedTo?.user?.name ?? 'Aucun'}
            </BaseText>
          </Flex>
          <Separator />
        </VStack>
        <LeadsModalSection icon={<Icons.User />} title="Informations sur le prospect">
          <Flex width="full" alignItems={'flex-start'} gap={4} mt={2} mb={2}>
            <LeadsInfoItem
              icon={<Icons.User />}
              label={'Nom'}
              value={data?.lead?.client?.user?.name}
            />
            <LeadsInfoItem
              icon={<Icons.Mail />}
              label={'Email'}
              value={data?.lead?.client?.user?.email}
            />
            <LeadsInfoItem
              icon={<Icons.Phone />}
              label={'Tel'}
              value={data?.lead?.client?.phone || 'Non renseigné'}
            />
          </Flex>
        </LeadsModalSection>
        <LeadsModalSection icon={<Icons.Chat />} title="Message du candidat">
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
        </LeadsModalSection>
      </FormCard>
    </BaseModal>
  );
};
