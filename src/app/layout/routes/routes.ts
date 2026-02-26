import { APP_ROUTES } from "_config/routes";
import { CiFacebook, CiInstagram, CiMail, CiPhone } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { UserRole } from "../../../types/enum";
import { Icons } from "_components/custom";

export const USERS_ROUTES = {
  PROFILE: `/profile`,
  FAVORITE: `/favorite`,
  REQUEST: `/my-requests`,
  PROPERTIES_APPLY: APP_ROUTES.APPARTEMENT_APPLY,
};

export const HEADER_LINKS = (isAuthenticated: boolean, role: UserRole) => {
  const publicLinks = [
    {
      icon: Icons.Home,
      name: "Accueil",
      url: APP_ROUTES.ROOT,
    },
    {
      icon: Icons.RiBuildingLine,
      name: "Propriétes",
      url: APP_ROUTES.APPARTEMENTS,
    },
  ];

  const privateUserLinks = [
    {
      icon: Icons.Heart,
      name: "Favoris",
      url: USERS_ROUTES.FAVORITE,
    },
    {
      icon: Icons.Clipboard,
      name: "Mes demandes",
      url: USERS_ROUTES.REQUEST,
    },
    {
      icon: Icons.User,
      name: "Profil",
      url: USERS_ROUTES.PROFILE,
    },
  ];

  return isAuthenticated && role === UserRole.USER
    ? [...publicLinks, ...privateUserLinks]
    : publicLinks;
};

export const FOOTER_ROUTES: Array<{
  name: string;
  links: Array<{ name: string; url: string; icon?: React.ComponentType<any> }>;
}> = [
  {
    name: "liens rap",
    links: [
      {
        name: "accueil",
        url: APP_ROUTES.ROOT,
      },
      {
        name: "Propriétes",
        url: APP_ROUTES.APPARTEMENTS,
      },
    ],
  },
  {
    name: "support",
    links: [
      {
        name: "accueil",
        url: USERS_ROUTES.PROFILE,
      },
      {
        name: "accueil",
        url: "/acceuil",
      },
    ],
  },
  {
    name: "contact",
    links: [
      {
        name: "accueil",
        url: "/acceuil",
        icon: CiMail,
      },
      {
        name: "accueil",
        url: "/acceuil",
        icon: CiPhone,
      },
    ],
  },
];

export const SOCIAL_LINKS: Array<{
  icon: React.ComponentType<any>;
  url: string;
}> = [
  {
    icon: CiFacebook,
    url: "",
  },
  {
    icon: CiInstagram,
    url: "",
  },
  {
    icon: FaTiktok,
    url: "",
  },
];
