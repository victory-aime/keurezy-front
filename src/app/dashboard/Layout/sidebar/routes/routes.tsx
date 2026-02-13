import { ILink } from "../types";
import { BO_ROUTES } from "../../../back-office/routes";
import { DASHBOARD_ROUTES } from "../../../routes";
import { UserRole } from "../../../../../types/enum";
import { BsFillBuildingsFill } from "react-icons/bs";
import { APP_ROUTES } from "_config/routes";
import { Icons } from "_components/custom";

const ALL_CSA_ROUTES: ILink[] = [
  {
    path: DASHBOARD_ROUTES.HOME,
    label: "SIDE_BAR.DASHBOARD",
    icon: Icons.Home,
  },
  {
    path: DASHBOARD_ROUTES.APPART,
    label: "SIDE_BAR.APPART",
    icon: BsFillBuildingsFill,
  },
  {
    path: DASHBOARD_ROUTES.QUITTANCE,
    label: "SIDE_BAR.QUITTANCE",
    icon: Icons.TbTax,
  },
  {
    path: DASHBOARD_ROUTES.AGENCY,
    label: "SIDE_BAR.AGENCY",
    icon: Icons.RiBuildingLine,
  },
  {
    path: DASHBOARD_ROUTES.PROFILE,
    label: "SIDE_BAR.PROFILE",
    icon: Icons.User,
  },
  {
    path: APP_ROUTES.ROOT,
    label: "SIDE_BAR.ROOT",
    icon: Icons.IoIosArrowRoundBack,
  },
];

const ADMIN_ROUTES: ILink[] = [
  {
    path: BO_ROUTES.DASHBOARD,
    label: "SIDE_BAR.DASHBOARD",
    icon: Icons.Home,
  },
  {
    path: BO_ROUTES.USERS,
    label: "SIDE_BAR.USERS",
    icon: Icons.FaUsers,
  },
  {
    path: BO_ROUTES.FAQ,
    label: "Faq",
    icon: Icons.IoIosHelpCircle,
  },
];

export const MENU_BY_ROLE: Record<string, ILink[]> = {
  ADMIN: ADMIN_ROUTES,
};
const COMMON_ROLES = [UserRole.IMMO_OWNER];

for (const role of COMMON_ROLES) {
  MENU_BY_ROLE[role] = ALL_CSA_ROUTES;
}
