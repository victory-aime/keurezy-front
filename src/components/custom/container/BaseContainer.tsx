import { Box, Flex, HStack, Stack, VStack, FlexProps } from '@chakra-ui/react';
import { boxStyle } from './style';
import { BaseText, TextVariant } from '../base-text';
import { ActionsButton } from '../button';
import { BaseIcon, BaseTooltip, CustomSkeletonLoader, IBoxProps } from '_components/custom';
import { useTranslation } from 'react-i18next';
import { LuInfo } from 'react-icons/lu';
import React from 'react';
import { useThemeColors } from '_theme/useThemeColors';
import { useAppTheme } from '_context/theme-context';

export type BaseContainerProps = IBoxProps & {
  flexProps?: FlexProps;
};

export const BaseContainer = React.memo(
  ({
    title = '',
    description = '',
    withActionButtons = false,
    isFilterActive = false,
    isForm = false,
    formComponent,
    onToggleFilter,
    actionsButtonProps,
    children,
    loader = false,
    numberOfLines = 3,
    tooltip = '',
    filterComponent,
    textVariant,
    iconColor = 'success',
    icon,
    flexProps,
    ...rest
  }: BaseContainerProps) => {
    const { hexToRGB } = useThemeColors();
    const { vars } = useAppTheme();
    const { t } = useTranslation();

    if (withActionButtons && !actionsButtonProps) {
      throw new Error('Lorsque vous utiliser withActionButtons, actionsButtonProps est requis');
    }
    if (isForm && !formComponent) {
      throw new Error('Lorsque vous utiliser isForm, formComponent est requis');
    }
    const mergedActionsButtonProps = {
      ...actionsButtonProps,
      onToggleFilter,
    };

    return (
      <Box {...boxStyle} {...rest}>
        <Flex
          width={'full'}
          flexDir={{ base: 'column', sm: 'row' }}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
          gap={5}
        >
          <Stack gap={1.5} width={'full'}>
            {loader ? (
              <CustomSkeletonLoader type="TEXT" width={rest?.width} numberOfLines={numberOfLines} />
            ) : (
              <>
                {tooltip ? (
                  <Flex width={'full'} gap={4} alignItems={'center'} justifyContent={'flex-start'}>
                    {icon ? (
                      <Flex gap={3} alignItems={'center'}>
                        <BaseIcon boxSize={'10px'} color={hexToRGB(500, 0.8)}>
                          {icon}
                        </BaseIcon>
                        <BaseText variant={textVariant ?? TextVariant.L}>{t(title)}</BaseText>
                      </Flex>
                    ) : (
                      <BaseText variant={textVariant ?? TextVariant.L} textAlign={rest.textAlign}>
                        {t(title)}
                      </BaseText>
                    )}

                    {tooltip && (
                      <BaseTooltip message={tooltip}>
                        <LuInfo size={14} color={vars.primary} />
                      </BaseTooltip>
                    )}
                  </Flex>
                ) : (
                  <>
                    {icon ? (
                      <Flex gap={3} alignItems={'center'}>
                        <BaseIcon color={`${iconColor}.500`}>{icon}</BaseIcon>
                        <BaseText variant={textVariant ?? TextVariant.H3}>{t(title)}</BaseText>
                      </Flex>
                    ) : (
                      <BaseText variant={textVariant ?? TextVariant.H3} textAlign={rest.textAlign}>
                        {t(title)}
                      </BaseText>
                    )}
                  </>
                )}
                {typeof description === 'string' ? (
                  <BaseText
                    variant={textVariant ? TextVariant.XS : TextVariant.S}
                    textAlign={rest.textAlign}
                  >
                    {t(description)}
                  </BaseText>
                ) : (
                  description
                )}
              </>
            )}
          </Stack>
          {loader && withActionButtons ? (
            <CustomSkeletonLoader type={'BUTTON'} width={'100px'} colorButton={'primary'} />
          ) : (
            <HStack gap={4} alignItems={'flex-start'} justifyContent={'flex-end'}>
              {isForm && formComponent}
              {withActionButtons && <ActionsButton {...mergedActionsButtonProps} />}
            </HStack>
          )}
        </Flex>
        {isFilterActive && filterComponent && (
          <Box
            mt={'20px'}
            mb={'30px'}
            p={5}
            boxShadow={'md'}
            borderRadius={'7px'}
            animation={'slideIn'}
          >
            {filterComponent}
          </Box>
        )}
        <Flex flexDirection={'column'} gap={flexProps?.gap} width={flexProps?.width} {...flexProps}>
          {children}
        </Flex>
      </Box>
    );
  },
);
BaseContainer.displayName = 'BaseContainer';
