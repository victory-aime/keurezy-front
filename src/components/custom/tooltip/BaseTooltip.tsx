import { Tooltip } from "_components/ui/tooltip";
import { FC, useId } from "react";
import { useTranslation } from "react-i18next";
import { ToggleTip } from "_components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { BaseTooltipProps } from "./interface/tooltip";
import { VariablesColors } from "_theme/variables";

export const BaseTooltip: FC<BaseTooltipProps> = ({
  children,
  message = "tooltip message",
  placement = "top",
  arrow,
  show,
}) => {
  const id = useId();
  const { t } = useTranslation();

  if (show && !children) {
    console.warn(
      'BaseTooltip: "children" prop is required when "show" is true.',
    );
    return null;
  }

  if (show) {
    return (
      <Tooltip
        ids={{ trigger: id }}
        showArrow={arrow}
        positioning={{ placement }}
        content={t(message)}
        openDelay={100}
        closeDelay={100}
        lazyMount
      >
        {children}
      </Tooltip>
    );
  }

  return (
    <ToggleTip
      showArrow
      size="md"
      ids={{ trigger: id }}
      positioning={{ placement }}
      content={t(message)}
    >
      <LuInfo size={14} color={VariablesColors.primary} />
    </ToggleTip>
  );
};
