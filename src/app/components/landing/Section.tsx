import { Box, type BoxProps, Container, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { BaseText } from '_components/custom';
import { MotionBox } from '_constants/motion';

/** Section pleine largeur ; `muted` alterne le fond pour rythmer la page. */
export const LandingSection = ({
  id,
  muted = false,
  children,
  ...rest
}: { id?: string; muted?: boolean; children: ReactNode } & BoxProps) => (
  <Box
    as="section"
    id={id}
    width="full"
    py={{ base: 14, md: 20 }}
    bg={muted ? 'bg.subtle' : 'bg'}
    scrollMarginTop="72px"
    {...rest}
  >
    <Container maxW="7xl" px={{ base: 4, sm: 8 }}>
      {children}
    </Container>
  </Box>
);

/** Apparition au défilement, une seule fois (les mouvements sont coupés par MotionConfig). */
export const Reveal = ({
  delay = 0,
  children,
  ...rest
}: { delay?: number; children: ReactNode } & Pick<
  BoxProps,
  'as' | 'height' | 'width' | 'maxW' | 'mx'
>) => (
  <MotionBox
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5, delay }}
    {...rest}
  >
    {children}
  </MotionBox>
);

/** Titre de section : surtitre, titre (h2) et sous-titre. */
export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'start';
}) => (
  <Reveal>
    <Stack
      gap={3}
      maxW="2xl"
      mx={align === 'center' ? 'auto' : 0}
      mb={{ base: 10, md: 14 }}
      textAlign={align}
      alignItems={align === 'center' ? 'center' : 'flex-start'}
    >
      <BaseText
        fontSize="sm"
        fontWeight="semibold"
        color="primary.fg"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {eyebrow}
      </BaseText>
      <BaseText
        as="h2"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="bold"
        lineHeight="1.15"
        letterSpacing="tight"
      >
        {title}
      </BaseText>
      {subtitle && (
        <BaseText fontSize={{ base: 'md', md: 'lg' }} color="fg.muted">
          {subtitle}
        </BaseText>
      )}
    </Stack>
  </Reveal>
);
