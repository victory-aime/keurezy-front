import { Flex, Box } from '@chakra-ui/react';
export const LoadingDots = ({ color = 'white' }: { color?: string }) => {
  return (
    <Flex alignItems={'center'} justifyContent={'center'} gap={'5px'}>
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          animation={'dotBounce'}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: '50%',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </Flex>
  );
};
