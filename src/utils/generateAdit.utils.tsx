"use client";

import { formatDateFormAuditTable, getTimeValue } from "rise-core-frontend";
import { BaseText, BaseTooltip, TextVariant } from "_components/custom";

export const generateAuditCell = (
  t: any,
  value: { userId: string; timestamp: string },
  currentUserId?: string,
) => {
  const { userId, timestamp } = value;

  if (!userId || !timestamp || !currentUserId) {
    return "-";
  }

  const userName =
    userId === currentUserId ? t("COMMON.ME") : t("UNKNOWN_USER");

  return (
    <BaseTooltip
      show
      message={t("COMMON.AUDIT", {
        name: userName,
        date: formatDateFormAuditTable(timestamp),
        time: getTimeValue(timestamp),
      })}
    >
      <BaseText variant={TextVariant.S}>
        {formatDateFormAuditTable(timestamp)}
      </BaseText>
    </BaseTooltip>
  );
};
