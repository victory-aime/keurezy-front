'use client';

import { useUserContext } from '_context/user-context';
import { usePermissions } from '_hooks/usePermissions';
import { PropertyModule, AnnonceModule } from '_store/state-management';
import { AppPermissions } from '_utils/app-permissions';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { MODELS, VALIDATION } from '_types/*';
import { useRouter } from 'next/navigation';
import { findDynamicIdInList } from 'rise-core-frontend';
import { AnnonceFormInner } from './AnnonceFormInner';

export const AnnonceForm = ({ annonceId }: { annonceId: string }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { hasPermission } = usePermissions();
  const [galleryImagesUrl, setGalleryImagesUrl] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<MODELS.ICreateAnnonce>({});
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const { data: allProperties } = PropertyModule.getAllPropertiesByAgency({
    params: { agencyId, userId },
    queryOptions: {
      enabled: !!agencyId && !!userId && hasPermission(AppPermissions.PROPERTIES.VIEW),
    },
  });

  const { data: allAnnonces } = AnnonceModule.getAllAnnoncesByAgency({
    params: { agencyId, userId },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const { mutateAsync: createAnnonce, isPending: isCreatePending } =
    AnnonceModule.createAnnonceMutation({
      mutationOptions: {
        onSuccess: () => {
          AnnonceModule.AnnonceCache.invalidateAllAnnoncesCache();
          router.back();
        },
      },
    });

  const { mutateAsync: updateAnnonce, isPending: isUpdatePending } =
    AnnonceModule.updateAnnonceMutation({
      mutationOptions: {
        onSuccess: () => {
          AnnonceModule.AnnonceCache.invalidateAllAnnoncesCache();
          router.back();
        },
      },
    });

  const getAnnonces = findDynamicIdInList(annonceId, allAnnonces);

  const onSubmit = async (data: MODELS.ICreateAnnonce) => {
    const formData = new FormData();
    const payload = {
      id: annonceId,
      title: data.title,
      description: data.description,
      status: data.status?.[0],
      propertyId: data.propertyId?.[0],
      agencyId,
      userId,
    };

    formData.append('data', JSON.stringify(payload));

    if (data?.galleryImages) {
      data.galleryImages.forEach((file) => {
        formData.append('galleryImages', file);
      });
    }
    if (annonceId) {
      await updateAnnonce({
        payload: formData as MODELS.ICreateAnnonce,
      });
    } else {
      await createAnnonce({
        payload: formData as MODELS.ICreateAnnonce,
      });
    }
  };

  useEffect(() => {
    if (annonceId && getAnnonces) {
      setInitialValues({
        ...getAnnonces,
        status: [getAnnonces?.status],
        propertyId: [getAnnonces?.propertyId],
        propertyType: [getAnnonces?.property?.type],
        loyer: getAnnonces?.property?.price,
        area: getAnnonces?.property?.area,
        rooms: getAnnonces?.property?.rooms,
        bathrooms: getAnnonces?.property?.bathrooms,
      });
      setGalleryImagesUrl(getAnnonces?.galleryImages);
    }
  }, [annonceId, getAnnonces]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={VALIDATION.ANNONCES.annonceSchema}
    >
      <AnnonceFormInner
        annonceId={annonceId}
        isCreateAnnonce={isCreatePending}
        isUpdate={isUpdatePending}
        galleryImagesUrl={galleryImagesUrl}
        allProperties={allProperties?.content ?? []}
      />
    </Formik>
  );
};
