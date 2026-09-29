import { Flex, Separator, Stack, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BaseDrawer, BaseFormatNumber, BaseTag, BaseText, Icons } from '_components/custom';
import { CONSTANTS, ENUM } from '_types/*';
import { PropertyModule } from '_store/state-management';
import { FormCard } from '../../components/FormCard';

interface PropertyDetailsProps {
  /** Bien affiché ; `null` ferme le panneau */
  propertyId: string | null;
  onClose: () => void;
}

/** Ligne libellé / valeur du panneau, séparée de la suivante. */
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <>
    <Flex py={2} justify="space-between" gap={4}>
      <BaseText color="gray.500">{label}</BaseText>
      {children}
    </Flex>
    <Separator />
  </>
);

/**
 * Détail d'un bien de l'agence (`property/detail`) : caractéristiques, annonces liées et
 * modalités de location. Les données ne sont chargées qu'à l'ouverture du panneau.
 */
export const PropertyDetails = ({ propertyId, onClose }: PropertyDetailsProps) => {
  const { data, isLoading } = PropertyModule.getPropertyDetailQueries({
    params: { id: propertyId ?? '' },
    queryOptions: { enabled: !!propertyId },
  });

  const typeLabel = CONSTANTS.propertyTypes.find((type) => type.value === data?.type)?.label;
  const address = [data?.address, data?.district, data?.city].filter(Boolean).join(', ');

  return (
    <BaseDrawer
      title={data?.title ?? 'Détail du bien'}
      description="Caractéristiques, annonces et modalités de location"
      size="md"
      icon={<Icons.Home />}
      onChange={(open: boolean) => !open && onClose()}
      isOpen={!!propertyId}
      ignoreFooter
    >
      <VStack gap={4} align="stretch">
        <FormCard title="Caractéristiques" loader={isLoading}>
          <VStack align="stretch" gap={0} width="full">
            <Row label="Type">
              <BaseText>{typeLabel ?? data?.type ?? '-'}</BaseText>
            </Row>
            <Row label="Statut">
              <BaseTag status={data?.status as ENUM.COMMON.Status} />
            </Row>
            <Row label="Loyer">
              <BaseFormatNumber value={data?.price ?? 0} />
            </Row>
            <Row label="Caution">
              <BaseFormatNumber value={data?.caution ?? 0} />
            </Row>
            <Row label="Adresse">
              <BaseText textAlign="right">{address || 'Non renseignée'}</BaseText>
            </Row>
            <Row label="Pièces · salles de bain">
              <BaseText>
                {data?.rooms ?? 0} · {data?.bathrooms ?? 0}
              </BaseText>
            </Row>
            <Row label="Surface">
              <BaseText>{data?.area ? `${data.area} m²` : 'Non renseignée'}</BaseText>
            </Row>
          </VStack>
        </FormCard>

        <FormCard title="Annonces" loader={isLoading}>
          {data?.annonces?.length ? (
            <Stack gap={2} width="full">
              {data.annonces.map((annonce, index) => (
                <Flex key={annonce.id} justify="space-between" align="center">
                  <BaseText fontSize="sm">Annonce {index + 1}</BaseText>
                  <BaseTag status={annonce.status as ENUM.COMMON.Status} />
                </Flex>
              ))}
            </Stack>
          ) : (
            <BaseText color="gray.500" fontSize="sm">
              Aucune annonce pour ce bien.
            </BaseText>
          )}
        </FormCard>

        <FormCard title="Modalités de location" loader={isLoading}>
          {data?.rentalConfigs?.length ? (
            <Stack gap={2} width="full">
              {data.rentalConfigs.map((config) => (
                <Flex key={config.id} justify="space-between" align="center">
                  <BaseText fontSize="sm">
                    {CONSTANTS.rentalTypes.find((type) => type.value === config.rentalType)
                      ?.label ?? config.rentalType}
                    {!config.isActive && ' (inactive)'}
                  </BaseText>
                  <BaseFormatNumber value={Number(config.price)} />
                </Flex>
              ))}
            </Stack>
          ) : (
            <BaseText color="gray.500" fontSize="sm">
              Aucune modalité de location.
            </BaseText>
          )}
        </FormCard>
      </VStack>
    </BaseDrawer>
  );
};
