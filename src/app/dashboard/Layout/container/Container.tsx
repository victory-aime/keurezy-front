'use client';

import { Center, Flex, useBreakpointValue } from '@chakra-ui/react';
import { BaseContainer, FloatSwitchColorMode, Loader } from '_components/custom';

export const Container = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex flex={1} h="100%" width="100%">
      {isLoading ? (
        <Center alignItems={'center'} justifyContent={'center'} height={'100vh'} width={'100%'}>
          <Loader loader size="xl" />
        </Center>
      ) : (
        <BaseContainer
          mt={{ base: '0', sm: '20px' }}
          p={{ base: 2, sm: 4 }}
          border={'none'}
          position={'relative'}
        >
          {children}
        </BaseContainer>
      )}
      {isMobile && <FloatSwitchColorMode />}
    </Flex>
  );
};
