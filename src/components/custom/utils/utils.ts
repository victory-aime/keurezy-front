import { ENUM } from '_types/*';
import { variantColorType } from '../button';
import { ColorPalette } from '@chakra-ui/react';
import { Icons } from '../icons';

const STATUS_META: Partial<Record<ENUM.COMMON.Status, variantColorType>> = {
  ACTIVE: 'success',
  AVAILABLE: 'success',
  ACCEPTED: 'success',
  INACTIVE: 'danger',
  CLOSE: 'danger',
  RENTED: 'danger',
  REJECTED: 'danger',
  CANCELLED: 'danger',
  PENDING: 'warning',
  UNAVAILABLE: 'warning',
  MAINTENANCE: 'info',
  CURRENTLY_ON_SALE: 'info',
  SOLD: 'warning',
  EXPIRED: 'info',
  NEW: 'info',
  PLANNED: 'info',
  CONFIRMED: 'success',
  DONE: 'success',
} as const satisfies Partial<Record<ENUM.COMMON.Status, variantColorType>>;

const VARIANT_CONFIG: Partial<Record<variantColorType, { colorPalette: ColorPalette }>> = {
  success: { colorPalette: 'green' },
  danger: { colorPalette: 'red' },
  warning: { colorPalette: 'orange' },
  info: { colorPalette: 'blue' },
};

const STATUS_ICONS: Partial<Record<ENUM.COMMON.Status, React.ElementType>> = {
  AVAILABLE: Icons.Check,
  ACCEPTED: Icons.Check,
  REJECTED: Icons.Close,
  UNAVAILABLE: Icons.Close,
  PENDING: Icons.Timer,
  MAINTENANCE: Icons.Wrench,
  CURRENTLY_ON_SALE: Icons.Bell,
  SOLD: Icons.Payment,
  CANCELLED: Icons.Close,
  EXPIRED: Icons.Timer,
  NEW: Icons.Bell,
};

const getStatusColor = (status: ENUM.COMMON.Status): ColorPalette => {
  const variant = STATUS_META[status];
  return VARIANT_CONFIG[variant ?? 'info']?.colorPalette ?? 'gray';
};

export { STATUS_ICONS, STATUS_META, VARIANT_CONFIG, getStatusColor };
