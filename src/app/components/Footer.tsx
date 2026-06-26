import { Box, Container, Flex, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { BaseText, Icons, TextVariant } from '_components/custom';
import { hexToRGB } from '_theme/colors';
import { VariablesColors } from '_theme/variables';
import { useColorMode } from '_components/ui/color-mode';

export const Footer = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      bgColor={hexToRGB('overlay', 0.9)}
      color={colorMode === 'light' ? 'bg.muted' : 'inherit'}
      py={10}
    >
      <Container mx={'auto'} px={{ sm: 6, lg: 8 }} py={2}>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mx={'auto'}>
          <Stack spaceY={1}>
            <Flex alignItems={'center'} gap={2}>
              <Icons.Home color={VariablesColors.primary} width={45} height={45} />
              <Heading size="md" textTransform={'capitalize'}>
                Keurezy
              </Heading>
            </Flex>
            <BaseText variant={TextVariant.S} color={'whiteAlpha.600'}>
              La plateforme moderne de gestion locative qui simplifie la vie des propriétaires et
              des locataires.
            </BaseText>
          </Stack>
        </SimpleGrid>

        <Flex
          mt={6}
          pt={4}
          borderTop={'1px solid'}
          flexDir={{ sm: 'row', base: 'column' }}
          borderColor={'whiteAlpha.200'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'full'}
        >
          <BaseText mt={2}>© {new Date().getUTCFullYear()} Keurezy. Tous droits réservés.</BaseText>
          <Flex gap={3}>
            <BaseText _hover={{ color: VariablesColors.primary, cursor: 'pointer' }}>
              Politique de confidentialité
            </BaseText>
            <BaseText _hover={{ color: VariablesColors.primary, cursor: 'pointer' }}>
              Conditions d'utilisation
            </BaseText>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
