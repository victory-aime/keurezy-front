import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MotionBox } from '_constants/motion';
import { BaseText, TextVariant } from '_components/custom';

interface SectionProps {
  title: string;
  description?: string;
  /** Rang d'apparition, pour le léger décalage entre sections */
  index?: number;
  /** true : pas d'animation (prefers-reduced-motion) */
  reduceMotion?: boolean;
  children: ReactNode;
}

/**
 * Section de la page abonnement : bordure fine, aucune ombre, titre h2. Apparaît en fondu
 * (opacity 0 → 1, 6px → 0) avec un décalage de 60 ms par rang.
 */
export const Section = ({
  title,
  description,
  index = 0,
  reduceMotion,
  children,
}: SectionProps) => (
  <MotionBox
    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay: index * 0.06, ease: 'easeOut' }}
    as="section"
    borderWidth="1px"
    borderColor="border"
    rounded="7px"
    p={{ base: 4, md: 5 }}
    width="full"
  >
    <Stack gap={1} mb={4}>
      <BaseText as="h2" variant={TextVariant.L} fontWeight="semibold">
        {title}
      </BaseText>
      {description && (
        <BaseText variant={TextVariant.S} color="fg.muted">
          {description}
        </BaseText>
      )}
    </Stack>
    <Box>{children}</Box>
  </MotionBox>
);
