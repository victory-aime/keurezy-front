import { useRouter } from 'next/navigation';
import { BaseModal, BaseText, Icons, ModalOpenProps, TextVariant } from '_components/custom';
import { VStack } from '@chakra-ui/react';
import { useAuthContext } from '_context/auth-context';
import { ENUM } from '_types/*';
import { DASHBOARD_ROUTES } from '../../../routes';

/**
 * Ouvert au clic sur un lien de la sidebar non inclus dans le plan. Le propriétaire est envoyé
 * vers « Mon abonnement » ; un membre de l'équipe est invité à s'adresser au propriétaire.
 */
export const UpgradePlanModal = ({ isOpen, onChange }: ModalOpenProps) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const isOwner = user?.role === ENUM.UserRole.OWNER;

  const goToSubscription = () => {
    onChange(false);
    router.push(DASHBOARD_ROUTES.SUBSCRIPTION);
  };

  return (
    <BaseModal
      title="Fonctionnalité non incluse"
      isOpen={isOpen}
      onChange={onChange}
      size="md"
      onClick={isOwner ? goToSubscription : undefined}
      icon={<Icons.Lock />}
      // Chaîne vide : pas de bouton d'action pour le staff (undefined afficherait « Valider »)
      buttonSaveTitle={isOwner ? 'Voir mon abonnement' : ''}
    >
      <VStack align="start" gap={2} py={2}>
        <BaseText variant={TextVariant.M} fontWeight="semibold">
          Cette fonctionnalité n’est pas incluse dans votre plan actuel.
        </BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          {isOwner
            ? 'Consultez votre abonnement pour voir votre consommation et les fonctionnalités de chaque plan.'
            : 'Contactez le propriétaire de votre agence pour en savoir plus sur l’abonnement.'}
        </BaseText>
      </VStack>
    </BaseModal>
  );
};
