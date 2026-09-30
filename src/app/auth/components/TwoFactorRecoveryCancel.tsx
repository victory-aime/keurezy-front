'use client';

import { VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BaseButton, BaseText } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { AuthModule } from '_store/state-management';
import { AuthBoxContainer } from './AuthBoxContainer';

/**
 * Lien « Ce n'est pas moi » de l'e-mail de récupération. L'annulation demande un clic : ouvrir
 * la page ne fait rien, sinon un scanner de liens annulerait la demande du titulaire.
 */
export const TwoFactorRecoveryCancel = ({ token }: { token?: string }) => {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const { mutateAsync: cancel, isPending } = AuthModule.twoFactorRecoveryCancelMutation({
    mutationOptions: { onSuccess: () => setDone(true) },
  });

  if (done) {
    return (
      <AuthBoxContainer
        withAnimatedCheckmark
        title="Demande annulée"
        description={
          <BaseText>
            La double authentification de votre compte reste active. Si vous n’êtes pas à l’origine
            de la demande, changez votre mot de passe : quelqu’un le connaît.
          </BaseText>
        }
      >
        <BaseButton onClick={() => router.replace(APP_ROUTES.AUTH.RESET_PASSWORD)}>
          Changer mon mot de passe
        </BaseButton>
      </AuthBoxContainer>
    );
  }

  return (
    <AuthBoxContainer
      title="Annuler la récupération du compte"
      description={
        <BaseText>
          Une demande de désactivation de la double authentification a été faite sur votre compte.
          Si elle ne vient pas de vous, annulez-la.
        </BaseText>
      }
    >
      <VStack gap={3} alignItems="stretch">
        <BaseButton
          colorType="danger"
          isLoading={isPending}
          disabled={!token}
          onClick={() => cancel({ payload: { token: token! } }).catch(() => undefined)}
        >
          Ce n’est pas moi : annuler la demande
        </BaseButton>
        {!token && (
          <BaseText fontSize="sm" color="red.500">
            Lien incomplet : ouvrez le lien exact reçu par e-mail.
          </BaseText>
        )}
      </VStack>
    </AuthBoxContainer>
  );
};
