import { ILink } from "../types";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { BO_ROUTES } from "_modules/dashboard/back-office/routes";
import { DASHBOARD_ROUTES } from "_modules/dashboard/routes";
import { UserRole } from "../../../../types/enum";
import { TbHome2 } from "react-icons/tb";

const ALL_CSA_ROUTES: ILink[] = [
  {
    path: DASHBOARD_ROUTES.HOME,
    label: "SIDE_BAR.DASHBOARD",
    icon: TbHome2,
  },
  {
    path: DASHBOARD_ROUTES.PROFILE,
    label: "SIDE_BAR.PROFILE",
    icon: FaUserAlt,
  },
];

const ADMIN_ROUTES: ILink[] = [
  {
    path: BO_ROUTES.DASHBOARD,
    label: "SIDE_BAR.DASHBOARD",
    icon: TbHome2,
  },
  {
    path: BO_ROUTES.USERS,
    label: "SIDE_BAR.USERS",
    icon: FaUsers,
  },
  {
    path: BO_ROUTES.FAQ,
    label: "Faq",
    icon: IoIosHelpCircle,
  },
];

export const MENU_BY_ROLE: Record<string, ILink[]> = {
  ADMIN: ADMIN_ROUTES,
};
const COMMON_ROLES = [UserRole.USER];

for (const role of COMMON_ROLES) {
  MENU_BY_ROLE[role] = ALL_CSA_ROUTES;
}
