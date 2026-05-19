'use client';
import { AuthBoxContainer } from './AuthBoxContainer';
import { BaseButton, BaseText } from '_components/custom';
import { useTranslation } from 'react-i18next';
import { VStack } from '@chakra-ui/react';

export const TokenInvalid = () => {
  const { t } = useTranslation();
  return (
    <AuthBoxContainer
      withAnimatedCheckmark
      animatedType={'error'}
      title={'Lien invalide'}
      description={<BaseText>Ce lien est invalide ou a déjà été utilisé.</BaseText>}
    >
      <VStack>
        <BaseButton alignSelf={'center'}>{t('COMMON.LOGIN')}</BaseButton>
      </VStack>
    </AuthBoxContainer>
  );
};
