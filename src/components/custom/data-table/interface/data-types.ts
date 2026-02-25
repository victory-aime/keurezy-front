import { JSX, ReactNode } from "react";

export type DataActionsButtonType =
  | "edit"
  | "delete"
  | "view"
  | "share"
  | "duplicate"
  | "restore"
  | "payment"
  | "download"
  | "passkey"
  | "link";

interface ActionProps<T = any> {
  name: DataActionsButtonType | ((data: T) => string); // Nom ou fonction retournant un nom dynamique
  title?: string; // Titre de l'action pour affichage (ex. Tooltip)
  handleClick: (data: T) => void; // Fonction exécutée lors du clic sur l'action
  isDisabled?: (data: T) => boolean; // Désactive l'action selon certaines conditions
  isShown?: boolean | ((data: T) => boolean); // Détermine si l'action doit être affichée
  isLoading?: boolean | ((data: T) => boolean); // Détermine si l'action est en cours
  isChecked?: (data: T) => boolean; // Indique si l'action a un état de sélection
}

interface ActionButtonsProps<T> {
  actions: ActionProps<T>[];
  item: T;
}

interface ColumnsDataTable {
  header: string;
  accessor: string | "fullObject";
  cell?: (x?: any) => JSX.Element | string | Date | undefined;
  actions?: ActionProps[];
  disabled?: (data?: any) => boolean;
}

interface PaginationProps {
  table?: any;
  totalPages?: number;
  totalItems?: number;
  totalDataPerPage: number;
  currentPage?: number;
  lazy: boolean;
  onLazyLoad?: (index: number) => void;
}

type NoDataFoundType = "trash" | "folder";

interface TableProps {
  data: any[];
  columns: ColumnsDataTable[];
  totalPages?: number;
  initialPage?: number;
  minH?: number | string;
  page?: number;
  totalDataPerPage?: number;
  lazy?: boolean;
  animationType?: NoDataFoundType;
  isOpenSelect?: boolean;
  handleRowSelection?: (item: any) => void;
  onOpenSelectRow?: (item: any) => void;
  handleDeleteActionBar?: (item?: any) => void;
  handleShareActionBar?: (item?: any) => void;
  enabledSort?: boolean;
  hidePagination?: boolean;
  isLoading?: boolean;
  onLazyLoad?: (index: number) => void;
  isShow?: {
    edit?: boolean;
    delete?: boolean;
    details?: boolean;
    share?: boolean;
    duplicate?: boolean;
    restore?: boolean;
  };
}

interface HoverActionButtonProps {
  label: string;
  icon: ReactNode;
  bg: string;
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

interface DataGridProps<T> extends BaseDataViewProps {
  totalPages?: number;
  totalDataPerPage?: number;
  initialPage?: number;
  lazy?: boolean;
  hidePagination?: boolean;
  onLazyLoad?: (page: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  displayRows?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    lgToXl?: number;
    xl?: number;
  };
  spacing?: number;
}

interface BaseDataViewProps {
  data: any[];
  isLoading?: boolean;
  actions?: ActionProps[];
}

interface DisplayContainerProps<T> extends BaseDataViewProps, TableProps {
  renderGridItem?: (item: any, index: number) => React.ReactNode;
}

type DataViewMode = "table" | "grid";

interface DataViewSwitchProps {
  mode: DataViewMode;
  onChange: (mode: DataViewMode) => void;
}

export type {
  ActionProps,
  PaginationProps,
  ColumnsDataTable,
  TableProps,
  ActionButtonsProps,
  HoverActionButtonProps,
  DisplayContainerProps,
  DataGridProps,
  DataViewSwitchProps,
  DataViewMode,
};
