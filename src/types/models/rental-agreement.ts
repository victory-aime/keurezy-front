import { ENUM } from "..";

export interface IRentalAgreement {
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

export interface IResponseRentalAgreementByAgency {
  content: IRentalAgreement[];
  totalDataPerPages: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
