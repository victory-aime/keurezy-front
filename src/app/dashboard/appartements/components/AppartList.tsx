"use client";

import {
  BaseContainer,
  ColumnsDataTable,
  DataTableContainer,
} from "_components/custom";
import { AppartForm } from "./AppartForm";
import { useState } from "react";

export const AppartList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedValues, setSelectedValues] = useState({} as any);
  const appartColumns: ColumnsDataTable[] = [
    {
      header: "",
      accessor: "select",
    },
    {
      header: "Nom du bâtiment",
      accessor: "name",
    },
    {
      header: "Emplacement",
      accessor: "address",
    },
    {
      header: "Total d'occupant",
      accessor: "nbrOccupant",
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
        validateTitle: "Ajouter un batiment",
        onReload() {},
        onDownload() {},
        onClick: () => {
          setOpenForm(true);
          setSelectedValues({});
        },
      }}
    >
      <DataTableContainer
        data={[
          {
            id: 1,
            name: "Shal",
            address: "Shaloul4",
            nbrOccupant: 4,
          },
          {
            name: "Shal",
            address: "Shaloul4",
            nbrOccupant: 4,
          },
          { id: 2, name: "Shal", address: "Shaloul4", nbrOccupant: 4 },
          {
            id: 3,
            name: "Shal",
            address: "Shaloul4",
            nbrOccupant: 4,
          },
          {
            id: 4,
            name: "Shal",
            address: "Shaloul4",
            nbrOccupant: 4,
          },
        ]}
        columns={appartColumns}
        hidePagination
      />
      <AppartForm
        onChange={setOpenForm}
        isOpen={openForm}
        data={selectedValues}
      />
    </BaseContainer>
  );
};
