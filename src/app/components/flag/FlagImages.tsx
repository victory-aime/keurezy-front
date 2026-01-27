import React, { FC } from "react";

import { Image } from "@chakra-ui/react";
import { FlagKeys, FlagIcon } from "_assets/images/flag";
import { ImageProps } from "@chakra-ui/react";
import { Loader } from "_components/custom";

export interface FlagIconProps extends ImageProps {
  countryImage: FlagKeys;
  border?: number | string;
  isLoading?: boolean;
}

export const FlagImagesIcon: FC<FlagIconProps> = ({
  isLoading,
  countryImage,
  border,
  ...rest
}) => {
  const flagImage = FlagIcon[countryImage];

  if (!flagImage) {
    return null;
  }

  return (
    <>
      {isLoading ? (
        <Loader loader={isLoading} />
      ) : (
        <Image
          id={countryImage}
          alt="flag-currency"
          src={`/assets/images/flag/${countryImage}.png`}
          w="34px"
          h="34px"
          borderRadius={border}
          fit="cover"
          objectPosition="center"
          {...rest}
        />
      )}
    </>
  );
};
