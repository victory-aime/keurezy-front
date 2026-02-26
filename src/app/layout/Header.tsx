"use client";
import { Flex, HStack, useBreakpointValue } from "@chakra-ui/react";
import { BaseText, BaseToast, ToastStatus } from "_components/custom";
import Image from "next/image";
import { UserModule } from "_store/state-management";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "_context/auth-context";
import { HEADER_LINKS } from "./routes";
import { MobileLayout } from "./Mobile";
import { RenderLinks } from "./RenderLinks";
import { RxHamburgerMenu } from "react-icons/rx";
import { UserRole } from "../../types/enum";
import { ASSETS } from "_assets/images";

export const Header = () => {
  const router = useRouter();
  const { session } = useAuthContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: session?.userId },
    queryOptions: {
      enabled: !!session?.userId,
    },
  });

  const links = HEADER_LINKS(!!session?.token, user?.role!);

  const createAgency = () => {
    if (user?.id && user?.role !== UserRole.IMMO_OWNER) {
      router.push(`${APP_ROUTES.AUTH.REGISTER_AGENCY}?token=${user?.id}`);
    } else if (user?.role === UserRole.IMMO_OWNER) {
      router.push(APP_ROUTES.DASHBOARD);
    } else {
      BaseToast({
        duration: 3000,
        title: "Veuillez creer un compte",
        description: " Pour creer une agence vous devrez vous incrire",
        type: ToastStatus.INFO,
      });
    }
  };
  return (
    <Flex width={"full"} p={4}>
      <HStack width={"1/3"}>
        <Image src={ASSETS.LOGO} alt={"logo"} width={45} height={45} />
        <BaseText>MyIMMO</BaseText>
      </HStack>

      {isMobile ? (
        <HStack
          width={"full"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={"20px"}
        >
          <RxHamburgerMenu onClick={() => setSidebarOpen(true)} />
          <MobileLayout
            isOpen={isSidebarOpen}
            onClose={setSidebarOpen}
            links={links}
            isLoading={isLoading}
            user={user}
            createAgency={createAgency}
          />
        </HStack>
      ) : (
        <RenderLinks
          isMobile={false}
          links={links}
          isLoading={isLoading}
          user={user}
          createAgency={createAgency}
        />
      )}
    </Flex>
  );
};
