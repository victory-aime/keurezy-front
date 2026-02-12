import { APP_ROUTES } from "_config/routes";
import { BsFillBuildingsFill } from "react-icons/bs";
import { CiFacebook, CiInstagram, CiMail, CiPhone } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { HiHeart, HiHome, HiUser } from "react-icons/hi2";
import { UserRole } from "../../../types/enum";

export const USERS_ROUTES = {
  PROFILE: `/profile`,
  FAVORITE: `/favorite`,
};

export const HEADER_LINKS = (isAuthenticated: boolean, role: UserRole) => {
  const publicLinks = [
    {
      id: 1,
      icon: HiHome,
      name: "Accueil",
      url: APP_ROUTES.ROOT,
    },
    {
      id: 2,
      icon: BsFillBuildingsFill,
      name: "Appartements",
      url: APP_ROUTES.APPARTEMENTS,
    },
  ];

  const privateUserLinks = [
    {
      id: 3,
      icon: HiHeart,
      name: "Favoris",
      url: USERS_ROUTES.FAVORITE,
    },
    {
      id: 4,
      icon: HiUser,
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
    name: "liens rapides",
    links: [
      {
        name: "accueil",
        url: APP_ROUTES.ROOT,
      },
      {
        name: "appartements",
        url: USERS_ROUTES.PROFILE,
      },
      {
        name: "accueil",
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
