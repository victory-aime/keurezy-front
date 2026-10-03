import { Stack } from '@chakra-ui/react';
import { BaseText } from '_components/custom';

/** Version affichée et acceptée à l'inscription : à changer à chaque modification du texte. */
export const TERMS_VERSION = '1.0';
export const TERMS_DATE = '3 octobre 2026';

/**
 * Conditions générales d'utilisation de Keurezy. Texte de départ, à faire relire par un juriste
 * avant la mise en production (mentions de la société éditrice à compléter).
 */
export const TERMS_SECTIONS: { id: string; title: string; paragraphs: string[] }[] = [
  {
    id: 'objet',
    title: '1. Objet',
    paragraphs: [
      'Keurezy est une plateforme de gestion immobilière et de location de biens. Elle permet aux agences immobilières de gérer leurs biens, leurs annonces, leurs réservations, leurs échanges avec les clients et leur facturation, et aux clients de consulter des biens et de réserver.',
      'Les présentes conditions générales d’utilisation (CGU) régissent l’accès et l’utilisation de la plateforme, sur le web et sur l’application mobile. Créer un compte ou utiliser la plateforme vaut acceptation des CGU en vigueur.',
    ],
  },
  {
    id: 'editeur',
    title: '2. Éditeur',
    paragraphs: [
      'La plateforme est éditée par Keurezy [raison sociale, forme juridique, NINEA, RCCM et adresse du siège à compléter]. Contact : [adresse e-mail de contact à compléter].',
    ],
  },
  {
    id: 'compte',
    title: '3. Compte utilisateur',
    paragraphs: [
      'L’inscription demande une adresse e-mail valide, vérifiée par un code, et un mot de passe personnel. L’utilisateur garantit l’exactitude des informations fournies et les tient à jour.',
      'L’utilisateur est responsable de la confidentialité de ses identifiants et de toute action réalisée avec son compte. Il active de préférence la double authentification et signale sans délai toute utilisation non autorisée.',
      'Keurezy peut suspendre un compte en cas de manquement aux CGU, d’usage frauduleux ou de risque pour la sécurité de la plateforme, après information de l’utilisateur sauf urgence.',
    ],
  },
  {
    id: 'agences',
    title: '4. Agences',
    paragraphs: [
      'Le propriétaire d’une agence agit pour le compte d’une activité immobilière réelle et légalement exercée. Il renseigne les informations légales de l’agence (raison sociale, forme juridique, NINEA, RCCM, adresse de facturation) et joint les pièces justificatives demandées.',
      'Le statut « agence vérifiée » est attribué par Keurezy après contrôle de ces informations et pièces. Il est retiré si elles sont modifiées, jusqu’à une nouvelle vérification. Il ne constitue pas une garantie de Keurezy sur l’activité de l’agence.',
      'Le propriétaire invite ses collaborateurs et leur attribue des permissions. Il reste responsable de leurs actions sur la plateforme.',
    ],
  },
  {
    id: 'abonnements',
    title: '5. Abonnements et paiements',
    paragraphs: [
      'Les fonctionnalités et limites de chaque plan (Gratuit, Basic, Standard, Premium) sont présentées sur la page des tarifs. Les prix sont indiqués en francs CFA (XOF).',
      'Les paiements sont réalisés par l’intermédiaire de NabooPay (Wave, Orange Money). Keurezy ne conserve aucune donnée de moyen de paiement. Chaque paiement donne lieu à un reçu disponible dans l’historique de facturation.',
      'L’abonnement n’est pas reconduit automatiquement : il se renouvelle par un nouveau paiement, proposé avant l’échéance. Le passage à un plan supérieur est facturé au prorata de la période restante ; le passage à un plan inférieur prend effet à l’échéance.',
      'Sans renouvellement, l’agence passe au plan Gratuit à l’échéance : les éléments au-delà de ses limites sont désactivés, jamais supprimés, et redeviennent actifs après un nouveau paiement.',
      'Les sommes versées pour une période commencée ne sont pas remboursables, sauf erreur de facturation imputable à Keurezy.',
    ],
  },
  {
    id: 'promotions',
    title: '6. Codes promo',
    paragraphs: [
      'Un code promo s’applique aux conditions annoncées avec lui (plans, durée de validité, nombre d’utilisations). Il est utilisable une seule fois par compte, n’est ni cessible ni convertible en argent, et peut être retiré à tout moment pour l’avenir.',
    ],
  },
  {
    id: 'contenus',
    title: '7. Annonces et contenus',
    paragraphs: [
      'L’agence est seule responsable des annonces, photos, prix, disponibilités et documents qu’elle publie, ainsi que des factures qu’elle émet à ses clients. Les contenus doivent être exacts, licites et ne porter atteinte aux droits d’aucun tiers.',
      'Keurezy peut retirer un contenu manifestement illicite ou trompeur et suspendre l’annonce concernée.',
      'Les réservations et contrats sont conclus entre l’agence et son client. Keurezy fournit l’outil et n’est pas partie à ces relations.',
    ],
  },
  {
    id: 'donnees',
    title: '8. Données personnelles',
    paragraphs: [
      'Keurezy traite les données personnelles nécessaires au fonctionnement de la plateforme (compte, agence, annonces, réservations, messages, paiements, notifications), conformément à la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel au Sénégal.',
      'Les informations légales et pièces justificatives d’une agence ne sont jamais affichées publiquement : elles servent à sa vérification et à ses factures. Les données sont hébergées chez des prestataires techniques (hébergement, envoi d’e-mails, stockage de fichiers, paiement) tenus à la confidentialité.',
      'Chaque utilisateur peut accéder à ses données, les rectifier et demander leur suppression en écrivant à [adresse de contact à compléter]. Les données de facturation sont conservées pendant la durée imposée par la loi.',
    ],
  },
  {
    id: 'responsabilite',
    title: '9. Disponibilité et responsabilité',
    paragraphs: [
      'Keurezy met en œuvre les moyens raisonnables pour assurer l’accès et la sécurité de la plateforme, sans garantir une disponibilité ininterrompue. Des interruptions peuvent survenir pour maintenance ou en cas d’incident.',
      'La responsabilité de Keurezy ne peut être engagée pour les relations entre agences et clients, ni pour les dommages indirects. Elle est limitée, en tout état de cause, aux sommes versées par l’agence au cours des douze derniers mois.',
    ],
  },
  {
    id: 'resiliation',
    title: '10. Résiliation et fermeture',
    paragraphs: [
      'L’agence peut résilier son abonnement à tout moment : il reste actif jusqu’à l’échéance, puis l’agence passe au plan Gratuit. Le propriétaire peut demander la fermeture définitive de l’agence ; elle intervient après un délai de 15 jours, pendant lequel elle peut être annulée.',
    ],
  },
  {
    id: 'modifications',
    title: '11. Modification des CGU',
    paragraphs: [
      'Keurezy peut faire évoluer les CGU. Les utilisateurs sont informés des changements importants avant leur entrée en vigueur ; continuer à utiliser la plateforme vaut acceptation de la nouvelle version.',
    ],
  },
  {
    id: 'droit',
    title: '12. Droit applicable',
    paragraphs: [
      'Les CGU sont soumises au droit sénégalais. À défaut d’accord amiable, tout litige relève des juridictions compétentes de Dakar.',
    ],
  },
];

/** Articles des CGU : page publique et fenêtre de l'inscription. */
export const TermsArticles = ({ headingAs = 'h2' }: { headingAs?: 'h2' | 'h3' }) => (
  <Stack gap={8} minW={0}>
    {TERMS_SECTIONS.map((section) => (
      <Stack as="section" key={section.id} id={section.id} gap={3} scrollMarginTop="96px">
        <BaseText as={headingAs} fontSize={headingAs === 'h2' ? 'xl' : 'lg'} fontWeight="semibold">
          {section.title}
        </BaseText>
        {section.paragraphs.map((paragraph) => (
          <BaseText key={paragraph.slice(0, 40)} lineHeight="tall">
            {paragraph}
          </BaseText>
        ))}
      </Stack>
    ))}
  </Stack>
);
