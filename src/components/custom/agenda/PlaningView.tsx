// ---------------------------------------------------------------------------
// Planing view
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BaseTag } from '../tag';
import { getStatusColor } from '../utils';
import { PlaningViewProps } from './interface/agenda';

// ---------------------------------------------------------------------------
export const PlaningView = <TMeta = Record<string, any>,>({
  events,
  onSelectEvent,
  renderEventSubtitle,
}: PlaningViewProps<TMeta>) => {
  const sorted = [...events].sort((a, b) => +new Date(a.start) - +new Date(b.start));
  const grouped = sorted.reduce<Record<string, any[]>>((acc, a) => {
    const key = format(new Date(a.date), 'yyyy-MM-dd');
    (acc[key] ||= []).push(a);
    return acc;
  }, {});
  const keys = Object.keys(grouped);

  if (!keys.length) {
    return (
      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="border"
        bg="bg.canvas"
        p={12}
        textAlign="center"
      >
        <Text fontSize="sm" color="fg.muted">
          Aucune visite à venir
        </Text>
      </Box>
    );
  }

  return (
    <Flex flexDir="column" gap={4}>
      {keys.map((k) => (
        <Box key={k} borderRadius="xl" border="1px solid" borderColor="border" overflow="hidden">
          <Box px={4} py={2} borderBottom="1px solid" borderColor="border" bg="bg.subtle">
            <Text fontSize="sm" fontWeight="semibold" textTransform="capitalize">
              {format(new Date(k), 'EEEE d MMMM', { locale: fr })}
            </Text>
          </Box>

          <Flex flexDir="column">
            {grouped[k].map((a, idx) => {
              const variant = getStatusColor(a.status);
              return (
                <Flex
                  key={a.id}
                  as="button"
                  w="full"
                  textAlign="left"
                  p={4}
                  alignItems="center"
                  gap={4}
                  borderTop={idx > 0 ? '1px solid' : 'none'}
                  borderColor="border"
                  cursor="pointer"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background 0.15s ease"
                  onClick={() => onSelectEvent(a)}
                >
                  <Box textAlign="center" minW="60px">
                    <Text fontSize="sm" fontWeight="semibold">
                      {format(new Date(a?.start), 'HH:mm')}
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      {format(new Date(a?.end), 'HH:mm')}
                    </Text>
                  </Box>

                  <Box w={1} h={10} borderRadius="full" bg={`${variant}.500`} flexShrink={0} />

                  <Box flex={1} minW={0}>
                    <Box flex={1} minW={0}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {a.title}
                      </Text>

                      {renderEventSubtitle && (
                        <Text
                          fontSize="xs"
                          color="fg.muted"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {renderEventSubtitle(a)}
                        </Text>
                      )}
                    </Box>
                  </Box>
                  <BaseTag status={a?.status} />
                </Flex>
              );
            })}
          </Flex>
        </Box>
      ))}
    </Flex>
  );
};
