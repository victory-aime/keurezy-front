import { TabsRootProps, TabsValueChangeDetails } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TabsProps extends TabsRootProps {
  items: {
    label: string;
    tabIndex: number;
    icon: ReactNode;
    content: ReactNode | string | any;
  }[];
  title?: string;
  redirectLink?: () => void;
  isMobile?: boolean;
  description?: string;
  onChangeTabs?: (value: number) => void;
  onValueChange?: ((details: TabsValueChangeDetails) => void) | undefined;
  mode?: "manual" | "automatic";
}

export type { TabsProps };
