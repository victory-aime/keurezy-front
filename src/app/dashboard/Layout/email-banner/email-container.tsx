import { MotionBox } from '_constants/motion';
import React from 'react';

export const EmailContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionBox
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      position="absolute"
      top="64px"
      left="0"
      right="0"
      zIndex="50"
      px={8}
    >
      {children}
    </MotionBox>
  );
};
