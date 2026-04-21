import { ENUM } from '_types/index';

type StyleNumberFormat = 'decimal' | 'percent' | 'currency';

interface BaseFormatNumberProps {
  value: number;
  maximumDigits?: number;
  minimumDigits?: number;
  notation?: 'compact' | 'standard' | 'scientific' | 'engineering';
  style?: StyleNumberFormat;
  currencyCode?: ENUM.COMMON.Currency;
}

export type { BaseFormatNumberProps };
