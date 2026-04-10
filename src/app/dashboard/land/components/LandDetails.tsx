import { Flex, Box, Stack, Separator, VStack, HStack } from "@chakra-ui/react";
import {
  BaseButton,
  BaseDrawer,
  BaseFormatNumber,
  BaseIcon,
  BaseTag,
  BaseText,
  CustomSkeletonLoader,
  Icons,
  ModalOpenProps,
} from "_components/custom";
import { FormCard } from "../../components/FormCard";
import { formatDisplayDate } from "rise-core-frontend";
import { MODELS } from "_types/*";

interface LandDetail extends ModalOpenProps {
  data: MODELS.LandResponseDto | null;
}

export const LandDetails = ({
  isOpen,
  onChange,
  data,
  isLoading,
  callback,
}: LandDetail) => {
  return (
    <BaseDrawer
      title={"Detail du Terrain"}
      description={" Visualisation des informations du Terrain"}
      size={"lg"}
      icon={<Icons.RiBuildingLine />}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter
    >
      <Box
        borderLeftWidth={2}
        boxShadow={"sm"}
        borderRadius={"lg"}
        borderColor={"primary.500"}
        p={4}
        mb={4}
      >
        {isLoading ? (
          <Flex gap={2} justifyContent={"space-between"}>
            <HStack gap={2}>
              <CustomSkeletonLoader
                type="BUTTON"
                colorButton="primary"
                width={"40px"}
              />
              <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
            </HStack>
            <CustomSkeletonLoader
              type="BUTTON"
              colorButton="primary"
              width={"110px"}
            />
          </Flex>
        ) : (
          <Flex alignItems={"center"} justifyContent={"space-between"} gap={5}>
            <HStack>
              <BaseIcon>
                <Icons.RiBuildingLine />
              </BaseIcon>
              <Stack gap={0}>
                <BaseText>{data?.title}</BaseText>
                <BaseText textTransform={"capitalize"}>
                  {data?.city},{data?.address},{data?.district}
                </BaseText>
              </Stack>
            </HStack>
            <BaseButton
              colorType="danger"
              variant={"outline"}
              onClick={() => callback?.()}
            >
              Supprimer
            </BaseButton>
          </Flex>
        )}
      </Box>
      <FormCard title="" isLoading={isLoading}>
        <VStack align="stretch" gap={0} width={"full"}>
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Prpriétaire</BaseText>
            <BaseText>{data?.landOwner}</BaseText>
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Adresse</BaseText>
            <BaseText>{data?.address}</BaseText>
          </Flex>
          <Separator />

          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Ville</BaseText>
            <BaseText>{data?.city}</BaseText>
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Prix de vente</BaseText>
            <BaseFormatNumber value={data?.purchasePrice ?? 0} />
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Status</BaseText>
            <BaseTag status={data?.status} />
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Créé le</BaseText>
            <BaseText> {formatDisplayDate(data?.createdAt)} </BaseText>
          </Flex>
          <Separator />
          <Flex py={2} justify="space-between">
            <BaseText color="gray.500">Modifié le</BaseText>
            <BaseText> {formatDisplayDate(data?.updatedAt)} </BaseText>
          </Flex>
        </VStack>
      </FormCard>
    </BaseDrawer>
  );
};
