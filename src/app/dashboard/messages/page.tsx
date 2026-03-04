"use client";

import { BaseContainer, BaseText } from "_components/custom";
import { RentalAgreementModule } from "_store/state-management";
import { DashboardMessages } from "./Messages";

export default function MessagePage() {
  const {} = RentalAgreementModule.getRentalAgreementListByAgencyQueries({});
  return (
    <BaseContainer
      title="Messages"
      description="Communiquez avec vos locataires"
      border={"none"}
    >
      <DashboardMessages />
    </BaseContainer>
  );
}
