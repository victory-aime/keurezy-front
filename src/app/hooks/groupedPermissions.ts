import { MODELS } from "_types/*";

export function groupPermissionsByCategory(data: MODELS.ITeam) {
  const grouped: Record<string, any[]> = {};

  for (const sp of data.permissions) {
    if (!sp.granted || !sp.permission) continue;

    const category = sp.permission.feature.category;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      id: sp.permission.id,
      name: sp.permission.name,
      description: sp.permission.description,
    });
  }

  return Object.entries(grouped).map(([category, permissions]) => ({
    category,
    permissions,
  }));
}
