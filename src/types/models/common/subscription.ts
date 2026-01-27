import { IUser } from "../users";

export interface ISubscription {
  id: string;
  name: string;
  price: string;
  currency: string;
  trialDays: number;
  createdAt: string;
  planFeatures?: {
    limits: {
      id: string;
      planFeatureId: string;
      key: string;
      type: string;
      numberValue: number;
      booleanValue: null;
      enumValue: null;
    }[];
  }[];
  limits: { id: string; planId: string; key: string; limitValue: number }[];
  modules: { id: string; name: string; features: { name: string }[] }[];
}

export interface ICreateSimpleUserDto extends IUser {
  packId: string;
}
