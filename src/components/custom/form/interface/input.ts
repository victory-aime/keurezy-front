import { HTMLChakraProps, ListCollection } from "@chakra-ui/react";
import React, { HTMLInputTypeAttribute } from "react";

interface TextInputProps extends HTMLChakraProps<"input"> {
  name: string;
  label?: string;
  required?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isVerified?: boolean;
  infoMessage?: string | null;
  helperMessage?: string;
  useFullAmountMask?: boolean;
  rightAccessory?: React.ReactNode;
  leftAccessory?: React.ReactNode;
  type?: HTMLInputTypeAttribute | undefined;
  accept?: string;
  validate?: any;
  useMask?: boolean;
  maskVisibleCount?: number;
  maskChar?: string;
  customRadius?: number;
  height?: string | number;
  toolTipInfo?: string;
  isLoading?: boolean;
  onChangeFunction?: any;
  currency?: string;
}

interface FormTextAreaProps extends TextInputProps {
  minHeight?: string;
  autoresize?: boolean;
  maxCharacters?: number;
}

interface FullSelectProps {
  name: string;
  label?: string;
  listItems: ListCollection<unknown> | any;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<any>;
  placeholder?: string;
  isDisabled?: boolean;
  isMultiSelect?: boolean;
  onChangeFunc?: (data: any) => void;
  infoMessage?: string;
  variant?: "outline" | "subtle";
  validate?: any;
  required?: boolean;
  width?: string;
  customRenderSelected?: (selectedItems: any[]) => React.ReactNode;
  isClearable?: boolean;
  showDropdownIcon?: boolean;
  toolTipInfo?: string;
  isLoading?: boolean;
  isReadOnly?: boolean;
  ref?: any | undefined;
}
interface DefaultProps extends TextInputProps {
  isNumber?: boolean;
  min: number;
  max: number;
}

interface CheckBoxProps extends HTMLChakraProps<"label"> {
  name: string;
  label?: string | React.ReactNode;
  validate?: any;
  itemsPerRow?: number;
  size?: "sm" | "md" | "lg";
  isReadOnly?: boolean;
  items?: {
    name?: string;
    value?: string;
  }[];
}

interface SwitchProps extends HTMLChakraProps<"switch"> {
  name: string;
  label?: string;
  validate?: any;
  reverse?: boolean;
  description?: string;
  isLoading?: boolean;
  isReadOnly?: boolean;
  onCheckedChange?: (value: boolean) => void;
}

interface FormColorPickerProps extends TextInputProps {}

interface FormDatePickerFieldProps extends TextInputProps {
  displayFormat?: "default" | "short";
  mode: "single" | "range";
  isClearable?: boolean;
  disablePastDates?: boolean;
  disableWeeksDates?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  hideNavigation?: boolean;
  activeCaptionLayout?: boolean;
}

interface TimeInputProps extends TextInputProps {
  variant?: "outline" | "subtle" | "plain";
}
interface OtpInputProps extends TextInputProps {
  count?: number;
  attached?: boolean;
}

type countriesList = ["cg" | "fr" | "cd" | "sn"];

interface PhoneInputProps extends TextInputProps {
  hideDropdown?: boolean;
  listAvailableCountries?: string[];
}

export type {
  TextInputProps,
  FormTextAreaProps,
  FullSelectProps,
  DefaultProps,
  CheckBoxProps,
  SwitchProps,
  FormColorPickerProps,
  FormDatePickerFieldProps,
  TimeInputProps,
  OtpInputProps,
  PhoneInputProps,
  countriesList,
};
