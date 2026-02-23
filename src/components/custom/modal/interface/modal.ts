import { DialogRootProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { variantColorType } from "_components/custom";

interface ModalProps extends DialogRootProps {
  title?: string | undefined;
  isOpen: boolean | undefined;
  onChange?: (value: boolean) => void;
  showCloseButton?: boolean;
  ignoreFooter?: boolean;
  modalType?: "dialog" | "alertdialog" | undefined;
  buttonSaveTitle?: string;
  buttonCancelTitle?: string;
  colorSaveButton?: variantColorType;
  colorCancelButton?: variantColorType;
  iconCancelButton?: ReactNode;
  iconSaveButton?: ReactNode;
  isFull?: boolean | undefined;
  icon?: ReactNode;
  logoSrc?: string;
  iconBackgroundColor?: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  animateConfetti?: boolean;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

interface ModalOpenProps {
  onChange: (value: any) => void;
  callback?: (value?: any, helpers?: any) => void;
  isOpen: boolean | undefined;
  isLoading?: boolean;
  data?: any;
  [key: string]: any;
  isSuccess?: boolean;
}

interface DeleteModalActions extends ModalOpenProps {
  title: string;
  children: React.ReactNode;
  ignoreFooter?: boolean;
}

export type { DeleteModalActions, ModalProps, ModalOpenProps };
