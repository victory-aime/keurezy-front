import { VStack } from '@chakra-ui/react';
import { SidebarNavGroupProps } from '../types';
import { SidebarGroup } from './SidebarGroup';
import { SidebarSkeleton } from './SidebarGroupSkeleton';

export const RenderGroupedLinks = ({
  links,
  isCollapsed = false,
  mobileCloseDrawer,
  isLoading,
}: {
  links: SidebarNavGroupProps[];
  isCollapsed?: boolean;
  isLoading?: boolean;
  mobileCloseDrawer?: () => void;
}) => {
  return (
    <VStack align="stretch" flex="1" overflowY="auto" p={4} mt={2} gap={4} width={'full'}>
      {isLoading ? (
        <SidebarSkeleton isCollapsed={isCollapsed} />
      ) : (
        <>
          {links?.map((link, i) => (
            <SidebarGroup
              key={i}
              title={link.title}
              icon={link.icon}
              links={link.links}
              isCollapsed={isCollapsed}
              mobileCloseDrawer={mobileCloseDrawer}
            />
          ))}
        </>
      )}
    </VStack>
  );
};
