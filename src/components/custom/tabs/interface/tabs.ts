import { TabsRootProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TabsProps extends TabsRootProps {
  items: {
    label: string;
    icon: ReactNode;
    content: ReactNode | string | any;
  }[];
  title?: string;
  addTitle?: string;
  redirectLink?: () => void;
  isMobile?: boolean;
  description?: string;
}

export type { TabsProps };
