import { Icons } from '_components/custom';
import { hexToRGB } from '_theme/colors';
import { VariablesColors } from '_theme/variables';
import { MotionBox } from '_constants/motion';

export const AnimatedCheckmark = ({ type = 'success' }: { type?: 'success' | 'error' }) => (
  <MotionBox
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    position={'relative'}
    mt={5}
    mx={'auto'}
  >
    <MotionBox
      animate={{
        boxShadow: [
          `0 0 0 0px ${hexToRGB(type === 'success' ? 'success' : 'danger', 0.3)}`,
          `0 0 0 20px ${hexToRGB(type === 'success' ? 'success' : 'danger', 0)}`,
          `0 0 0 0px ${hexToRGB(type === 'success' ? 'success' : 'danger', 0.3)}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      h={'24'}
      w={'24'}
      bgGradient={'to-br'}
      gradientFrom={type === 'success' ? 'success.500' : 'danger.500'}
      gradientTo={type === 'success' ? 'tertiary.500' : 'danger.100'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      borderRadius={'full'}
    >
      <MotionBox
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {type === 'success' ? (
          <Icons.Check size={100} strokeWidth={5} color={VariablesColors.white} />
        ) : (
          <Icons.Warn size={50} color={VariablesColors.white} />
        )}
      </MotionBox>
    </MotionBox>
  </MotionBox>
);
