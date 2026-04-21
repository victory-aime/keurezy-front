import { VStack } from '@chakra-ui/react';
import { BaseContainer, CustomSkeletonLoader, TextVariant } from '_components/custom';
import { BaseContainerProps } from '_components/custom/container/BaseContainer';

export const FormCard = ({
  title = 'Card title',
  description,
  children,
  loader: isLoading,
  width = 'full',
  flexProps,
  ...rest
}: BaseContainerProps) => {
  return isLoading ? (
    <VStack gap={3} width={'full'}>
      <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
      <CustomSkeletonLoader type="FORM" width={'full'} />
    </VStack>
  ) : (
    <BaseContainer
      {...rest}
      mt={2}
      title={title}
      description={description}
      textVariant={TextVariant.M}
      width={width}
      flexProps={flexProps}
    >
      {children}
    </BaseContainer>
  );
};
