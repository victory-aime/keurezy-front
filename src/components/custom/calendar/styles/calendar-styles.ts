import { useColorMode } from "_components/ui/color-mode";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { DateRange, UI } from "react-day-picker";

export const useCalendarStyles = (
  isSelected: Date | DateRange,
  type: "single" | "range",
) => {
  const { colorMode } = useColorMode();

  const selectedBg = VariablesColors.primary;
  const currentDay = VariablesColors.info;
  const selectedColor =
    colorMode === "dark" ? VariablesColors.white : VariablesColors.black;
  const middleBg = hexToRGB("primary", 0.1);
  const middleColor =
    colorMode === "dark" ? VariablesColors.white : VariablesColors.black;
  const blockedBg = VariablesColors.danger;

  return {
    modifiersClassNames: {
      selected: "selected",
      today: "today",
      range_start: "range-start",
      range_end: "range-end",
      range_middle: "range-middle",
    },
    modifiersStyles: {
      selected: {
        backgroundColor: selectedBg,
        color: selectedColor,
      },
      range_start: {
        backgroundColor: selectedBg,
        color: selectedColor,
        borderRadius: type === "single" ? "4px" : "4px 0 0 4px",
      },
      range_end: {
        backgroundColor: selectedBg,
        color: selectedColor,
        borderRadius: type === "single" ? "8px" : "0 8px 8px 0",
      },
      range_middle: {
        backgroundColor: middleBg,
        color: middleColor,
        borderRadius: "0",
      },
      today: {
        fontWeight: "bold",
        backgroundColor: isSelected ? currentDay : middleBg,
      },
      booked: {
        backgroundColor: blockedBg,
        borderRadius: "0",
        color: "white",
        cursor: "not-allowed",
      },
      hovered: {
        backgroundColor: hexToRGB("primary", 0.3),
        color: selectedColor,
        borderRadius: "4px",
        boxShadow: "md",
      },
    },
    styles: {
      [UI.Day]: {
        width: "45px",
        height: "45px",
        borderRadius: "4px",
        fontSize: "13px",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      },
      [UI.Weekday]: {
        fontSize: "13px",
        color: "#888",
        padding: "1rem",
      },
      [UI.Nav]: {
        marginBottom: "1rem",
      },
      [UI.Root]: {
        padding: "1rem",
        borderRadius: "12px",
        fontFamily: "Lato, sans-serif",
      },

      // 🎯 Styles dropdown navigation
      [UI.Dropdowns]: {
        display: "flex",
        gap: "1.5rem",
        marginBottom: "1rem",
        alignItems: "center",
      },
      [UI.Dropdown]: {
        padding: "6px 10px",
        width: "150px",
        borderRadius: "6px",
        border: `1px solid ${hexToRGB("primary", 0.4)}`,
        backgroundColor: colorMode === "dark" ? "#1a1a1a" : "#fff",
        color: colorMode === "dark" ? "#fff" : "#000",
        fontSize: "14px",
        cursor: "pointer",
      },
      [UI.MonthsDropdown]: {
        width: "150px",
      },
      [UI.YearsDropdown]: {
        width: "80px",
      },
    },
  };
};
