'use client';
import { Formik, FormikValues } from 'formik';
import {
  ActionsButton,
  BaseRadio,
  BaseText,
  FormSelect,
  FormTextInput,
  Icons,
  FormCheckbox,
  BaseAccordion,
  FormErrorFocus,
} from '_components/custom';
import { HStack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { MODELS, CONSTANTS, VALIDATION } from '_types/';
import { FormCard } from '../../components/FormCard';
import { FormContainer } from '../../components/FormContainer';
import { useRouter } from 'next/navigation';
import { BuildingModule, PropertyModule } from '_store/state-management';
import { findDynamicIdInList } from 'rise-core-frontend';
import { cityList } from '_constants/city';
import { DASHBOARD_ROUTES } from '../../routes';
import { getBuildingsList, propertyStatusList, propertyTypes } from '../constants/properties';
import {
  RentalConfigsSection,
  toRentalConfigFormValues,
  toRentalConfigsPayload,
} from './RentalConfigsSection';
import { useUserContext } from '_context/user-context';
import { PROPERTY_FEATURES_BY_CATEGORY } from '../../../../types/constants';

export const PropertyForm = ({ appartId }: { appartId: string }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<MODELS.ICreateProperty>(
    {} as MODELS.ICreateProperty,
  );

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const queryPayload = useMemo(
    () => ({
      params: {
        agencyId: agencyId!,
        initialPage: CONSTANTS.PAGINATION.INIT,
        limitPerPage: CONSTANTS.PAGINATION.FULL_PAGE_SIZE,
      },
      queryOptions: {
        enabled: !!agencyId && !!userId,
      },
    }),
    [agencyId, userId],
  );

  const { data: allProperties, isLoading: fetchLoading } =
    PropertyModule.getAllPropertiesByAgency(queryPayload);

  const { data: allBuildings, isLoading: isAllBuildingsLoad } =
    BuildingModule.getAllBuildingByAgencyQueries(queryPayload);

  const { mutateAsync: createProperty, isPending: createPending } =
    PropertyModule.createPropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          PropertyModule.PropertyCache.invalidateAllPropertyCache();
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.back();
        },
      },
    });

  const { mutateAsync: updateProperty, isPending: updatePending } =
    PropertyModule.updatePropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          PropertyModule.PropertyCache.invalidateAllPropertyCache();
          BuildingModule.BuildingCache.invalidateAllBuildingCache();
          router.back();
        },
      },
    });

  const getProperty = findDynamicIdInList(appartId, allProperties?.content);

  useEffect(() => {
    if (appartId && getProperty) {
      setInitialValues({
        ...getProperty,
        type: getProperty.type ? [getProperty.type] : [],
        batimentId: getProperty.batimentId ? [getProperty.batimentId] : [],
        city: getProperty.city ? [getProperty.city] : [],
        status: getProperty.status ? [getProperty.status] : [],
        rentalConfigs: toRentalConfigFormValues(getProperty),
        hasBatiment: getProperty.batimentId ? true : false,
      });
    }
    if (!appartId) {
      setInitialValues({
        hasBatiment: true,
        agencyId: agencyId!,
        rentalConfigs: [],
      });
    }
  }, [appartId, getProperty]);

  const handleCreateProperty = async (values: FormikValues) => {
    // Relations et champs dérivés de la réponse API exclus : le prix/caution viennent des modalités
    const { hasBatiment, rentalConfigs, availabilities, price, caution, ...rest } = values;

    const request: MODELS.ICreateProperty = {
      ...rest,
      agencyId: agencyId!,
      batimentId: hasBatiment ? values.batimentId?.[0] : null,
      type: values.type?.[0],
      city: values.city?.[0],
      status: values.status?.[0],
      rentalConfigs: toRentalConfigsPayload(rentalConfigs),
    };

    if (appartId) {
      await updateProperty({
        payload: request,
        params: { appartId },
      });
    } else {
      await createProperty({
        payload: request,
      });
    }
  };

  const getSelectedCountByCategory = (
    category: (typeof PROPERTY_FEATURES_BY_CATEGORY)[number],
    selectedValues: string[] = [],
  ) => {
    return category.features.filter((feature) => selectedValues.includes(feature.value)).length;
  };

  const featuresAccordions = (values: FormikValues) => {
    return PROPERTY_FEATURES_BY_CATEGORY.map((categories) => {
      const selectedCount = getSelectedCountByCategory(categories, values?.features);

      return {
        label: categories.category,
        selectedLength: selectedCount,
        content: (
          <VStack width={'full'} alignItems={'flex-start'}>
            <FormCheckbox name="features" items={categories?.features} />
          </VStack>
        ),
      };
    });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        // Valeurs par défaut d'un nouveau bien : écrasées par celles du bien en édition
        bathrooms: 1,
        area: 1,
        rooms: 1,
        rentalConfigs: [],
        ...initialValues,
        hasBatiment: getProperty?.batimentId ? true : false,
      }}
      onSubmit={handleCreateProperty}
      validationSchema={VALIDATION.PROPERTY_VALIDATION.createPropertySchema}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <FormContainer
          pageTitle={appartId ? 'Modifier le bien ' : 'Ajouter un bien'}
          pageDescription={'Renseignez les informations de votre propriété'}
          isLoading={fetchLoading}
        >
          <FormErrorFocus />
          <VStack gap={3} alignItems={'stretch'} width={'full'} mb={4}>
            {/* ==================== 1. INFORMATIONS PRINCIPALES ==================== */}
            <FormCard
              title="Informations principales"
              description="Identifiez le bien et décrivez sa configuration."
            >
              <VStack width={'full'} mt={4} gap={4}>
                <FormTextInput
                  required
                  label="Nom de la propriété"
                  placeholder="Ex: Appartement à louer à Mermoz"
                  name="title"
                  isLoading={fetchLoading}
                />

                <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                  <FormSelect
                    required
                    name="type"
                    label="Type de propriété"
                    placeholder="Sélectionner un type"
                    listItems={propertyTypes}
                    setFieldValue={setFieldValue}
                  />
                  <FormSelect
                    required
                    name="status"
                    label="Statut"
                    placeholder="Sélectionner un statut"
                    listItems={propertyStatusList}
                    setFieldValue={setFieldValue}
                  />
                </HStack>

                <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                  <FormTextInput
                    required
                    label="Surface (m²)"
                    placeholder="Ex: 120"
                    name="area"
                    type="number"
                  />
                  <FormTextInput
                    required
                    label="Nombre de chambres"
                    placeholder="Ex: 3"
                    name="rooms"
                    type="number"
                  />
                  <FormTextInput
                    required
                    label="Nombre de salles de bain"
                    placeholder="Ex: 2"
                    name="bathrooms"
                    type="number"
                  />
                </HStack>
              </VStack>
            </FormCard>

            {/* ==================== 2. LOCALISATION ==================== */}
            <FormCard title="Localisation" description="Indiquez où se situe le bien.">
              <VStack gap={4} mt={4} width={'full'} alignItems={'stretch'}>
                <VStack gap={2} alignItems={'flex-start'}>
                  <BaseText>Cette propriété est-elle dans un bâtiment ?</BaseText>
                  <BaseRadio
                    colorPalette="primary"
                    value={values.hasBatiment ? 'yes' : 'no'}
                    items={[
                      { label: 'Oui', value: 'yes' },
                      { label: 'Non', value: 'no' },
                    ]}
                    onValueChange={(details) => {
                      if (details?.value === 'yes') {
                        setFieldValue('hasBatiment', true);
                      } else {
                        setFieldValue('hasBatiment', false);
                        setFieldValue('batimentId', []);
                        setFieldValue('propertyNumber', null);
                      }
                    }}
                  />
                </VStack>

                {/* 🏢 CAS BATIMENT : l'adresse est celle du bâtiment */}
                {values.hasBatiment && (
                  <HStack width={'full'} flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                    <FormSelect
                      required
                      name="batimentId"
                      label="Bâtiment"
                      placeholder="Lier cette propriété à un bâtiment"
                      listItems={getBuildingsList({
                        content: allBuildings?.content ?? [],
                      })}
                      setFieldValue={setFieldValue}
                      isLoading={isAllBuildingsLoad}
                    />
                    <FormTextInput
                      required
                      label="Numéro"
                      placeholder="Ex: A3,ZZ0"
                      name="propertyNumber"
                      isLoading={fetchLoading}
                    />
                  </HStack>
                )}

                {/* 🏠 CAS SANS BATIMENT */}
                {!values.hasBatiment && (
                  <VStack gap={4} width={'full'}>
                    <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                      <FormSelect
                        required
                        name="city"
                        label="Ville"
                        placeholder="Sélectionner une ville"
                        listItems={cityList}
                        setFieldValue={setFieldValue}
                      />
                      <FormTextInput
                        required
                        label="Quartier"
                        placeholder="Ex: Niarry Tally"
                        name="district"
                      />
                    </HStack>

                    <HStack width="full" flexDir={{ base: 'column', sm: 'row' }} gap={4}>
                      <FormTextInput
                        required
                        name="address"
                        label="Adresse complète"
                        placeholder="Cite avion ouakam"
                      />
                      <FormTextInput
                        required
                        name="propertyOwner"
                        label="Nom du propriétaire"
                        placeholder="Ahmed Toure"
                      />
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </FormCard>

            {/* ==================== 3. CARACTÉRISTIQUES ==================== */}
            <FormCard
              title="Caractéristiques & équipements"
              description="Sélectionnez les pièces, équipements et services inclus."
            >
              <VStack gap={6} mt={4} width="full" alignItems="flex-start">
                <BaseAccordion items={featuresAccordions(values) ?? []} />
              </VStack>
            </FormCard>

            {/* ==================== 4. MODALITÉS DE LOCATION ==================== */}
            <RentalConfigsSection isLoading={fetchLoading} />
          </VStack>

          <ActionsButton
            justifyContent={'flex-end'}
            onClick={() => handleSubmit()}
            onCancel={() => router.push(DASHBOARD_ROUTES.PROPERTIES.LIST)}
            isLoading={createPending || updatePending}
            validateTitle={appartId ? 'Modifier le bien' : 'Ajouter le bien'}
            isEmailVerified={user?.emailVerified}
            icon={<Icons.RiBuildingLine />}
          />
        </FormContainer>
      )}
    </Formik>
  );
};
