// utils/formDataUtils.ts

/**
 * Convertit une valeur en string PostgreSQL-safe :
 * - undefined / null / "undefined" / "null" / "" → "null"
 * - Tout autre valeur → String(value)
 */
const toSafeString = (value: unknown): string | null => {
  if (
    value === undefined ||
    value === null ||
    value === "undefined" ||
    value === "null" ||
    value === ""
  ) {
    return null;
  }
  return String(value);
};

/**
 * Appende une valeur scalaire dans un FormData de manière PostgreSQL-safe.
 * Les undefined/null sont convertis en "null" au lieu d'être ignorés.
 *
 * @example
 * appendSafe(formData, "district", data.district);
 * // → formData.set("district", "null") si undefined
 */
export const appendSafe = (
  formData: FormData,
  key: string,
  value: unknown,
): void => {
  formData.append(key, toSafeString(value) as any);
};

/**
 * Appende un tableau de fichiers dans un FormData.
 * Si le tableau est vide ou undefined, n'appende rien (comportement attendu pour les fichiers).
 *
 * @example
 * appendFiles(formData, "documents", data.documents);
 */
export const appendFiles = (
  formData: FormData,
  key: string,
  files: File[] | undefined | null,
): void => {
  if (!files?.length) return;
  files.forEach((file) => formData.append(key, file));
};

/**
 * Construit un FormData entier à partir d'un objet de champs,
 * en appliquant automatiquement la conversion PostgreSQL-safe sur chaque valeur.
 *
 * Cas particuliers gérés :
 * - Tableaux de fichiers (File[]) → appendFiles
 * - Tableaux de strings (ex: city[0], status[0]) → prend le premier élément
 * - undefined/null → "null"
 *
 * @example
 * const formData = buildSafeFormData({
 *   title: data.title,
 *   city: data.city?.[0],
 *   documents: { files: data.documents },
 * });
 */
export const buildSafeFormData = (
  fields: Record<string, unknown | { files: File[] }>,
): FormData => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    // Cas fichiers : { files: File[] }
    if (
      value !== null &&
      typeof value === "object" &&
      "files" in (value as object)
    ) {
      appendFiles(formData, key, (value as { files: File[] }).files);
      return;
    }

    // Cas scalaire (string, number, undefined, null, boolean)
    appendSafe(formData, key, value);
  });

  return formData;
};
