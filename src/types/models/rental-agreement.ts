import { ENUM } from "..";

export interface IResponseRentalAgreementByAgency {
  id: string;
  tenant: {
    id: string;
    name: string;
    image: string;
    status: ENUM.COMMON.Status;
  };
  rentAmount: number;
  property: {
    title: string;
  };
  status: ENUM.COMMON.Status;
  startDate: string;
  endDate: string;
}
