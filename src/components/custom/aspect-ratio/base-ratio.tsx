import React, { FC } from "react";
import { BaseText, IAspectRatioProps } from "_components/custom";
import { AspectRatio, Image } from "@chakra-ui/react";

export const BaseRatio: FC<IAspectRatioProps> = ({
  image,
  ratio = 16 / 9,
  style,
  ...rest
}) => {
  return (
    <>
      {image ? (
        <AspectRatio ratio={ratio} width={"full"} position="relative" {...rest}>
          <Image
            src={image}
            alt="image"
            objectFit={"cover"}
            style={style}
            borderRadius={"7px"}
          />
        </AspectRatio>
      ) : (
        <BaseText>Aucune image</BaseText>
      )}
    </>
  );
};
