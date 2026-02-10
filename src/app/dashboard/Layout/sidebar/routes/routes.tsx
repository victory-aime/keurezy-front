import { ILink } from "../types";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoIosHelpCircle } from "react-icons/io";
import { BO_ROUTES } from "../../../back-office/routes";
import { DASHBOARD_ROUTES } from "../../../routes";
import { UserRole } from "../../../../../types/enum";
import { TbHome2 } from "react-icons/tb";
import { BsFillBuildingsFill } from "react-icons/bs";
import { TbTaxEuro } from "react-icons/tb";

const ALL_CSA_ROUTES: ILink[] = [
  {
    path: DASHBOARD_ROUTES.HOME,
    label: "SIDE_BAR.DASHBOARD",
    icon: TbHome2,
  },
  {
    path: DASHBOARD_ROUTES.APPART,
    label: "SIDE_BAR.APPART",
    icon: BsFillBuildingsFill,
  },
  {
    path: DASHBOARD_ROUTES.QUITTANCE,
    label: "SIDE_BAR.QUITTANCE",
    icon: TbTaxEuro,
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
const COMMON_ROLES = [UserRole.IMMO_OWNER];

for (const role of COMMON_ROLES) {
  MENU_BY_ROLE[role] = ALL_CSA_ROUTES;
}
