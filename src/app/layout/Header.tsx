"use client";
import {
  Flex,
  HStack,
  For,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  BaseButton,
  BaseText,
  CustomToast,
  ToastStatus,
} from "_components/custom";
import Image from "next/image";
import { CiBellOn } from "react-icons/ci";
import { UserModule } from "_store/state-management";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useAuth } from "_hooks/useAuth";
import { useAuthContext } from "_context/auth-context";
import { HEADER_LINKS } from "./routes";
import Link from "next/link";
import { MobileLayout } from "./Mobile";
import { RenderLinks } from "./RenderLinks";
import { RxHamburgerMenu } from "react-icons/rx";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { session } = useAuthContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: session?.userId },
    queryOptions: {
      enabled: !!session?.userId,
    },
  });

  const links = HEADER_LINKS(!!session?.token);

  const createAgency = () => {
    if (user?.id) {
      CustomToast({
        duration: 3000,
        title: "Vos infos",
        description: user?.id,
        type: ToastStatus.INFO,
      });
    } else {
      CustomToast({
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
        <Image
          src={"/assets/svg/my-immo.svg"}
          alt={"logo"}
          width={45}
          height={45}
        />
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
