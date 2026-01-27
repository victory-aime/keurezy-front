/**
 * Hook personnalisé pour déterminer si une route ou un sous-lien est actif
 * dans le contexte d'une navigation sous le préfixe `/dashboard`.
 *
 * ### Comportement :
 * - Considère une route active si le `pathname` correspond exactement au lien,
 *   ou commence par ce lien suivi d'un `/` (indiquant une route enfant).
 * - La route `/dashboard` n'est active que si l'utilisateur se trouve exactement sur `/dashboard`.
 *
 * ### Utilisation typique :
 * - Mise en surbrillance des liens de navigation dans un menu latéral.
 * - Activation conditionnelle des sections ou sous-menus selon la route courante.
 *
 * @returns {Object} - Un objet contenant :
 *  - `isActiveLink(link: string): boolean` : indique si la route correspond au lien donné.
 *  - `itHasActiveChildLink(links?: subItems): boolean` : indique si un des sous-liens est actif.
 *  - `pathname: string` : le chemin d'URL actuel.
 */
import { usePathname } from "next/navigation";
import { subItems } from "../types";
import { ROOT_URL } from "_config/routes";

export const useIsActive = () => {
  const pathname = usePathname();

  /**
   * Détermine si un lien est actif en fonction de la route actuelle.
   * Gère les liens parents (`/modules/dashboard`, `/modules/dashboard/back-office`, etc.)
   */
  const isActiveLink = (link: string) => {
    if (!pathname || !link) return false;

    // Cas particulier pour la racine modules
    if (link === ROOT_URL.SALON || link === ROOT_URL.BO) {
      return pathname === ROOT_URL.SALON || pathname === ROOT_URL.BO;
    }
    // Actif si on est sur le lien exact ou une sous-route
    return pathname === link || pathname.startsWith(`${link}/`);
  };

  /**
   * Vérifie si un des sous-liens est actif (utile pour ouvrir un sous-menu)
   */
  const itHasActiveChildLink = (links?: subItems): boolean => {
    if (!pathname || !links) return false;

    return links.some((link) => {
      if (!link?.path) return false;
      return pathname === link.path || pathname.startsWith(`${link.path}/`);
    });
  };

  return { isActiveLink, itHasActiveChildLink, pathname };
};
