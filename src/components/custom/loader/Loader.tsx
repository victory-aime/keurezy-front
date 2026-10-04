'use client';

import { Spinner, VStack } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { BaseText } from '_components/custom';
import { LoaderProps } from './interface/loader';

export const Loader = ({ loader, showText = false, text, ...rest }: LoaderProps) => {
  const { t } = useTranslation();
  return (
    loader && (
      <VStack gap={1}>
        <Spinner color="primary.solid" animationDuration="0.6s" {...rest} />
        {showText && (
          <BaseText color={'primary.500'}>{text ? text : t('COMMON.LOADING_TEXT')}</BaseText>
        )}
      </VStack>
    )
  );
};
