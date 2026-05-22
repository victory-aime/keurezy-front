import { AccordionItemContentProps, AccordionRootProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface AccordionProps extends AccordionRootProps {
  items: {
    label: string;
    icon?: ReactNode;
    content: ReactNode | string | any;
    selectedLength?: number;
  }[];
  isLoading?: boolean;
  activeBg?: boolean;
  multipleOpen?: boolean;
}
type BaseAccordionProps = AccordionProps & {
  itemContentProps?: AccordionItemContentProps;
};

export type { AccordionProps, BaseAccordionProps };
