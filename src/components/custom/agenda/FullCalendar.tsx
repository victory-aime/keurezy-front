import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/es-us";

import {
  HStack,
  Box,
  SegmentGroup,
  VStack,
  Flex,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { BaseButton } from "../button";
import { HiMiniChevronRight, HiMiniChevronLeft } from "react-icons/hi2";
import { VariablesColors } from "_theme/variables";
import { Status } from "_components/ui/status";
import { LuGrid2X2, LuList, LuTable } from "react-icons/lu";
import { BaseText, TextVariant, TextWeight } from "../base-text";
import { useColorMode } from "_components/ui/color-mode";
import { BaseAgendaProps } from "./interface/agenda";
import { IoIosClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { formatDisplayDate } from "rise-core-frontend";
import { BaseIcon } from "_components/custom";

export const BaseAgenda = ({
  events,
  initialView = "dayGridMonth",
  onEventClick,
  onDateSelect,
  showLegend = true,
}: BaseAgendaProps) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [currentTitle, setCurrentTitle] = useState("");
  const [value, setValue] = useState<string | null>(initialView);
  const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const calendarRef = useRef<FullCalendar | null>(null);
  const calendarApi = calendarRef.current?.getApi();

  const changeView = (viewName: string) => {
    const api = calendarRef.current?.getApi();
    api?.changeView(viewName);
  };

  const handleDatesSet = (arg: any) => {
    setCurrentTitle(arg.view.title);
  };
  const handleDateClick = (arg: any) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const currentView = api.view.type;
    if (currentView === "dayGridMonth") return;

    api.gotoDate(arg.date);
    api.changeView("timeGridDay");
    setValue("timeGridDay");
  };

  useEffect(() => {
    const headers = document.querySelectorAll(
      ".fc-multimonth .fc-col-header-cell-cushion",
    );
    const jours = ["L", "M", "M", "J", "V", "S", "D"];

    headers.forEach((el, idx) => {
      (el as HTMLElement).setAttribute("data-letter", jours[idx % 7]);
    });
  }, [value]);

  const renderButtonsValue = [
    {
      value: "dayGridMonth",
      label: (
        <HStack>
          <LuTable /> {t("COMMON.MONTH")}
        </HStack>
      ),
    },
    {
      value: "timeGridWeek",
      label: (
        <HStack>
          <LuGrid2X2 /> {t("COMMON.WEEK")}
        </HStack>
      ),
    },
    {
      value: "timeGridDay",
      label: (
        <HStack>
          <LuList /> {t("COMMON.DAY")}
        </HStack>
      ),
    },
    {
      value: "multiMonthYear",
      label: (
        <HStack>
          <LuGrid2X2 /> {t("COMMON.YEAR")}
        </HStack>
      ),
    },
  ];

  const renderEventContent = (eventInfo: any) => {
    const handleClick = (e: any) => {
      const isSame = openedPopoverId === eventInfo.event.id;
      setOpenedPopoverId(isSame ? null : eventInfo.event.id);
    };

    return (
      <Popover.Root
        open={openedPopoverId === eventInfo.event.id}
        ids={{ trigger: eventInfo.event.id }}
        closeOnEscape
        closeOnInteractOutside
        positioning={{ placement: "top-start" }}
      >
        <Popover.Trigger asChild>
          <Box
            onClick={handleClick}
            px={2}
            py={1}
            bg={eventInfo.backgroundColor ?? "gray.600"}
            color={eventInfo.textColor ?? "white"}
            borderRadius="md"
            fontSize="xs"
            fontWeight="semibold"
            cursor="pointer"
          >
            {eventInfo.event.title}
          </Box>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content width={"full"}>
              <VStack
                alignItems={"flex-start"}
                gap={4}
                padding={4}
                width={"full"}
              >
                <Flex
                  gap={8}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  width={"full"}
                >
                  <BaseText variant={TextVariant.M} weight={TextWeight.Bold}>
                    {eventInfo.event.title}
                  </BaseText>
                  <BaseIcon
                    color={"red"}
                    onClick={() => setOpenedPopoverId(null)}
                    boxSize={"20px"}
                    cursor={"pointer"}
                  >
                    <IoIosClose />
                  </BaseIcon>
                </Flex>
                <HStack align="start">
                  <BaseText fontSize="sm">
                    {formatDisplayDate(eventInfo.event.start)} ~{" "}
                    {formatDisplayDate(eventInfo.event.end)}
                  </BaseText>
                </HStack>
              </VStack>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    );
  };

  return (
    <Box
      width={"full"}
      className={`${colorMode === "dark" ? "calendar-dark" : "calendar-light"}`}
    >
      <VStack gap={8} mb={50} alignItems={"flex-start"} width={"full"}>
        <HStack width={"full"} justify="space-between" align="center">
          <HStack gap={5}>
            <BaseButton
              borderRadius={"full"}
              onClick={() => calendarApi?.today()}
              padding={6}
              bg={"none"}
              borderWidth={1}
              borderColor={"gray.100"}
              color={colorMode === "dark" ? "white" : "black"}
              _hover={{
                backgroundColor: colorMode === "dark" ? "gray.800" : "gray.50",
              }}
            >
              {t("COMMON.TODAY")}
            </BaseButton>
            <Flex gap={3}>
              <BaseIcon
                color={"none"}
                borderRadius={"full"}
                boxSize={"30px"}
                borderColor={colorMode === "dark" ? "white" : "gray.100"}
                _hover={{
                  backgroundColor:
                    colorMode === "dark" ? "gray.800" : "gray.50",
                }}
                onClick={() => calendarApi?.prev()}
                cursor={"pointer"}
              >
                <HiMiniChevronLeft
                  color={
                    colorMode === "dark"
                      ? VariablesColors.white
                      : VariablesColors.black
                  }
                  size={22}
                />
              </BaseIcon>
              <BaseIcon
                color={"none"}
                borderRadius={"full"}
                boxSize={"30px"}
                borderColor={colorMode === "dark" ? "white" : "gray.100"}
                _hover={{
                  backgroundColor:
                    colorMode === "dark" ? "gray.800" : "gray.50",
                }}
                onClick={() => calendarApi?.next()}
                cursor={"pointer"}
              >
                <HiMiniChevronRight
                  color={
                    colorMode === "dark"
                      ? VariablesColors.white
                      : VariablesColors.black
                  }
                  size={22}
                />
              </BaseIcon>
            </Flex>
          </HStack>
          <BaseText
            variant={TextVariant.L}
            weight={TextWeight.Bold}
            textTransform={"capitalize"}
          >
            {currentTitle}
          </BaseText>
          <SegmentGroup.Root
            value={value}
            onValueChange={(e) => {
              setValue(e.value);
              changeView(e.value ?? "");
            }}
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={renderButtonsValue} />
          </SegmentGroup.Root>
        </HStack>

        {showLegend && (
          <HStack gap={8}>
            <Status value={"success"} size={"lg"}>
              {t("COMMON.LEGEND.RESERVATIONS")}
            </Status>
            <Status value={"warning"} size={"lg"}>
              {t("COMMON.LEGEND.MAINTENANCE")}
            </Status>
            <Status value={"error"} size={"lg"}>
              {t("COMMON.LEGEND.CANCELED")}
            </Status>
            <Status value={"info"} size={"lg"}>
              {t("COMMON.LEGEND.UNAVAILABLE")}
            </Status>
          </HStack>
        )}
      </VStack>

      <FullCalendar
        locales={[frLocale, enLocale]}
        locale={i18n.language === "fr" ? "fr" : "en"}
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        headerToolbar={false}
        datesSet={handleDatesSet}
        initialView={initialView}
        nowIndicator
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        editable={false}
        selectable={false}
        dragScroll={false}
        eventStartEditable={false}
        eventDurationEditable={false}
        allDaySlot={false}
        events={events}
        select={onDateSelect}
        eventClick={onEventClick}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
    </Box>
  );
};
