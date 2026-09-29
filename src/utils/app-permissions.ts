/**
 * Noms des permissions staff, identiques au seed backend (`prisma/seed/seed-feature.ts`).
 * À utiliser avec `usePermissions().hasPermission` : l'owner a toujours tous les droits.
 * Le backend reste la protection réelle (403 « Accès non autorisé ») ; ces constantes servent
 * à masquer les points d'entrée et à désactiver les actions interdites.
 */
export const AppPermissions = {
  PROPERTIES: {
    UPDATE: 'update_property',
    VIEW: 'view_properties',
    CREATE: 'create_property',
    DELETE: 'delete_property',
    PUBLISH: 'publish_property',
    UNPUBLISH: 'unpublish_property',
  },
  LAND: {
    MANAGE: 'manage_land',
  },
  BUILDING: {
    MANAGE: 'manage_batiment',
  },
  VISITS: {
    VIEW: 'view_visits',
    SCHEDULE: 'schedule_visit',
    UPDATE: 'update_visit',
    CANCEL: 'cancel_visit',
  },
  BOOKINGS: {
    VIEW: 'view_bookings',
    MANAGE: 'manage_bookings',
  },
  CONVERSATIONS: {
    VIEW: 'view_conversations',
    REPLY: 'reply_conversations',
  },
  USERS: {
    VIEW: 'view_users',
    INVITE: 'invite_users',
    UPDATE: 'update_users',
    DELETE: 'delete_users',
  },
  INVITATIONS: {
    SEND: 'send_invitation',
    RESEND: 'resend_invitation',
    CANCEL: 'cancel_invitation',
  },
  REPORTS: {
    VIEW: 'view_reports',
    EXPORT: 'export_reports',
  },
  ACCOUNTING: {
    VIEW: 'view_accounting',
    CREATE_TRANSACTION: 'create_transaction',
    UPDATE_TRANSACTION: 'update_transaction',
    DELETE_TRANSACTION: 'delete_transaction',
  },
} as const;
