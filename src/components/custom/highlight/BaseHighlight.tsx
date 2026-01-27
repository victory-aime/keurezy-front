import React, { FC } from "react";
import { BaseFormatNumber, BaseText } from "_components/custom";

interface BaseHighlightProps {
  words?: string;
  amount: number;
  color: string;
}

export const BaseHighlight: FC<BaseHighlightProps> = ({
  words,
  color = "red",
  amount = 0,
}) => {
  return (
    <BaseText color={color}>
      {words ? words : <BaseFormatNumber value={amount} />}
    </BaseText>
  );
};
