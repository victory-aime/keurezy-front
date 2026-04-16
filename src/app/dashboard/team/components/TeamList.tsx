"use client";

import {
  BaseContainer,
  BaseSwitch,
  ColumnsDataTable,
  DataTableContainer,
} from "_components/custom";
import { useUserContext } from "_context/user-context";
import { TeamModule } from "_store/state-management";
import { CONSTANTS, MODELS } from "_types/*";
import { formatDisplayDate } from "rise-core-frontend";
import { TeamDetails } from "./TeamDetails";
import { useState } from "react";

export const TeamList = () => {
  const { user } = useUserContext();
  const [selectedValues, setSelectedValues] = useState<MODELS.ITeam | null>(
    null,
  );
  const [openDetails, setOpenDetails] = useState(false);

  const {
    data: teamList,
    isLoading: isTeamLoading,
    refetch: reloadTeamList,
  } = TeamModule.getAllTeamByAgency({
    params: {
      agencyId: user?.agencyId,
    },
    queryOptions: {
      enabled: !!user?.agencyId,
    },
  });

  const { mutateAsync: changeStatusTeam, isPending: isChangeStatusPending } =
    TeamModule.changeStatusTeamMutation({
      mutationOptions: {
        onSuccess: async () => await reloadTeamList(),
      },
    });

  const handleStatus = async (status: boolean, id: string, userId: string) => {
    await changeStatusTeam({
      payload: { status },
      params: { id, userId },
    });
  };

  const teamsColumns: ColumnsDataTable[] = [
    {
      header: "Nom",
      accessor: "name",
    },
    {
      header: "email",
      accessor: "email",
    },
    {
      header: "role",
      accessor: "role",
      cell: (role) =>
        CONSTANTS.AGENCY_ROLE_LIST.find((r) => r.value === role)?.label || role,
    },
    {
      header: "Status",
      accessor: "fullObject",
      cell: (values) => (
        <BaseSwitch
          isChecked={values.status}
          isLoading={isChangeStatusPending}
          onSwitchChange={async (item) => {
            await handleStatus(item, values.id, values.userId);
          }}
        />
      ),
    },
    {
      header: "Ajouter le",
      accessor: "createdAt",
      cell: (createdAt) => formatDisplayDate(createdAt),
    },
    {
      header: "Actions",
      accessor: "actions",
      actions: [
        {
          name: "view",
          handleClick(data) {
            setOpenDetails(true);
            setSelectedValues(data);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      title={"Gestion de l'équipe"}
      description={
        " Gérez les membres de votre équipe et leurs rôles au sein de l'agence."
      }
      border={"none"}
      withActionButtons
      actionsButtonProps={{
        onReload: async () => await reloadTeamList(),
      }}
    >
      <DataTableContainer
        data={teamList ?? []}
        columns={teamsColumns}
        isLoading={isTeamLoading}
        hidePagination={teamList ? teamList.length < 10 : true}
      />
      <TeamDetails
        data={selectedValues}
        onChange={setOpenDetails}
        isOpen={openDetails}
        callback={() => {
          handleStatus(
            selectedValues?.status!,
            selectedValues?.id!,
            selectedValues?.userId!,
          );
          setOpenDetails(false);
        }}
      />
    </BaseContainer>
  );
};
