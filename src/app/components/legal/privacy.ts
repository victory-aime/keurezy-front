import type { LegalSection } from '../terms/TermsContent';

/** Version de la politique : à changer à chaque modification du texte. */
export const PRIVACY_VERSION = '1.0';
export const PRIVACY_DATE = '3 octobre 2026';

/**
 * Politique de confidentialité de Keurezy. Texte de départ, à faire relire par un juriste avant
 * la mise en production (identité de l'éditeur et adresse de contact à compléter).
 */
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'responsable',
    title: '1. Responsable du traitement',
    paragraphs: [
      'Les données personnelles collectées sur Keurezy, sur le web et sur l’application mobile, sont traitées par Keurezy [raison sociale, forme juridique, NINEA, RCCM et adresse du siège à compléter].',
      'Pour toute question sur vos données : [adresse e-mail de contact à compléter].',
      'Ces traitements respectent la loi n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel au Sénégal.',
    ],
  },
  {
    id: 'donnees',
    title: '2. Données collectées',
    paragraphs: [
      'Compte : nom, adresse e-mail, numéro de téléphone, photo de profil le cas échéant. Le mot de passe est stocké sous forme chiffrée irréversible (haché), jamais en clair.',
      'Agence : nom, coordonnées, logo, informations légales (forme juridique, NINEA, RCCM, adresse de facturation) et pièces justificatives.',
      'Activité : biens, annonces, disponibilités, réservations, visites, prospects, messages échangés, factures et notifications.',
      'Paiement : montant, plan choisi, référence et statut de la transaction. Keurezy ne reçoit ni ne conserve aucune donnée de moyen de paiement (numéro de compte Wave, Orange Money ou Mobile Money, code secret).',
      'Données techniques : sessions de connexion, adresse IP, type d’appareil et de navigateur, jetons de notification de l’appareil.',
    ],
  },
  {
    id: 'finalites',
    title: '3. Pourquoi nous les utilisons',
    paragraphs: [
      'Fournir le service : créer et sécuriser votre compte, gérer votre agence, vos biens, vos réservations et vos échanges avec vos clients.',
      'Facturer : gérer votre abonnement, vos paiements et vos reçus, et respecter nos obligations comptables.',
      'Vérifier les agences : contrôler les informations légales avant d’accorder le badge « Agence vérifiée ».',
      'Vous informer : e-mails et notifications liés au service (code de vérification, réservations, échéance de l’abonnement). Aucun message publicitaire n’est envoyé sans votre accord.',
      'Protéger la plateforme : prévenir la fraude, les abus et les accès non autorisés.',
    ],
  },
  {
    id: 'destinataires',
    title: '4. Qui peut y accéder',
    paragraphs: [
      'Au sein d’une agence, chaque membre n’accède qu’aux données que son rôle lui permet de voir. Un client ne voit de l’agence que ses informations publiques et ses annonces. Les informations légales et pièces justificatives ne sont jamais affichées publiquement.',
      'Nos prestataires techniques, uniquement pour ce qui est nécessaire à leur mission : hébergement, envoi d’e-mails, stockage de fichiers, notifications et traitement des paiements. Ils sont tenus à la confidentialité et à la sécurité des données.',
      'Les autorités, lorsque la loi l’impose.',
      'Vos données ne sont jamais vendues ni louées.',
    ],
  },
  {
    id: 'transferts',
    title: '5. Transferts hors du Sénégal',
    paragraphs: [
      'Certains prestataires techniques peuvent héberger ou traiter des données hors du Sénégal. Ces transferts se font dans le respect de la loi n° 2008-12, avec des garanties de sécurité et de confidentialité adaptées.',
    ],
  },
  {
    id: 'conservation',
    title: '6. Durée de conservation',
    paragraphs: [
      'Les données du compte et de l’agence sont conservées tant que le compte est actif, puis supprimées ou anonymisées dans un délai raisonnable après sa fermeture.',
      'Les factures, reçus et données de paiement sont conservés pendant la durée imposée par la législation comptable et fiscale.',
      'Les données techniques de connexion sont conservées pour une durée limitée, nécessaire à la sécurité de la plateforme.',
    ],
  },
  {
    id: 'securite',
    title: '7. Sécurité',
    paragraphs: [
      'Les échanges sont chiffrés (HTTPS), les mots de passe sont hachés, les accès sont limités par rôle et la double authentification est proposée à chaque utilisateur.',
      'Aucun système n’est infaillible : en cas de violation de données présentant un risque pour vous, nous vous en informons, ainsi que l’autorité compétente, dans les conditions prévues par la loi.',
    ],
  },
  {
    id: 'droits',
    title: '8. Vos droits',
    paragraphs: [
      'Vous pouvez accéder à vos données, les rectifier, vous opposer à certains traitements et demander leur suppression, en écrivant à [adresse de contact à compléter]. Une réponse vous est apportée dans les délais prévus par la loi.',
      'Vous pouvez aussi saisir la Commission de protection des données personnelles (CDP) du Sénégal.',
    ],
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    paragraphs: [
      'Keurezy utilise uniquement les cookies nécessaires au fonctionnement du service, notamment pour garder votre session ouverte et retenir vos préférences d’affichage. Aucun cookie publicitaire ni de mesure d’audience tierce n’est utilisé.',
    ],
  },
  {
    id: 'modifications',
    title: '10. Modifications',
    paragraphs: [
      'Cette politique peut évoluer. La version et la date en vigueur sont indiquées en haut de cette page ; en cas de changement important, vous en êtes informé par e-mail ou dans l’application.',
    ],
  },
];
