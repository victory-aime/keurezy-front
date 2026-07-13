export const AppPermissions = {
  PROPERTIES: {
    UPDATE: 'update_property',
    VIEW: 'view_properties',
    CREATE: 'create_property',
    DELETE: 'delete_property',
    PUBLISH: 'publish_property',
    UNPUBLISH: 'unpublish_property',
  },
  LEADS: {
    VIEW: 'view_leads',
    CREATE: 'create_lead',
    UPDATE: 'update_lead',
    DELETE: 'delete_lead',
    ASSIGN: 'assign_lead',
  },
  USERS: {
    VIEW: 'view_users',
    INVITE: 'invite_users',
    UPDATE: 'update_users',
    DELETE: 'delete_users',
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
};

// export const PermissionList = [
//   { name: "publish_property", description: "Publier une propriété" },
//   { name: "publish_land", description: "Publier un terrain" },
//   { name: "unpublish_property", description: "Dépublier une propriété" },

//   { name: "view_properties", description: "Voir la liste des propriétés" },
//   { name: "create_property", description: "Créer une nouvelle propriété" },
//   { name: "update_property", description: "Modifier une propriété existante" },
//   { name: "delete_property", description: "Supprimer une propriété" },

//   { name: "view_leads", description: "Voir la liste des leads" },
//   { name: "create_lead", description: "Créer un nouveau lead" },
//   { name: "update_lead", description: "Modifier un lead existant" },
//   { name: "delete_lead", description: "Supprimer un lead" },
//   { name: "assign_lead", description: "Assigner un lead à un collaborateur" },

//   { name: "view_users", description: "Voir la liste des collaborateurs" },
//   { name: "invite_users", description: "Inviter un nouveau collaborateur" },
//   {
//     name: "update_users",
//     description: "Modifier les informations d'un collaborateur",
//   },
//   { name: "delete_users", description: "Supprimer un collaborateur" },

//   { name: "view_reports", description: "Consulter les rapports" },
//   { name: "export_reports", description: "Exporter les rapports" },

//   { name: "view_accounting", description: "Voir les données comptables" },
//   { name: "create_transaction", description: "Créer une transaction" },
//   { name: "update_transaction", description: "Modifier une transaction" },
//   { name: "delete_transaction", description: "Supprimer une transaction" },
// ] as const;
