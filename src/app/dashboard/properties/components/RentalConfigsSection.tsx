'use client';
import { Badge, Box, Flex, HStack, Separator, SimpleGrid, VStack } from '@chakra-ui/react';
import { FieldArray, FormikErrors, useFormikContext } from 'formik';
import {
  BaseButton,
  BaseText,
  FormDatePicker,
  FormSwitch,
  FormTextInput,
  Icons,
  TextVariant,
  TextWeight,
} from '_components/custom';
import { BaseCheckBoxCard } from '_components/custom/checkbox-card/BaseCheckBoxCard';
import { CONSTANTS, ENUM, MODELS } from '_types/index';
import { minAvailabilityEndDate } from '_utils/rental-availability';
import { FormCard } from '../../components/FormCard';

/** Valeurs de formulaire d'une modalité (les champs numériques peuvent être vides pendant la saisie). */
export interface RentalConfigFormValue {
  rentalType: ENUM.RentalType;
  price: number | string;
  deposit: number | string;
  minDuration: number | string | null;
  maxDuration: number | string | null;
  isActive: boolean;
  availabilities: MODELS.IRentalAvailability[];
}

const RENTAL_TYPE_ORDER = CONSTANTS.rentalTypes.map((type) => type.value);

const emptyConfig = (rentalType: ENUM.RentalType): RentalConfigFormValue => ({
  rentalType,
  price: '',
  deposit: '',
  minDuration: 1,
  maxDuration: null,
  isActive: true,
  availabilities: [],
});

const getRentalTypeMeta = (rentalType: ENUM.RentalType) =>
  CONSTANTS.rentalTypes.find((type) => type.value === rentalType)!;

/** Réponse API → valeurs de formulaire (les disponibilités sont regroupées par type). */
export const toRentalConfigFormValues = (
  property?: MODELS.IPropertyResponse,
): RentalConfigFormValue[] =>
  (property?.rentalConfigs ?? [])
    .map((config) => ({
      rentalType: config.rentalType,
      price: Number(config.price),
      deposit: Number(config.deposit),
      minDuration: config.minDuration,
      maxDuration: config.maxDuration,
      isActive: config.isActive,
      availabilities: (property?.availabilities ?? [])
        .filter((availability) => availability.rentalType === config.rentalType)
        .map((availability) => ({
          startDate: availability.startDate,
          endDate: availability.endDate,
        })),
    }))
    .sort(
      (a, b) => RENTAL_TYPE_ORDER.indexOf(a.rentalType) - RENTAL_TYPE_ORDER.indexOf(b.rentalType),
    );

/** Valeurs de formulaire → contrat backend (dates calendaires AAAA-MM-JJ). */
export const toRentalConfigsPayload = (
  configs: RentalConfigFormValue[] = [],
): MODELS.IRentalConfig[] =>
  configs.map((config) => ({
    rentalType: config.rentalType,
    price: Number(config.price),
    deposit: config.deposit === '' ? 0 : Number(config.deposit),
    minDuration: config.minDuration ? Number(config.minDuration) : null,
    maxDuration: config.maxDuration ? Number(config.maxDuration) : null,
    isActive: config.isActive,
    availabilities: config.availabilities
      .filter((availability) => availability.startDate && availability.endDate)
      .map((availability) => ({
        startDate: availability.startDate.slice(0, 10),
        endDate: availability.endDate.slice(0, 10),
      })),
  }));

