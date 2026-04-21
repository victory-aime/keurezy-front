'use client';

import React, { useCallback, useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { BaseButton } from '../base/baseButton';
import { ActionButtonTypes, BaseTooltip, Icons } from '_components/custom';
import { useTranslation } from 'react-i18next';

export const ActionsButton = React.memo(
  ({
    cancelTitle = 'COMMON.CANCEL',
    validateTitle = 'COMMON.VALIDATE',
    downloadTitle = 'COMMON.DOWNLOAD',
    refreshTitle = 'COMMON.REFRESH',

    requestId,
    isLoading = false,
    isDisabled = false,

    cancelColor = 'danger',
    cancelVariant,

    validateColor = 'primary',

    icon,
    cancelIcon,

    onClick,
    onToggleFilter,
    onReload,
    onCancel,
    onDownload,

    downloadPermission = true,
    validatePermission = true,
    reloadPermission = true,
    cancelShow = true,

    withGradient = true,

    emailVerificationMessage = 'Veuillez vérifier votre email pour utiliser cette fonctionnalité.',
    isEmailVerified,

    ...rest
  }: ActionButtonTypes) => {
    const { t } = useTranslation();
    const router = useRouter();

    const disabledBecauseEmail = isEmailVerified === false;

    // icon memo
    const validateIcon = useMemo(() => {
      if (icon) return icon;
      return requestId ? <Icons.Save /> : <Icons.PlusMinus />;
    }, [icon, requestId]);

    const cancelBtnIcon = useMemo(() => {
      return cancelIcon ?? <Icons.Close />;
    }, [cancelIcon]);

    // handlers memo
    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel();
      } else {
        router.back();
      }
    }, [onCancel, router]);

    const wrapTooltip = useCallback(
      (children: React.ReactNode) => {
        if (!disabledBecauseEmail) return children;

        return (
          <BaseTooltip show message={emailVerificationMessage} placement="top" arrow>
            <span>{children}</span>
          </BaseTooltip>
        );
      },
      [disabledBecauseEmail, emailVerificationMessage],
    );

    return (
      <Flex gap={3} {...rest}>
        {isLoading ? (
          <BaseButton isLoading />
        ) : (
          <>
            {/* DOWNLOAD */}
            {onDownload &&
              downloadPermission &&
              wrapTooltip(
                <BaseButton
                  px={{ base: '10px', md: '15px' }}
                  minW={{ base: '40px', md: 'auto' }}
                  withGradient={withGradient}
                  colorType="info"
                  variant="outline"
                  onClick={onDownload}
                  isLoading={isLoading}
                  disabled={isLoading || isDisabled || disabledBecauseEmail}
                  leftIcon={<Icons.DownloadPaper />}
                >
                  <Box display={{ base: 'none', md: 'inline' }}>{t(downloadTitle)}</Box>
                </BaseButton>,
              )}

            {/* CANCEL */}
            {onCancel &&
              cancelShow &&
              wrapTooltip(
                <BaseButton
                  px={{ base: '10px', md: '15px' }}
                  minW={{ base: '40px', md: 'auto' }}
                  withGradient={withGradient}
                  disabled={isLoading || disabledBecauseEmail}
                  colorType={cancelColor}
                  variant={cancelVariant}
                  leftIcon={cancelBtnIcon}
                  onClick={handleCancel}
                >
                  <Box display={{ base: 'none', md: 'inline' }}>{t(cancelTitle)}</Box>
                </BaseButton>,
              )}

            {/* FILTER */}
            {onToggleFilter &&
              reloadPermission &&
              wrapTooltip(
                <BaseButton
                  px={{ base: '10px', md: '15px' }}
                  minW={{ base: '40px', md: 'auto' }}
                  colorType="tertiary"
                  withGradient={withGradient}
                  leftIcon={<Icons.Filter />}
                  onClick={onToggleFilter}
                  disabled={disabledBecauseEmail}
                >
                  <Box display={{ base: 'none', md: 'inline' }}>{t('COMMON.FILTER')}</Box>
                </BaseButton>,
              )}

            {/* VALIDATE */}
            {onClick &&
              validatePermission &&
              wrapTooltip(
                <BaseButton
                  px={{ base: '10px', md: '15px' }}
                  minW={{ base: '40px', md: 'auto' }}
                  colorType={validateColor}
                  withGradient={withGradient}
                  isLoading={isLoading}
                  disabled={isLoading || isDisabled || disabledBecauseEmail}
                  leftIcon={validateIcon}
                  onClick={onClick}
                >
                  <Box display={{ base: 'none', md: 'inline' }}>{t(validateTitle)}</Box>
                </BaseButton>,
              )}

            {/* RELOAD */}
            {onReload &&
              reloadPermission &&
              wrapTooltip(
                <BaseButton
                  px={{ base: '10px', md: '15px' }}
                  minW={{ base: '40px', md: 'auto' }}
                  colorType="secondary"
                  withGradient={withGradient}
                  isLoading={isLoading}
                  disabled={isLoading || isDisabled || disabledBecauseEmail}
                  leftIcon={<Icons.Refresh size={14} />}
                  onClick={onReload}
                >
                  <Box display={{ base: 'none', md: 'inline' }}>{t(refreshTitle)}</Box>
                </BaseButton>,
              )}
          </>
        )}
      </Flex>
    );
  },
);

ActionsButton.displayName = 'ActionsButton';
