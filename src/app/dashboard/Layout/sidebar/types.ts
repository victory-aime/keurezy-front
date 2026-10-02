import { MODELS } from '_types/*';
import { Session } from 'better-auth';
import React from 'react';
import type { LockedPreview } from './components/LockedFeaturePreview';

export interface IMobileSidebar {
  isOpen: boolean;
  onClose: (value?: any) => void;
  handleLogout?: () => void;
  links: SidebarNavGroupProps[];
}
export interface ILink {
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  menuKey?: string;
  subItems?: subItems;
  key?: string;
  viewBox?: string;
}

export type SidebarLink = INavItem;

interface INavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  feature?: string;
  permission?: string;
  disabled?: boolean;
  highlight?: boolean;
  /** Visible uniquement par le propriétaire de l'agence (ex. abonnement et facturation) */
  ownerOnly?: boolean;
  /**
   * Module hors plan montré verrouillé (cadenas et aperçu animé au survol) plutôt que masqué.
   * Sans aperçu, un lien hors plan est masqué.
   */
  preview?: LockedPreview;
  /** Ce que le module apporte, en une phrase (carte d'aperçu) */
  pitch?: string;
  /** Calculés par le menu : module verrouillé et plan le moins cher qui l'inclut */
  locked?: boolean;
  unlockPlan?: { id: string; name: string } | null;
}

export interface SidebarNavGroupProps {
  title: string;
  icon: React.ElementType;
  links: INavItem[];
}

export type subItems = SimpleSubItem[];

export interface SideBarProps {
  onShowSidebar: () => void;
  sideToggled: boolean;
  // data: {
  //   session?: Session;
  //   user?:
  //     | {
  //         id: string;
  //         createdAt: Date;
  //         updatedAt: Date;
  //         email: string;
  //         emailVerified: boolean;
  //         name: string;
  //         image?: string | null | undefined;
  //         role?: string;
  //       }
  //     | null
  //     | undefined;
  // };
}

export interface SimpleSubItem {
  label: string;
  path: string;
  permissionSubLink?: string;
  icon?: React.ComponentType<any>;
}

export interface IRenderLinks {
  sideToggled: boolean;
  links: ILink[];
  onShowSidebar: () => void;
}

export interface ActiveMenuProps {
  subLink: SimpleSubItem;
  isActiveLink: (link: string) => boolean;
  sideToggled: boolean;
  onShowSidebar: any;
}

export interface MenuProps {
  redirectToPath: (link: ILink) => void;
  sideToggled: boolean;
  openedMenu: string | boolean;
  link: ILink;
  totalLinks?: number;
  conditionsSubMenu: (link: any) => void;
}

export interface SubMenuProps {
  isActiveLink: (path: string) => boolean | undefined;
  redirectToPath: (link: ILink) => void;
  sideToggled: boolean;
  link: ILink;
}
export interface AuthContextType {
  session?: MODELS.IAuthSession;
  user?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role?: string;
  } | null;
  isLoading?: boolean;
  refetchSession?: (() => Promise<void>) | undefined;
}
