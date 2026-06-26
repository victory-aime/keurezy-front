import { AuthContextProvider } from '_context/auth-context';
import { headers } from 'next/headers';
import { Layout } from './Layout/Layout';
import { SessionRefreshProvider } from '_context/SessionRefresh-context';
import { UserProvider } from '_context/user-context';
import { safeGetServerSession } from '_hooks/get-server-session';
import { DynamicThemeProvider } from '_context/theme-context';
import React from 'react';
import { PushNotificationsProvider } from '../provider/push-notifications';
import { ChatProvider } from '../provider/chat-provider';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await safeGetServerSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return (
    <AuthContextProvider session={session?.data as any}>
      <SessionRefreshProvider error={session?.error?.toString()}>
        <UserProvider userId={session?.data?.user?.id}>
          <DynamicThemeProvider>
            <PushNotificationsProvider>
              <Layout>{children}</Layout>
            </PushNotificationsProvider>
          </DynamicThemeProvider>
        </UserProvider>
      </SessionRefreshProvider>
    </AuthContextProvider>
  );
}
