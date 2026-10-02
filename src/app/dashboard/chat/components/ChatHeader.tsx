'use client';

import { Flex, Box, Image, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { BaseIcon, BaseTag, Icons, BaseText } from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { useChatPresence } from '_hooks/chat/useChatPresence';
import { DASHBOARD_ROUTES } from '../../routes/routes';
import { formatBookingDate, toTagStatus } from '_utils/bookings';
import { ChatHeaderProps } from '../interface/chat';

/** Client (présence, téléphone) et contexte : bien, réservation. */
export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const client = conversation?.client;
  const property = conversation?.property;
  const booking = conversation?.booking;
  const { data: isOnline } = useChatPresence(client?.userId);

  return (
    <Flex
      direction="column"
      gap={2}
      px={3}
      py={2.5}
      borderBottom="1px solid"
      borderColor="inherit"
      flexShrink={0}
    >
      <Flex align="center" gap={3}>
        {onBack && (
          <BaseIcon
            boxSize={'30px'}
            rounded={'full'}
            cursor={'pointer'}
            aria-label="Retour"
            onClick={onBack}
          >
            <Icons.IoIosArrowRoundBack />
          </BaseIcon>
        )}

        <Avatar size="sm" name={client?.name} />

        <Box flex={1} minW={0}>
          <BaseText fontSize="sm" fontWeight="600" truncate>
            {client?.name ?? 'Client'}
          </BaseText>
          <Flex align="center" gap={1.5}>
            <Box w="6px" h="6px" rounded="full" bg={isOnline ? 'green.500' : 'gray.400'} />
            <BaseText fontSize="xs" color="fg.muted">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </BaseText>
          </Flex>
        </Box>

        {client?.phone && (
          <Link
            href={`tel:${client.phone.replace(/[^\d+]/g, '')}`}
            aria-label={`Appeler ${client.name}`}
            display="flex"
            alignItems="center"
            gap={1.5}
            fontSize="xs"
            fontWeight="600"
            color="primary.500"
            px={3}
            py={1.5}
            borderRadius="full"
            borderWidth="1px"
            borderColor="primary.500"
          >
            <Icons.Phone size={14} />
            {client.phone}
          </Link>
        )}
      </Flex>

      {property && (
        <Flex align="center" gap={3} p={2} borderRadius="12px" bg="bg.muted">
          {property.coverImage ? (
            <Image
              src={property.coverImage}
              alt=""
              boxSize="40px"
              borderRadius="8px"
              objectFit="cover"
            />
          ) : (
            <BaseIcon boxSize="40px">
              <Icons.Home />
            </BaseIcon>
          )}
          <Box flex={1} minW={0}>
            <BaseText fontSize="sm" fontWeight="600" truncate>
              {property.title}
            </BaseText>
            <BaseText fontSize="xs" color="fg.muted" truncate>
              {booking
                ? `Réservation du ${formatBookingDate(booking.startDate)} au ${formatBookingDate(booking.endDate)}`
                : 'Demande d’informations, sans réservation'}
            </BaseText>
          </Box>
          {booking && (
            <Flex align="center" gap={2}>
              <BaseTag status={toTagStatus(booking.status)} />
              <Link asChild fontSize="xs" fontWeight="600" color="primary.500">
                <NextLink href={DASHBOARD_ROUTES.BOOKINGS}>Voir</NextLink>
              </Link>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}
