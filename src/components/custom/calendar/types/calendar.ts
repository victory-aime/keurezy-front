import { DateRange } from "react-day-picker";

interface CommonProps {
  blockedDates?: (Date | { from: Date; to: Date })[];
  startMonth?: Date;
  endMonth?: Date;
  hideNavigation?: boolean;
  activeCaptionLayout?: boolean;
  showToggleColor?: boolean;
  onCloseButton?: () => void;
  disablePastDates?: boolean;
  disableWeeksDates?: boolean;
}

interface SingleProps extends CommonProps {
  mode: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface RangeProps extends CommonProps {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

type BaseCalendarProps = SingleProps | RangeProps;

export { type BaseCalendarProps };
