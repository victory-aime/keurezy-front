import { SimpleGrid } from '@chakra-ui/react';
import { BaseStats, Icons } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { useMemo } from 'react';

export const BookingsStatsCard = ({
  bookings,
  isLoading,
}: {
  bookings: MODELS.IAgencyBooking[];
  isLoading?: boolean;
}) => {
  const stats = useMemo(() => {
    const byStatus = (...statuses: ENUM.BookingStatus[]) =>
      bookings.filter((booking) => statuses.includes(booking.status));
    const confirmed = byStatus(ENUM.BookingStatus.CONFIRMED, ENUM.BookingStatus.COMPLETED);

    return [
      {
        title: 'À traiter',
        value: byStatus(ENUM.BookingStatus.PENDING).length,
        icon: <Icons.Timer />,
        iconBgColor: 'warning.500',
      },
      {
        title: 'Confirmées',
        value: confirmed.length,
        icon: <Icons.Check />,
        iconBgColor: 'tertiary.500',
      },
      {
        title: 'Refusées / annulées',
        value: byStatus(ENUM.BookingStatus.REJECTED, ENUM.BookingStatus.CANCELLED).length,
        icon: <Icons.Close />,
        iconBgColor: 'red.500',
      },
      {
        title: 'Montant confirmé',
        value: confirmed.reduce((total, booking) => total + booking.totalAmount, 0),
        icon: <Icons.CreditCard />,
        iconBgColor: 'primary.500',
        currency: ENUM.COMMON.Currency.XAF,
        isNumber: true,
      },
    ];
  }, [bookings]);

  return (
    <SimpleGrid width={'full'} mt={'40px'} columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {stats.map((stat) => (
        <BaseStats key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </SimpleGrid>
  );
};
