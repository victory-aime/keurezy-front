import { Accordion, Badge, Box, Flex, Icon, VStack } from '@chakra-ui/react';
import { useIsActive } from '../hooks/useIsActive';
import { SidebarNavGroupProps } from '../types';
import { BaseText } from '_components/custom';
import { SideToolTip } from './SideToolTip';
import { LockedNavLink } from './LockedNavLink';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { MotionBox, MotionFlex } from '_constants/motion';
import { AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useThemeColors } from '_theme/useThemeColors';

export const SidebarGroup = ({
  links,
  title,
  isCollapsed,
  icon,
  mobileCloseDrawer,
}: SidebarNavGroupProps & {
  isCollapsed: boolean;
  mobileCloseDrawer?: () => void;
}) => {
  const { hexToRGB } = useThemeColors();
  // Animation de l'icône au survol, coupée si l'utilisateur réduit les animations
  const reduceMotion = useReducedMotion();
  const iconHover: Variants = reduceMotion
    ? {}
    : { hover: { rotate: [0, -12, 10, 0], scale: 1.15, transition: { duration: 0.45 } } };

  const router = useRouter();
  const { t } = useTranslation();
  const { isActiveLink } = useIsActive();

  return (
    <main>
      <Accordion.Root collapsible defaultValue={[title]}>
        <Accordion.Item value={title} border="none">
          <Accordion.ItemTrigger
            py={1}
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            color="gray.500"
            alignItems={'center'}
            justifyContent={'space-between'}
            cursor={'pointer'}
            _focus={{ bgColor: 'none', color: 'none' }}
          >
            {isCollapsed ? (
              <Flex gap={2} alignItems={'center'}>
                <Icon as={icon} size={'sm'} />
                {t(title)}
              </Flex>
            ) : (
              <Icon as={icon} size={'sm'} />
            )}

            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody px={0}>
              <VStack align="stretch" gap={1} width={'full'}>
                {links?.map((item, i) => {
                  const isActive = isActiveLink(item?.path);
                  const isHighlighted = item.highlight;

                  const handleClick = () => {
                    router.push(item.path);
                    mobileCloseDrawer?.();
                  };

                  if (item.locked) {
                    return (
                      <LockedNavLink
                        key={i}
                        item={item}
                        showLabel={isCollapsed}
                        mobileCloseDrawer={mobileCloseDrawer}
                      />
                    );
                  }

                  return (
                    <SideToolTip key={i} label={t(item.label)} disabled={isCollapsed}>
                      <MotionFlex
                        position="relative"
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover="hover"
                        whileTap={{ scale: 0.98 }}
                        align="center"
                        width="full"
                        gap={3}
                        px={3}
                        py={2}
                        borderRadius="md"
                        justifyContent={isCollapsed ? 'center' : 'flex-start'}
                        bg={isActive ? hexToRGB(500, 0.2) : 'transparent'}
                        color={isActive || isHighlighted ? 'primary.600' : 'gray.600'}
                        fontWeight={isActive || isHighlighted ? 'semibold' : 'normal'}
                        cursor="pointer"
                        onClick={handleClick}
                        _hover={{ bg: hexToRGB(500, 0.08), color: 'primary.600' }}
                      >
                        {isHighlighted && (
                          <Box
                            position="absolute"
                            left="0"
                            top="6px"
                            bottom="6px"
                            width="3px"
                            borderRadius="full"
                            bg={'primary.500'}
                          />
                        )}
                        <MotionBox display="flex" variants={iconHover} aria-hidden>
                          <Icon as={item.icon} size={'xs'} />
                        </MotionBox>

                        <AnimatePresence initial={false}>
                          {isCollapsed && (
                            <MotionFlex
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -5 }}
                              transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                flex: 1,
                              }}
                            >
                              {item.highlight && (
                                <Box
                                  position="absolute"
                                  left="0"
                                  top="6px"
                                  bottom="6px"
                                  width="3px"
                                  borderRadius="full"
                                  bg={'primary.500'}
                                />
                              )}
                              <BaseText flex="1" fontSize="sm">
                                {t(item.label)}
                              </BaseText>

                              {item.badge && (
                                <Badge
                                  borderRadius="full"
                                  fontSize="0.8em"
                                  bgColor={hexToRGB(500, 0.8)}
                                  color={'white'}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {item.highlight && (
                                <Badge fontSize="0.6em" colorPalette={'red'}>
                                  NEW
                                </Badge>
                              )}
                            </MotionFlex>
                          )}
                        </AnimatePresence>
                      </MotionFlex>
                    </SideToolTip>
                  );
                })}
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </main>
  );
};