/** Sous-partie d'une modalité : titre + aide courte. */
const ConfigSubSection = ({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <VStack width={'full'} alignItems={'stretch'} gap={3}>
    <Flex justifyContent={'space-between'} alignItems={'center'} gap={2}>
      <VStack alignItems={'flex-start'} gap={0}>
        <BaseText variant={TextVariant.S} weight={TextWeight.Medium}>
          {title}
        </BaseText>
        {hint && (
          <BaseText variant={TextVariant.XS} color={'fg.muted'}>
            {hint}
          </BaseText>
        )}
      </VStack>
      {action}
    </Flex>
    {children}
  </VStack>
);

export const RentalConfigsSection = ({ isLoading }: { isLoading?: boolean }) => {
  const { values, errors, submitCount, setFieldValue } = useFormikContext<{
    rentalConfigs: RentalConfigFormValue[];
  }>();
  const configs = values.rentalConfigs ?? [];
  const hasSubmitted = submitCount > 0;
  const selectionError =
    hasSubmitted && typeof errors.rentalConfigs === 'string' ? errors.rentalConfigs : null;
  const configsErrors = Array.isArray(errors.rentalConfigs)
    ? (errors.rentalConfigs as (FormikErrors<RentalConfigFormValue> | undefined)[])
    : [];

  const toggleRentalType = (rentalType: ENUM.RentalType) => {
    const isSelected = configs.some((config) => config.rentalType === rentalType);
    const next = isSelected
      ? configs.filter((config) => config.rentalType !== rentalType)
      : [...configs, emptyConfig(rentalType)];

    setFieldValue(
      'rentalConfigs',
      next.sort(
        (a, b) => RENTAL_TYPE_ORDER.indexOf(a.rentalType) - RENTAL_TYPE_ORDER.indexOf(b.rentalType),
      ),
    );
  };

  return (
    <FormCard
      title="Modalités de location"
      description="Choisissez comment ce bien peut être loué, puis renseignez pour chaque modalité ses tarifs, ses durées et ses périodes de disponibilité."
      loader={isLoading}
    >
      <VStack width={'full'} mt={4} gap={6} alignItems={'stretch'}>
        <VStack width={'full'} alignItems={'stretch'} gap={2}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            {CONSTANTS.rentalTypes.map((type) => (
              <BaseCheckBoxCard
                key={type.value}
                label={type.label}
                checked={configs.some((config) => config.rentalType === type.value)}
                onCheckedChange={() => toggleRentalType(type.value)}
              >
                <BaseText variant={TextVariant.XS} color={'fg.muted'}>
                  {type.description}
                </BaseText>
              </BaseCheckBoxCard>
            ))}
          </SimpleGrid>

          {selectionError && (
            <Flex id="rentalConfigs" data-invalid gap={1} alignItems={'center'}>
              <Icons.Warn size={14} color={'var(--chakra-colors-fg-error)'} />
              <BaseText variant={TextVariant.XS} color={'fg.error'}>
                {selectionError}
              </BaseText>
            </Flex>
          )}
        </VStack>

        {configs.map((config, index) => {
          const meta = getRentalTypeMeta(config.rentalType);
          const fieldName = `rentalConfigs.${index}`;
          const hasErrors = hasSubmitted && !!configsErrors[index];

          return (
            <Box
              key={config.rentalType}
              borderWidth={'1px'}
              borderColor={hasErrors ? 'border.error' : 'border'}
              rounded={'lg'}
              p={4}
              width={'full'}
            >
              <Flex
                justifyContent={'space-between'}
                alignItems={{ base: 'flex-start', sm: 'center' }}
                flexDir={{ base: 'column', sm: 'row' }}
                gap={2}
              >
                <HStack gap={2} flexWrap={'wrap'}>
                  <BaseText variant={TextVariant.M} weight={TextWeight.SemiBold}>
                    Location {meta.label.toLowerCase()}
                  </BaseText>
                  <Badge colorPalette={'teal'} variant={'subtle'}>
                    par {meta.unit}
                  </Badge>
                  {hasErrors && (
                    <Badge colorPalette={'red'} variant={'subtle'}>
                      À compléter
                    </Badge>
                  )}
                </HStack>
                <FormSwitch
                  name={`${fieldName}.isActive`}
                  label={config.isActive ? 'Proposée à la location' : 'Suspendue'}
                />
              </Flex>

              <Separator my={4} />

              <VStack width={'full'} gap={6} alignItems={'stretch'}>
                <ConfigSubSection title="Tarifs">
                  <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                    <FormTextInput
                      required
                      name={`${fieldName}.price`}
                      label={`Prix par ${meta.unit}`}
                      placeholder="Ex: 150000"
                      type="amount"
                    />
                    <FormTextInput
                      name={`${fieldName}.deposit`}
                      label="Caution"
                      placeholder="Ex: 300000"
                      type="amount"
                    />
                  </HStack>
                </ConfigSubSection>

                <ConfigSubSection
                  title="Durée d’une réservation"
                  hint={`Exprimée en ${meta.unitPlural}.`}
                >
                  <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                    <FormTextInput
                      name={`${fieldName}.minDuration`}
                      label={`Minimum (${meta.unitPlural})`}
                      placeholder="Ex: 1"
                      type="number"
                      toolTipInfo={CONSTANTS.rentalFieldHelp.minDuration}
                    />
                    <FormTextInput
                      name={`${fieldName}.maxDuration`}
                      label={`Maximum (${meta.unitPlural})`}
                      placeholder="Sans limite"
                      type="number"
                      toolTipInfo={CONSTANTS.rentalFieldHelp.maxDuration}
                    />
                  </HStack>
                </ConfigSubSection>

                <FieldArray name={`${fieldName}.availabilities`}>
                  {({ push, remove }) => (
                    <ConfigSubSection
                      title="Périodes de disponibilité"
                      hint={`${
                        config.availabilities.length
                          ? 'Seules ces périodes sont réservables.'
                          : CONSTANTS.rentalFieldHelp.availabilities
                      } Chaque période couvre au moins ${meta.minAvailability}.`}
                      action={
                        <BaseButton
                          size={'sm'}
                          variant={'outline'}
                          leftIcon={<Icons.PlusMinus size={16} />}
                          onClick={() => push({ startDate: '', endDate: '' })}
                          flexShrink={0}
                        >
                          Ajouter une période
                        </BaseButton>
                      }
                    >
                      {config.availabilities.map((availability, availabilityIndex) => (
                        <HStack
                          key={availabilityIndex}
                          width="full"
                          flexDir={{ base: 'column', sm: 'row' }}
                          alignItems={{ base: 'stretch', sm: 'flex-start' }}
                          gap={4}
                        >
                          <FormDatePicker
                            required
                            name={`${fieldName}.availabilities.${availabilityIndex}.startDate`}
                            label="Du"
                            placeholder="Date de début"
                            isDisabledPassDates
                          />
                          <FormDatePicker
                            required
                            name={`${fieldName}.availabilities.${availabilityIndex}.endDate`}
                            label="Au (inclus)"
                            placeholder="Date de fin"
                            isDisabledPassDates
                            minDate={minAvailabilityEndDate(
                              config.rentalType,
                              availability.startDate,
                            )}
                          />
                          <BaseButton
                            size={'sm'}
                            colorType={'danger'}
                            variant={'outline'}
                            aria-label="Supprimer la période"
                            onClick={() => remove(availabilityIndex)}
                            mt={{ base: 0, sm: 6 }}
                            alignSelf={{ base: 'flex-end', sm: 'flex-start' }}
                          >
                            <Icons.Trash size={14} />
                          </BaseButton>
                        </HStack>
                      ))}
                    </ConfigSubSection>
                  )}
                </FieldArray>
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </FormCard>
  );
};
