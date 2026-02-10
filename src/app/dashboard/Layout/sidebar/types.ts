import { Session } from "better-auth";
import React from "react";

export interface IMobileSidebar {
  isOpen: boolean;
  onClose: (value?: any) => void;
  handleLogout?: () => void;
  links: ILink[];
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

export type subItems = SimpleSubItem[];

export interface SideBarProps {
  onShowSidebar: () => void;
  sideToggled: boolean;
  data: {
    session?: Session;
    user?:
      | {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          email: string;
          emailVerified: boolean;
          name: string;
          image?: string | null | undefined;
          role?: string;
        }
      | null
      | undefined;
  };
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
  session?: Session;
  user?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  } | null;
  isLoading?: boolean;
}
