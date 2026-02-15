"use client";

import {
  BaseBadge,
  BaseContainer,
  BaseFormatNumber,
  BaseRatio,
  ColumnsDataTable,
  DataTableContainer,
} from "_components/custom";
import { AppartForm } from "./AppartForm";
import { useState } from "react";
import { PropertyModule, UserModule } from "_store/state-management";
import { MODELS, CONSTANTS, ENUM } from "_types/*";

export const AppartList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedValues, setSelectedValues] = useState({} as MODELS.IProperty);

  const { data: user } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });

  const {
    data: allProperties,
    isLoading,
    refetch: refectProperty,
  } = PropertyModule.getAllProperties({
    params: {
      agencyId: user?.propertyOwner?.propertyAgency?.id,
    },
    queryOptions: {
      enabled: !!user?.propertyOwner?.propertyAgency?.id,
    },
  });

  const { mutateAsync: createProperty, isPending: createPending } =
    PropertyModule.createPropertyMutation({
      mutationOptions: {
        onSuccess: async () => {
          setOpenForm(false);
          await refectProperty();
        },
      },
    });

  const handleCreateProperty = async (data: MODELS.ICreateProperty) => {
    const formData = new FormData();
    formData.append("title", String(data.title));
    formData.append("description", String(data.description));
    formData.append("type", String(data.type));
    formData.append("country", String(data.country));
    formData.append("city", String(data.city));
    formData.append("address", String(data.address));
    formData.append("price", String(data.price));
    formData.append("surface", String(data.surface));
    formData.append("rooms", String(data.rooms));
    formData.append(
      "propertyAgenceId",
      String(user?.propertyOwner?.propertyAgency.id),
    );
    if (data.galleryImages) {
      data.galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });
    }
    if (selectedValues?.id) {
      console.log("update property with id", selectedValues.id);
    } else {
      await createProperty({ payload: formData as MODELS.ICreateProperty });
    }
  };

  const appartColumns: ColumnsDataTable[] = [
    {
      header: "",
      accessor: "select",
    },
    {
      header: "Images",
      accessor: "galleryImages",
      cell: (image: string[]) => <BaseRatio image={image?.[0]} width={100} />,
    },
    {
      header: "Nom du bâtiment",
      accessor: "title",
    },
    {
      header: "Pays",
      accessor: "country",
      cell: (country: string) =>
        CONSTANTS.countryList.find((item) => item.value === country)?.label ||
        country,
    },
    {
      header: "Ville",
      accessor: "fullObject",
      cell: (data) => {
        const city = CONSTANTS.citiesByCountry?.[data.country || ""]?.find(
          (item) => item.value === data.city,
        )?.label;
        return city || "";
      },
    },

    {
      header: "Type",
      accessor: "type",
      cell: (type: string) =>
        CONSTANTS.propertyTypes.find((item) => item.value === type)?.label ||
        type,
    },
    {
      header: "Prix",
      accessor: "price",
      cell: (price: number) => <BaseFormatNumber value={price} />,
    },

    {
      header: "Prix",
      accessor: "status",
      cell: (price: ENUM.COMMON.Status) => <BaseBadge status={price} />,
    },

    {
      header: "Actions",
      accessor: "actions",
      actions: [
        {
          name: "view",
          handleClick() {},
        },
        {
          name: "edit",
          handleClick(data) {
            setSelectedValues(data);
            setOpenForm(true);
          },
        },
        {
          name: "delete",
          handleClick() {},
        },
      ],
    },
  ];

  return (
    <BaseContainer
      border={"none"}
      title={"Liste des Bâtiments"}
      withActionButtons
      actionsButtonProps={{
        validateTitle: "Ajouter une propriété",
        onReload: async () => {
          await refectProperty();
        },
        onDownload() {},
        onClick: () => {
          setOpenForm(true);
          setSelectedValues({});
        },
      }}
    >
      <DataTableContainer
        isLoading={isLoading}
        data={allProperties ?? []}
        columns={appartColumns}
        hidePagination
      />
      <AppartForm
        onChange={setOpenForm}
        isOpen={openForm}
        data={selectedValues}
        callback={handleCreateProperty}
        isLoading={createPending}
      />
    </BaseContainer>
  );
};
