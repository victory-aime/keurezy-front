"use client";

import { FormatNumber } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BaseFormatNumberProps } from "./interface/format-number";
import { ENUM } from "_types/index";

export const BaseFormatNumber: FC<BaseFormatNumberProps> = ({
  value,
  notation = "standard",
  style = "decimal",
  currencyCode = ENUM.COMMON.Currency.XOF,
  maximumDigits,
  minimumDigits,
}) => {
  const [isInValidCurrency, setIsInvalidCurrency] = useState(false);
  // const isCurrency = (value: any): value is TYPES.ENUM.COMMON.Currency => Object.values(TYPES.ENUM.COMMON.Currency).includes(value)

  // useEffect(() => {
  //   if (!isCurrency(currencyCode)) {
  //     setIsInvalidCurrency(true)
  //   } else {
  //     setIsInvalidCurrency(false)
  //   }
  // }, [currencyCode])

  return (
    <>
      {currencyCode === ENUM.COMMON.Currency.USD ? (
        <>
          {currencyCode}
          <FormatNumber
            value={value}
            notation={notation}
            style={style}
            maximumFractionDigits={style === "percent" ? maximumDigits : 0}
            minimumFractionDigits={style === "percent" ? minimumDigits : 0}
          />
        </>
      ) : (
        <>
          <FormatNumber
            value={value}
            notation={notation}
            style={style}
            maximumFractionDigits={style === "percent" ? maximumDigits : 0}
            minimumFractionDigits={style === "percent" ? minimumDigits : 0}
          />{" "}
          {currencyCode}
        </>
      )}
    </>
  );
};
