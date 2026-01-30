"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { roleToDashboardMap } from "_constants/role";
import { Center } from "@chakra-ui/react";
import { authClient } from "../lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push(APP_ROUTES.AUTH.SIGN_IN);
    } else if (
      session?.session?.token &&
      roleToDashboardMap[session?.user?.role]
    ) {
      router.push(roleToDashboardMap[session?.user?.role]);
    } else {
      router.replace("/unauthorized");
    }
  }, [session, isPending, router]);

  return (
    <Center h={"100vh"}>
      <Loader loader showText />
    </Center>
  );
}
