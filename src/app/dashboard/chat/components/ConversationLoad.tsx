import { VStack } from '@chakra-ui/react';
import { CustomSkeletonLoader } from '_components/custom';

export const ConversationLoad = ({ itemLoadLength = 25 }: { itemLoadLength?: number }) => {
  return (
    <VStack p={4} gap={3} align="stretch">
      {[...Array(itemLoadLength)].map((_, i) => (
        <CustomSkeletonLoader
          key={i}
          type={'TEXT_IMAGE'}
          numberOfLines={2}
          direction={'row'}
          width={'full'}
          radius={'full'}
          height={'10'}
        />
      ))}
    </VStack>
  );
};
