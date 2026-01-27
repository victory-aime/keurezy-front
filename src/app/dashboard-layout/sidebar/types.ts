import React from "react";
import { Session } from "next-auth";

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
  session: Session | null;
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
