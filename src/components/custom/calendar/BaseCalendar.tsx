"use client";
import { Box, Flex } from "@chakra-ui/react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useCalendarStyles } from "./styles/calendar-styles";
import { useColorModeValue } from "_components/ui/color-mode";
import { FC, useState } from "react";
import { format } from "date-fns";
import { IoIosClose } from "react-icons/io";
import { COMMON_FORMAT_DATE_HEADER } from "rise-core-frontend";
import { BaseIcon } from "_components/custom";
import { fr } from "date-fns/locale";
import { BaseCalendarProps } from "./types/calendar";

export const BaseCalendar: FC<BaseCalendarProps> = (props) => {
  const [hoveredDay, setHoveredDay] = useState<Date | undefined>(undefined);
  const calendarStyles = useCalendarStyles(
    props.selected ??
      (props.mode === "single"
        ? new Date()
        : { from: new Date(), to: new Date() }),
    props.mode,
  );
  const sharedProps = {
    weekStartsOn: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    showOutsideDays: false,
    animate: true,
    today: new Date(),
    startMonth: new Date(),
    endMonth: new Date(),
    hideNavigation: props.hideNavigation,
    activeCaptionLayout: props.activeCaptionLayout,
    numberOfMonths: props.mode === "single" ? 1 : 2,
    navLayout: "around" as const,
    modifiersClassNames: calendarStyles.modifiersClassNames,
    modifiersStyles: calendarStyles.modifiersStyles,
    styles: calendarStyles.styles,
    disabled: [
      ...(props.disableWeeksDates ? [{ dayOfWeek: [0, 6] as number[] }] : []),
      ...(props.disablePastDates ? [{ before: new Date() }] : []),
    ],
  };
  const commonProps = {
    locale: fr,
    formatters: {
      formatCaption: (date: Date, options: any) =>
        format(date, COMMON_FORMAT_DATE_HEADER, options),
    },
    modifiers: {
      booked: props.blockedDates,
      hovered: hoveredDay,
    },
    onDayMouseEnter: setHoveredDay,
    onDayMouseLeave: () => setHoveredDay(undefined),
    ...sharedProps,
  };

  const {
    mode,
    selected,
    onSelect,
    showToggleColor,
    onCloseButton,
    startMonth,
    endMonth,
    hideNavigation,
    activeCaptionLayout,
  } = props;

  return (
    <Box
      width={"full"}
      p={4}
      borderRadius="xl"
      borderWidth="1px"
      boxShadow="lg"
      bg={useColorModeValue("white", "bg.muted")}
    >
      <Flex
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        width={"full"}
        padding={"0"}
      >
        {onCloseButton && (
          <BaseIcon
            color={"red"}
            onClick={onCloseButton}
            borderRadius={"50px"}
            boxSize={"25px"}
            cursor={"pointer"}
          >
            <IoIosClose size={24} />
          </BaseIcon>
        )}
      </Flex>

      {mode === "single" && (
        <DayPicker
          {...commonProps}
          mode={mode}
          hideNavigation={hideNavigation}
          captionLayout={activeCaptionLayout ? "dropdown" : undefined}
          startMonth={startMonth}
          endMonth={endMonth}
          selected={selected as Date}
          onSelect={onSelect as (date: any) => void}
        />
      )}

      {mode === "range" && (
        <DayPicker
          {...commonProps}
          mode="range"
          hideNavigation={hideNavigation}
          captionLayout={activeCaptionLayout ? "dropdown" : undefined}
          startMonth={startMonth}
          endMonth={endMonth}
          selected={selected as DateRange | undefined}
          onSelect={onSelect as ((range?: DateRange) => void) | undefined}
        />
      )}
    </Box>
  );
};
