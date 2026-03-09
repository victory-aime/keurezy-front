"use client";

import { Flex, SimpleGrid } from "@chakra-ui/react";
import { BaseContainer } from "_components/custom";
import {
  NotificationsModule,
  PropertyModule,
  RentalAgreementModule,
  UserModule,
} from "_store/state-management";

export default function DashboardPage() {
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });
  const {} = PropertyModule;
  const {} = RentalAgreementModule.getRentalAgreementListByAgencyQueries({
    queryOptions: { enabled: false },
  });
  const {} = NotificationsModule;

  const stats = [];
  return (
    <BaseContainer
      title="Tableau de bord"
      description={`Bievenue, ${user?.name}. Voici un aper`}
      border={"none"}
    >
      <SimpleGrid></SimpleGrid>
      <Flex width={"full"}>
        <BaseContainer>Activite recente</BaseContainer>
        <BaseContainer title="Actions rapides">
          <SimpleGrid>Actions rapide</SimpleGrid>
        </BaseContainer>
      </Flex>
    </BaseContainer>
  );
}
