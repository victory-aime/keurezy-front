import { ENUM } from "..";

export interface IResponseRentalAgreementByAgency {
  tenant: {
    id: string;
    name: string;
    image: string;
    status: ENUM.COMMON.Status;
  };
  rentAmount: 250000;
  property: {
    title: string;
  };
  status: ENUM.COMMON.Status;
  startDate: string;
  endDate: string;
}
