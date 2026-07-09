import { Accordion, Badge, Box, Flex, Icon, VStack } from '@chakra-ui/react';
import { useIsActive } from '../hooks/useIsActive';
import { SidebarNavGroupProps } from '../types';
import { BaseText } from '_components/custom';
import { SideToolTip } from './SideToolTip';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '_components/custom';
import { UpgradePlanModal } from './UpgradePlanModal';
import { MotionFlex } from '_constants/motion';
import { AnimatePresence } from 'framer-motion';
import { useAppTheme } from '_context/theme-context';
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
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

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
                    if (item.disabled) {
                      setOpenUpgradeModal(true);
                      return;
                    }
                    router.push(item.path);
                    mobileCloseDrawer?.();
                  };

                  return (
                    <SideToolTip
                      key={i}
                      label={item.disabled ? 'Disponible dans un plan supérieur' : t(item.label)}
                      disabled={isCollapsed && !item.disabled}
                    >
                      <MotionFlex
                        position="relative"
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={
                          item.disabled
                            ? {}
                            : {
                                scale: 0.97,
                              }
                        }
                        whileTap={!item.disabled ? { scale: 0.98 } : {}}
                        align="center"
                        width="full"
                        gap={3}
                        px={3}
                        py={2}
                        borderRadius="md"
                        justifyContent={isCollapsed ? 'center' : 'flex-start'}
                        bg={isActive ? hexToRGB(500, 0.2) : 'transparent'}
                        color={
                          item.disabled
                            ? 'gray.400'
                            : isActive || isHighlighted
                              ? 'primary.600'
                              : 'gray.600'
                        }
                        fontWeight={isActive || isHighlighted ? 'semibold' : 'normal'}
                        cursor={item.disabled ? 'not-allowed' : 'pointer'}
                        opacity={item.disabled ? 0.5 : 1}
                        onClick={handleClick}
                        _hover={
                          item.disabled
                            ? {}
                            : {
                                bg: hexToRGB(500, 0.08),
                              }
                        }
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
                        <Icon as={item.icon} size={'xs'} />

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
                              {item.disabled && <Icon as={Icons.Lock} color="gray" />}
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
      <UpgradePlanModal onChange={setOpenUpgradeModal} isOpen={openUpgradeModal} />
    </main>
  );
};
