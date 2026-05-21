// ---------------------------------------------------------------------------
// Time grid — day & week views
// ---------------------------------------------------------------------------

import { Box, Grid, Text } from '@chakra-ui/react';
import { startOfWeek, addDays, isToday, isSameDay, format } from 'date-fns';
import { useMemo, useState, useRef } from 'react';
import { TimeGridViewProps } from './interface/agenda';
import { AGENDA_HOURS, AGENDA_SLOT_HEIGHT, STATUS_META_AGENDA } from './constants/agenda';
import { fr } from 'date-fns/locale';
import { getStatusColor } from '../utils';

export const TimeGridView = <TMeta = Record<string, any>,>({
  view,
  current,
  events,
  onSelectSlot,
  onSelectEvent,
  onMoveEvent,
  onResizeEvent,
  renderEventSubtitle,
  loading,
}: TimeGridViewProps<TMeta>) => {
  const days = useMemo(() => {
    if (view === 'day') return [current];
    const start = startOfWeek(current, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [view, current]);

  const [dragId, setDragId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null);
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const onDragStart = (id: string, mode: 'move' | 'resize') => (e: React.DragEvent) => {
    setDragId(id);
    setDragMode(mode);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const onDropDay = (day: Date) => (e: React.DragEvent) => {
    e.preventDefault();

    if (!dragId || !dragMode) return;

    const col = colRefs.current[day.toDateString()];

    if (!col) return;

    const rect = col.getBoundingClientRect();

    const y = e.clientY - rect.top;

    const minutes = Math.max(0, Math.round(((y / AGENDA_SLOT_HEIGHT) * 60) / 15) * 15);

    const newDate = new Date(day);

    newDate.setHours(AGENDA_HOURS[0], 0, 0, 0);

    newDate.setMinutes(minutes);

    if (dragMode === 'move') {
      onMoveEvent(dragId, newDate);
    } else {
      onResizeEvent(dragId, newDate);
    }

    setDragId(null);
    setDragMode(null);
  };

  const gridTemplateColumns = view === 'day' ? '60px 1fr' : `60px repeat(${days.length}, 1fr)`;

  return (
    <Box borderRadius="xl" border="1px solid" borderColor="border" bg="bg.canvas" overflow="hidden">
      {/* Column headers */}
      <Grid
        templateColumns={gridTemplateColumns}
        borderBottom="1px solid"
        borderColor="border"
        bg="bg.subtle"
      >
        {/* Empty corner above the AGENDA_HOURS column */}
        <Box />
        {days?.map((day) => (
          <Box key={day?.toISOString()} px={3} py={2} textAlign="center">
            <Text
              fontSize="10px"
              fontWeight="semibold"
              textTransform="uppercase"
              color="fg.muted"
              letterSpacing="wider"
            >
              {format(day, 'EEE', { locale: fr })}
            </Text>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              h={7}
              w={7}
              mt="1px"
              borderRadius="full"
              bg={isToday(day) ? 'blue.500' : 'transparent'}
            >
              <Text fontSize="sm" fontWeight="semibold" color={isToday(day) ? 'white' : 'fg'}>
                {format(day, 'd')}
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>

      {/* Scrollable time grid */}
      <Grid
        templateColumns={gridTemplateColumns}
        position="relative"
        style={{ height: AGENDA_SLOT_HEIGHT * AGENDA_HOURS.length }}
      >
        {/* AGENDA_HOURS gutter */}
        <Box position="relative" borderRight="1px solid" borderColor="border">
          {AGENDA_HOURS.map((h, i) => (
            <Box
              key={h}
              position="absolute"
              left={0}
              right={0}
              px={1}
              fontSize="10px"
              color="fg.muted"
              textAlign="right"
              style={{ top: i * AGENDA_SLOT_HEIGHT - 6 }}
            >
              {String(h).padStart(2, '0')}:00
            </Box>
          ))}
        </Box>

        {/* Day columns */}
        {days?.map((day, dayIdx) => {
          const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day));
          return (
            <Box
              key={dayIdx}
              ref={(el: HTMLDivElement | null) => {
                colRefs.current[day?.toDateString()] = el;
              }}
              position="relative"
              borderRight={dayIdx < days.length - 1 ? '1px solid' : 'none'}
              borderColor="border"
              cursor="pointer"
              onDragOver={(e: React.DragEvent) => e.preventDefault()}
              onDrop={onDropDay(day)}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const minutes = Math.max(0, Math.round(((y / AGENDA_SLOT_HEIGHT) * 60) / 30) * 30);
                const start = new Date(day);
                start.setHours(AGENDA_HOURS[0], 0, 0, 0);
                start.setMinutes(minutes);
                onSelectSlot(start);
              }}
            >
              {/* Hour divider lines */}
              {AGENDA_HOURS.map((_, i) => (
                <Box
                  key={i}
                  position="absolute"
                  left={0}
                  right={0}
                  // top={i * AGENDA_SLOT_HEIGHT}
                  // h={AGENDA_SLOT_HEIGHT}
                  borderTop="1px solid"
                  borderColor="border"
                  opacity={0.4}
                  style={{ top: i * AGENDA_SLOT_HEIGHT, height: AGENDA_SLOT_HEIGHT }}
                  pointerEvents="none"
                />
              ))}

              {/* Event blocks */}
              {dayEvents.map((a) => {
                const s = new Date(a.start);
                const e = new Date(a.end);
                const top =
                  (s.getHours() - AGENDA_HOURS[0]) * AGENDA_SLOT_HEIGHT +
                  (s.getMinutes() / 60) * AGENDA_SLOT_HEIGHT;
                const height = Math.max(24, ((+e - +s) / 3_600_000) * AGENDA_SLOT_HEIGHT);
                const colorPalette = getStatusColor(a.status);

                return (
                  <Box
                    key={a.id}
                    draggable
                    onDragStart={onDragStart(a.id, 'move')}
                    onClick={(ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      onSelectEvent(a);
                    }}
                    position="absolute"
                    left={1}
                    right={1}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={`${colorPalette}.200`}
                    bg={`${colorPalette}.50`}
                    color={`${colorPalette}.700`}
                    p={2}
                    boxShadow="sm"
                    cursor="grab"
                    overflow="hidden"
                    _hover={{ boxShadow: 'md', filter: 'brightness(0.97)' }}
                    _active={{ cursor: 'grabbing' }}
                    transition="box-shadow 0.15s ease, filter 0.15s ease"
                    style={{ top, height }}
                  >
                    {/* Left accent bar */}
                    <Box
                      position="absolute"
                      left={0}
                      top={0}
                      bottom={0}
                      w="3px"
                      borderRadius="lg 0 0 lg"
                      bg={`${colorPalette}.500`}
                    />

                    <Text
                      fontSize="11px"
                      fontWeight="semibold"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      pl={2}
                    >
                      {a.title}
                    </Text>
                    {renderEventSubtitle && (
                      <Text
                        fontSize="10px"
                        opacity={0.75}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {renderEventSubtitle(a)}
                      </Text>
                    )}

                    {/* Resize handle */}
                    <Box
                      draggable
                      onDragStart={(ev: React.DragEvent) => {
                        ev.stopPropagation();
                        onDragStart(a.id, 'resize')(ev);
                      }}
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      h="6px"
                      cursor="ns-resize"
                      bg={`${colorPalette}.500`}
                      opacity={0.3}
                      borderRadius="0 0 lg lg"
                      _hover={{ opacity: 0.6 }}
                      transition="opacity 0.15s"
                    />
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};
