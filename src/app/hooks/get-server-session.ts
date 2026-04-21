import { authClient } from '../lib/auth-client';

export const safeGetServerSession = async (options: any) => {
  try {
    return await authClient.getSession(options);
  } catch (error) {
    return {
      data: null,
      error: 'SERVER_UNREACHABLE',
    };
  }
};
