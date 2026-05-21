import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Box, Field, Flex } from '@chakra-ui/react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { BaseText, BaseTooltip, CustomSkeletonLoader, Icons } from '_components/custom';
import { useTranslation } from 'react-i18next';
import { NativeSelect } from '_components/ui/select-native';
import { TimeInputProps } from './interface/input';
import { CiTimer } from 'react-icons/ci';
import { generateTimeOptions } from './utils/gerenateTime';

export const FormTimePicker = ({
  name,
  label,
  required = false,
  toolTipInfo,
  isDisabled = false,
  variant = 'outline',
  placeholder = 'Select an option',
  infoMessage,
  isReadOnly = false,
  isLoading = false,
}: TimeInputProps) => {
  const { t, i18n } = useTranslation();
  const [field, { touched, error }, { setValue }] = useField(name);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly ? !!error : !!(error && (touched || submitCount > 0));

  const timeOptions = generateTimeOptions(i18n.language);

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label display={'flex'} gap={'6px'} fontSize={'14px'}>
          {isLoading ? (
            <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
          ) : (
            <>
              {t(label)}
              {required && <BaseText color={'red'}> * </BaseText>}
              {toolTipInfo && (
                <BaseTooltip message={toolTipInfo}>
                  <HiOutlineInformationCircle size={18} />
                </BaseTooltip>
              )}
            </>
          )}
        </Field.Label>
      )}

      {isLoading ? (
        <CustomSkeletonLoader type="FORM" height={'45px'} width={'100%'} />
      ) : (
        <NativeSelect
          {...field}
          name={field.name}
          value={field.value}
          items={timeOptions}
          placeholder={t(placeholder)}
          icon={<CiTimer />}
          size={'md'}
          variant={variant}
          disabled={true}
          _placeholder={{ color: isError ? 'red.500' : 'gray.400' }}
          width={'full'}
        />
      )}
      {isError && (
        <Flex gap={1} mt={1} alignItems={'center'}>
          <Field.ErrorIcon width={2.5} height={2.5} color={'red.500'} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Flex>
      )}
      {infoMessage && (
        <Flex gap={1} mt={1} alignItems={'center'}>
          <Field.ErrorIcon width={2} height={2} color={'info.500'} />
          <Field.HelperText fontSize={'x-small'}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};
