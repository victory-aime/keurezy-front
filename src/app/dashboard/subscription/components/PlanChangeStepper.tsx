import { Box, Flex } from '@chakra-ui/react';
import { BaseText, Icons, TextVariant } from '_components/custom';

export const PLAN_CHANGE_STEPS = ['Choisir', 'Vérifier', 'Récapitulatif'] as const;

/**
 * Stepper du changement de plan : indicateur seulement (on avance par les boutons du pied de
 * page, chaque étape ayant sa condition). Couleur de l'agence, libellés à partir de `md`.
 */
export const PlanChangeStepper = ({ current }: { current: number }) => (
  <Flex
    as="ol"
    listStyleType="none"
    alignItems="center"
    gap={{ base: 2, md: 3 }}
    aria-label="Étapes"
  >
    {PLAN_CHANGE_STEPS.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <Flex
          as="li"
          key={label}
          alignItems="center"
          gap={2}
          flex={index < PLAN_CHANGE_STEPS.length - 1 ? '1' : '0 0 auto'}
          aria-current={active ? 'step' : undefined}
        >
          <Flex
            boxSize="28px"
            flexShrink={0}
            rounded="full"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            fontWeight="semibold"
            borderWidth="2px"
            borderColor={done || active ? 'primary.500' : 'border.emphasized'}
            bg={done ? 'primary.500' : active ? 'primary.500/10' : 'transparent'}
            color={done ? 'white' : active ? 'primary.500' : 'fg.muted'}
            transition="background-color 200ms ease, border-color 200ms ease"
          >
            {done ? (
              <>
                <Icons.Check aria-hidden />
                <Box as="span" srOnly>
                  Étape terminée :
                </Box>
              </>
            ) : (
              index + 1
            )}
          </Flex>
          <BaseText
            variant={TextVariant.S}
            fontWeight={active ? 'semibold' : 'normal'}
            color={active ? 'fg' : 'fg.muted'}
            srOnly={{ base: !active, md: false }}
            whiteSpace="nowrap"
          >
            {label}
          </BaseText>
          {index < PLAN_CHANGE_STEPS.length - 1 && (
            <Box
              aria-hidden
              flex="1"
              height="2px"
              rounded="full"
              bg={done ? 'primary.500' : 'border'}
              transition="background-color 200ms ease"
            />
          )}
        </Flex>
      );
    })}
  </Flex>
);
