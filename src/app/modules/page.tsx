"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "_components/custom";
import { useSession } from "next-auth/react";
import { APP_ROUTES } from "_config/routes";
import { roleToDashboardMap } from "_constants/role";
import { Center } from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const role = session?.role;

    if (!role && status === "unauthenticated") {
      router.push(APP_ROUTES.AUTH.SIGN_IN);
    } else if (role && roleToDashboardMap[role]) {
      router.push(roleToDashboardMap[role]);
    } else {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  return (
    <Center h={"100vh"}>
      <Loader loader showText />
    </Center>
  );
}
