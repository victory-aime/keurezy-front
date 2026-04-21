import { Accordion, Flex, VStack } from '@chakra-ui/react';
import { Skeleton, SkeletonCircle } from '_components/ui/skeleton';

export const SidebarSkeleton = ({
  isCollapsed,
  groups = 3,
}: {
  isCollapsed?: boolean;
  groups?: number;
}) => {
  return (
    <VStack align="stretch" gap={4}>
      {Array.from({ length: groups }).map((_, i) => (
        <SidebarGroupSkeleton
          key={i}
          isCollapsed={isCollapsed}
          links={Math.floor(Math.random() * 4) + 3}
        />
      ))}
    </VStack>
  );
};

export const SidebarGroupSkeleton = ({
  isCollapsed,
  links = 5,
}: {
  isCollapsed?: boolean;
  links?: number;
}) => {
  return (
    <Accordion.Root collapsible defaultValue={['skeleton']}>
      <Accordion.Item value="skeleton" border="none">
        <Accordion.ItemTrigger py={1} alignItems={'center'} justifyContent={'space-between'}>
          {isCollapsed ? (
            <Flex gap={2} alignItems={'center'}>
              <SkeletonCircle size="5" />
              <Skeleton height="10px" width="80px" />
            </Flex>
          ) : (
            <SkeletonCircle size="4" />
          )}

          <Skeleton height="10px" width="10px" />
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Accordion.ItemBody px={0}>
            <VStack align="stretch" gap={1} width={'full'}>
              {Array.from({ length: links }).map((_, i) => {
                const hasBadge = Math.random() > 0.6;

                return (
                  <Flex
                    key={i}
                    align="center"
                    width={'full'}
                    gap={3}
                    px={3}
                    py={2}
                    borderRadius="md"
                    justifyContent={isCollapsed ? 'center' : 'flex-start'}
                  >
                    {/* ICON */}
                    <SkeletonCircle size="4" />

                    {/* LABEL + BADGE */}
                    {isCollapsed && (
                      <>
                        <Skeleton height="10px" flex="1" />

                        {hasBadge && <Skeleton height="16px" width="28px" borderRadius="full" />}
                      </>
                    )}
                  </Flex>
                );
              })}
            </VStack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
