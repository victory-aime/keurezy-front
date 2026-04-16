export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IAuthSession {
  expiresAt: string | undefined;
  token: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | undefined;
  userAgent: string | undefined;
  id: string | undefined;
  userId: string | undefined;
  permissions: {
    name: string;
    feature: string;
    category: string;
  }[];
}
