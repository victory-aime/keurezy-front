import { Box, Circle, Flex, Grid, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { BaseBadge, BaseText, Icons, TextVariant } from '_components/custom';
import { AUDIENCES, PAINS, TRUST_ITEMS } from './content';
import { LandingSection, Reveal, SectionHeading } from './Section';

/** Bande factuelle sous le hero : ce qui est vrai aujourd'hui, à la place de statistiques. */
export const TrustStrip = () => (
  <Box
    as="section"
    aria-label="Points clés"
    width="full"
    borderYWidth="1px"
    borderColor="border"
    bg="bg.subtle"
  >
    <SimpleGrid
      as="ul"
      listStyleType="none"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap={{ base: 3, md: 6 }}
      maxW="7xl"
      mx="auto"
      px={{ base: 4, sm: 8 }}
      py={6}
    >
      {TRUST_ITEMS.map(({ icon: Icon, label }) => (
        <HStack as="li" key={label} gap={3} justifyContent={{ lg: 'center' }}>
          <Circle size="9" bg="primary.subtle" color="primary.fg" flexShrink={0}>
            <Icon aria-hidden />
          </Circle>
          <BaseText variant={TextVariant.S} fontWeight="medium">
            {label}
          </BaseText>
        </HStack>
      ))}
    </SimpleGrid>
  </Box>
);

/** « Pour qui ? » : les agences aujourd'hui, les petits commerces bientôt. */
export const Audiences = () => (
  <LandingSection>
    <SectionHeading
      eyebrow="Pour qui ?"
      title="Pensé pour ceux qui louent au quotidien"
      subtitle="Keurezy s’adresse aux agences aujourd’hui, et bientôt à ceux qui louent quelques biens."
    />
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} maxW="5xl" mx="auto">
      {AUDIENCES.map(({ icon: Icon, title, description, points, soon }, index) => (
        <Reveal key={title} delay={index * 0.1} height="full">
          <Stack
            height="full"
            gap={5}
            p={{ base: 6, md: 8 }}
            rounded="2xl"
            borderWidth="1px"
            borderColor={soon ? 'border' : 'primary.muted'}
            bg={soon ? 'bg.subtle' : 'bg'}
            borderStyle={soon ? 'dashed' : 'solid'}
          >
            <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
              <Circle
                size="12"
                bg={soon ? 'bg.muted' : 'primary.subtle'}
                color={soon ? 'fg.muted' : 'primary.fg'}
              >
                <Icon size={20} aria-hidden />
              </Circle>
              <BaseBadge
                variant="subtle"
                color={soon ? 'warning' : 'success'}
                label={soon ? 'Bientôt disponible' : 'Disponible'}
              />
            </Flex>
            <Stack gap={1}>
              <BaseText as="h3" fontSize="xl" fontWeight="bold">
                {title}
              </BaseText>
              <BaseText color="fg.muted">{description}</BaseText>
            </Stack>
            <Stack as="ul" gap={2} listStyleType="none">
              {points.map((point) => (
                <HStack
                  as="li"
                  key={point}
                  gap={2}
                  alignItems="flex-start"
                  color={soon ? 'fg.muted' : 'fg'}
                >
                  <Box color={soon ? 'fg.subtle' : 'success.fg'} pt={0.5} aria-hidden>
                    <Icons.DoubleCheck />
                  </Box>
                  <BaseText variant={TextVariant.S} color="inherit">
                    {point}
                  </BaseText>
                </HStack>
              ))}
            </Stack>
          </Stack>
        </Reveal>
      ))}
    </SimpleGrid>
  </LandingSection>
);

/** Avant / après : trois douleurs concrètes et la réponse de Keurezy. */
export const BeforeAfter = () => (
  <LandingSection muted>
    <SectionHeading
      eyebrow="Avant / après"
      title="Fini le bricolage"
      subtitle="Ce que vivent beaucoup d’agences aujourd’hui, et ce qui change avec Keurezy."
    />
    <Stack gap={4} maxW="5xl" mx="auto">
      <Grid
        templateColumns="1fr 1fr"
        gap={4}
        px={{ base: 4, md: 6 }}
        display={{ base: 'none', md: 'grid' }}
        aria-hidden
      >
        <BaseText variant={TextVariant.S} fontWeight="semibold" color="fg.muted">
          Sans Keurezy
        </BaseText>
        <BaseText variant={TextVariant.S} fontWeight="semibold" color="primary.fg">
          Avec Keurezy
        </BaseText>
      </Grid>
      {PAINS.map(({ before, after }, index) => (
        <Reveal key={before} delay={index * 0.1}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            rounded="xl"
            borderWidth="1px"
            borderColor="border"
            bg="bg"
            overflow="hidden"
          >
            <HStack gap={3} p={{ base: 4, md: 6 }} alignItems="flex-start" color="fg.muted">
              <Box color="danger.fg" pt={0.5} flexShrink={0}>
                <Icons.Close aria-label="Sans Keurezy" />
              </Box>
              <BaseText color="inherit">{before}</BaseText>
            </HStack>
            <HStack
              gap={3}
              p={{ base: 4, md: 6 }}
              alignItems="flex-start"
              bg="primary.subtle"
              borderTopWidth={{ base: '1px', md: 0 }}
              borderLeftWidth={{ base: 0, md: '1px' }}
              borderColor="border"
            >
              <Box color="success.fg" pt={0.5} flexShrink={0}>
                <Icons.DoubleCheck aria-label="Avec Keurezy" />
              </Box>
              <BaseText fontWeight="medium">{after}</BaseText>
            </HStack>
          </Grid>
        </Reveal>
      ))}
    </Stack>
  </LandingSection>
);
