import { Box, Grid, Flex, Text } from '@chakra-ui/react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useMemo } from 'react';
import { MonthViewProps } from './interface/agenda';
import { getStatusColor } from '../utils';
import { Weeks } from '_utils/generate';
import { t } from 'i18next';
import { CustomSkeletonLoader } from '_components/custom';

export const MonthView = <TMeta = Record<string, any>,>({
  current,
  events,
  onSelectSlot,
  onSelectEvent,
  renderEventSubtitle,
  maxVisibleEvents = 3,
  loading,
}: MonthViewProps<TMeta>) => {
  // --------------------------------------------------------------------
  // Calendar days
  // --------------------------------------------------------------------

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), {
      weekStartsOn: 1,
    });
    const end = endOfWeek(endOfMonth(current), {
      weekStartsOn: 1,
    });

    return eachDayOfInterval({
      start,
      end,
    });
  }, [current]);

  return (
    <Box borderRadius="xl" border="1px solid" borderColor="border" bg="bg.canvas" overflow="hidden">
      {/* Week days header */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        borderBottom="1px solid"
        borderColor="border"
        bg="bg.subtle"
      >
        {Weeks().map((day, i) => (
          <Box key={i} px={3} py={2}>
            <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
              {t(day)}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Calendar cells */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        style={{
          gridAutoRows: '120px',
        }}
      >
        {days?.map((day) => {
          const inMonth = isSameMonth(day, current);
          const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day));
          return (
            <Box
              key={day?.toISOString()}
              borderBottom="1px solid"
              borderRight="1px solid"
              borderColor="border"
              p={1.5}
              display="flex"
              flexDir="column"
              gap={1}
              overflow="hidden"
              cursor="pointer"
              transition="background 0.15s ease"
              bg={inMonth ? 'transparent' : 'bg.subtle'}
              opacity={inMonth ? 1 : 0.5}
              _hover={{
                bg: 'bg.subtle',
              }}
              onClick={() => {
                const start = new Date(day);
                start.setHours(10, 0, 0, 0);
                onSelectSlot(start);
              }}
            >
              {/* Day number */}
              <Flex alignItems="center" justifyContent="space-between">
                <Box
                  h={6}
                  w={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  bg={isToday(day) ? 'primary.500' : 'transparent'}
                  color={isToday(day) ? 'white' : inMonth ? 'fg' : 'fg.muted'}
                >
                  {format(day, 'd')}
                </Box>
              </Flex>

              {/* Events */}
              {loading ? (
                <CustomSkeletonLoader type={'TEXT'} numberOfLines={1} />
              ) : (
                <Flex flexDir="column" gap="2px" overflow="hidden">
                  {dayEvents.slice(0, maxVisibleEvents).map((event) => {
                    const colorPalette = getStatusColor(event?.status);
                    return (
                      <Box
                        key={event.id}
                        as="button"
                        textAlign="left"
                        overflow="hidden"
                        borderRadius="md"
                        px={1.5}
                        py="2px"
                        border="1px solid"
                        borderColor={`${colorPalette}.50`}
                        bg={`${colorPalette}.50`}
                        color={`${colorPalette}.700`}
                        cursor="pointer"
                        transition="all 0.15s ease"
                        _hover={{
                          filter: 'brightness(0.97)',
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onSelectEvent(event);
                        }}
                      >
                        <Flex alignItems="center" gap={1} minW={0}>
                          {/* Status dot */}
                          <Box
                            h="6px"
                            w="6px"
                            borderRadius="full"
                            bg={`${colorPalette}.500`}
                            flexShrink={0}
                          />

                          {/* Content */}
                          <Box flex={1} minW={0}>
                            <Text
                              fontSize="10px"
                              fontWeight="medium"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {format(new Date(event.start), 'HH:mm')} {event.title}
                            </Text>

                            {renderEventSubtitle && (
                              <Text
                                fontSize="9px"
                                opacity={0.8}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {renderEventSubtitle(event)}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      </Box>
                    );
                  })}

                  {dayEvents?.length > maxVisibleEvents && (
                    <Text fontSize="10px" color="fg.muted" pl={1}>
                      +{dayEvents.length - maxVisibleEvents} de plus
                    </Text>
                  )}
                </Flex>
              )}
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};
