'use client';
import { APP_ROUTES } from '_config/routes';
import { CiFacebook, CiInstagram, CiMail, CiPhone } from 'react-icons/ci';
import { FaTiktok } from 'react-icons/fa';
import { Icons } from '_components/custom';

export const HEADER_LINKS = [
  {
    icon: Icons.Home,
    name: 'Accueil',
    url: APP_ROUTES.ROOT,
  },
];

export const FOOTER_ROUTES: Array<{
  name: string;
  links: Array<{ name: string; url: string; icon?: React.ComponentType<any> }>;
}> = [
  {
    name: 'liens rap',
    links: [
      {
        name: 'accueil',
        url: APP_ROUTES.ROOT,
      },
    ],
  },
  {
    name: 'support',
    links: [
      {
        name: 'accueil',
        url: '/acceuil',
      },
    ],
  },
  {
    name: 'contact',
    links: [
      {
        name: 'accueil',
        url: '/acceuil',
        icon: CiMail,
      },
      {
        name: 'accueil',
        url: '/acceuil',
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
    url: '',
  },
  {
    icon: CiInstagram,
    url: '',
  },
  {
    icon: FaTiktok,
    url: '',
  },
];
