import { MODELS } from "_types/*";

export const groupFeaturesByCategory = (
  permissions?: MODELS.COMMON.IGetAllPermissionResponse,
) => {
  if (!permissions) return {};
  console.log("");
  //   return permissions.reduce(
  //     (acc, pf) => {
  //       const category = pf.category;

  //       if (!acc[category]) {
  //         acc[category] = [];
  //       }

  //       acc[category].push();

  //       return acc;
  //     },
  //     {} as Record<string, MODELS.COMMON.IGetAllPermissionResponse["category"][number][]>,
  //   );
};

export const groupedFeatures = (
  selectedPerms?: MODELS.COMMON.IGetAllPermissionResponse,
) => {
  if (!selectedPerms) return [];
  return groupFeaturesByCategory(selectedPerms);
};
