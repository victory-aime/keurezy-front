import { Box, Flex, HStack, Separator, Stack, VStack } from '@chakra-ui/react';
import {
  BaseButton,
  BaseFormatNumber,
  BaseIcon,
  BaseModal,
  BaseTag,
  BaseText,
  Icons,
  ModalOpenProps,
  BaseBadge,
} from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { ENUM, MODELS } from '_types/*';
import { formatDisplayDate } from 'rise-core-frontend';
import { useColorMode } from '_components/ui/color-mode';
import { useRouter } from 'next/navigation';
import { ChatModule } from '_store/state-management';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { DASHBOARD_ROUTES } from '../../routes/routes';
import { DetailsModalSection } from '../../components/DetailsSection';
import { FormCard } from '../../components/FormCard';
import {
  formatBookingDate,
  formatRentalDuration,
  getRentalTypeMeta,
  toTagStatus,
} from '_utils/bookings';

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <Flex py={2} justify="space-between" gap={4}>
      <BaseText color="gray.500">{label}</BaseText>
      {typeof children === 'string' ? (
        <BaseText textAlign={'right'}>{children}</BaseText>
      ) : (
        children
      )}
    </Flex>
    <Separator />
  </>
);

export const BookingDetailsModal = ({
  isOpen,
  onChange,
  isLoading,
  data,
  overlappingPending,
  callback,
  onReject,
  onCancelBooking,
  isEmailVerified,
}: ModalOpenProps & {
  data: MODELS.IAgencyBooking | null;
  overlappingPending: number;
  /** Ouvre la confirmation d'annulation (réservation confirmée à venir) */
  onCancelBooking?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  // Décision (confirmer / refuser) : demande en attente et permission de traiter les réservations
  const canManage = hasPermission(AppPermissions.BOOKINGS.MANAGE);
  const isPending = data?.status === ENUM.BookingStatus.PENDING && canManage;
  // Annulation par l'agence : séjour confirmé qui n'a pas commencé (règle du backend)
  const today = new Date().toLocaleDateString('sv'); // AAAA-MM-JJ, jour local
  const isCancellable =
    data?.status === ENUM.BookingStatus.CONFIRMED &&
    data.startDate.slice(0, 10) > today &&
    canManage;

  // Discussion du bien avec ce client, réservation en contexte (retrouvée ou créée)
  const { mutate: openConversation, isPending: isOpeningChat } =
    ChatModule.openBookingConversationMutation({
      mutationOptions: {
        onSuccess: (conversation) => router.push(`${DASHBOARD_ROUTES.CHAT}?c=${conversation.id}`),
      },
    });
  const closingReason = data?.rejectionReason ?? data?.cancellationReason;

  return (
    <BaseModal
      isOpen={isOpen}
      onChange={onChange}
      onReject={isPending ? onReject : onCancelBooking}
      onClick={callback}
      title="Demande de réservation"
      description={data?.property?.title}
      status={data ? toTagStatus(data.status) : undefined}
      buttonCancelTitle="Fermer"
      buttonRejectTitle={isPending ? 'Refuser' : isCancellable ? 'Annuler la réservation' : ''}
      iconRejectButton={<Icons.Close />}
      iconSaveButton={<Icons.Check />}
      buttonSaveTitle={isPending ? 'Confirmer la réservation' : ''}
      alignItems={'flex-end'}
      justifyContent={'flex-end'}
      isLoading={isLoading}
      disabled={!isEmailVerified}
    >
      <VStack alignItems="flex-start" gap={3}>
        {isPending && overlappingPending > 0 && (
          <Box
            width="full"
            p={4}
            rounded="lg"
            bgColor={colorMode === 'light' ? 'orange.50' : 'orange.900'}
            border="1px solid"
            borderColor="orange.200"
          >
            <Flex gap={2}>
              <Icons.Warn size={32} color={VariablesColors.warning} />
              <BaseText fontWeight="medium">
                {overlappingPending} autre{overlappingPending > 1 ? 's' : ''} demande
                {overlappingPending > 1 ? 's' : ''} en attente sur ces dates. En confirmant
                celle-ci, {overlappingPending > 1 ? 'elles seront' : 'elle sera'} automatiquement
                refusée{overlappingPending > 1 ? 's' : ''}.
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
          <HStack alignItems={'flex-start'}>
            <BaseIcon>
              <Icons.User />
            </BaseIcon>
            <Stack gap={0}>
              <BaseText textTransform={'capitalize'}>
                {data?.client?.name ?? 'Client supprimé'}
              </BaseText>
              <BaseText fontSize={'sm'} color={'gray.500'}>
                {data?.client?.email}
              </BaseText>
              {data?.client?.phone && (
                <BaseText fontSize={'sm'} color={'gray.500'}>
                  {data.client.phone}
                </BaseText>
              )}
            </Stack>
            {data?.client && hasPermission(AppPermissions.CONVERSATIONS.VIEW) && (
              <BaseButton
                ml={'auto'}
                size={'sm'}
                variant={'outline'}
                leftIcon={<Icons.Chat size={14} />}
                isLoading={isOpeningChat}
                onClick={() => openConversation({ payload: { bookingId: data.id } })}
              >
                Contacter le client
              </BaseButton>
            )}
          </HStack>
        </Box>

        {data && (
          <FormCard title="">
            <VStack align="stretch" gap={0} width={'full'}>
              <DetailRow label="Modalité">
                <BaseBadge
                  color="tertiary"
                  variant="subtle"
                  size="sm"
                  label={`Location ${getRentalTypeMeta(data.rentalType)?.label.toLowerCase()}`}
                />
              </DetailRow>
              <DetailRow label="Début">{formatBookingDate(data.startDate, true)}</DetailRow>
              <DetailRow label="Fin (inclus)">{formatBookingDate(data.endDate, true)}</DetailRow>
              <DetailRow label="Libération du bien">
                {formatBookingDate(data.checkOutDate, true)}
              </DetailRow>
              <DetailRow label="Durée">
                {formatRentalDuration(data.duration, data.rentalType)}
              </DetailRow>
              <DetailRow label="Montant de la location">
                <BaseFormatNumber
                  value={data.totalAmount}
                  currencyCode={ENUM.COMMON.Currency.XAF}
                />
              </DetailRow>
              <DetailRow label="Caution">
                <BaseFormatNumber
                  value={data.depositAmount}
                  currencyCode={ENUM.COMMON.Currency.XAF}
                />
              </DetailRow>
              <DetailRow label="Demande reçue le">{formatDisplayDate(data.createdAt)}</DetailRow>
              <DetailRow label="Statut">
                <BaseTag status={toTagStatus(data.status)} />
              </DetailRow>
            </VStack>

            {closingReason && (
              <DetailsModalSection icon={<Icons.Close />} title="Motif">
                <BaseText color={'fg.muted'}>{closingReason}</BaseText>
              </DetailsModalSection>
            )}

            <DetailsModalSection icon={<Icons.Chat />} title="Message du client">
              <Box
                width="full"
                p={4}
                rounded="lg"
                bgColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
                border="1px solid"
                borderColor="border"
              >
                {data.notes || 'Aucun message.'}
              </Box>
            </DetailsModalSection>
          </FormCard>
        )}
      </VStack>
    </BaseModal>
  );
};
