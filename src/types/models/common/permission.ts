interface IGetAllPermissionResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  planFeatures: [
    {
      limit: number;
      enabled: boolean;
    },
  ];
  permissions: [
    {
      id: string;
      name: string;
      description: string;
    },
  ];
}

export type { IGetAllPermissionResponse };
