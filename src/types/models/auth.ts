export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IAuthSession {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  id: string;
  userId: string;
  permissions: {
    name: string;
    feature: string;
    category: string;
  }[];
}
