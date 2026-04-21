import { ReactNode } from 'react';

type Placement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

export interface BaseTooltipProps {
  children?: ReactNode;
  message: string;
  placement?: Placement;
  arrow?: boolean;
  show?: boolean;
}
