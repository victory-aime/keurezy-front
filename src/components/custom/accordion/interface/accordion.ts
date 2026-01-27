import { AccordionRootProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Colors } from "_theme/colors";

interface AccordionProps extends AccordionRootProps {
  items: {
    label: string;
    icon: ReactNode;
    content: ReactNode | string | any;
  }[];
  isLoading?: boolean;
  activeBg?: boolean;
  multipleOpen?: boolean;
}

export type { AccordionProps };
