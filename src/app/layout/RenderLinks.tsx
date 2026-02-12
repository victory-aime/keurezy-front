import { Flex, For, HStack, Spinner } from "@chakra-ui/react";
import { BaseButton, BaseIcon, BaseText } from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import { APP_ROUTES } from "_config/routes";
import { useAuth } from "_hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserMenu } from "./UserMenu";
import { MODELS } from "_types/";
import { CiBellOn, CiLogout } from "react-icons/ci";
import { UserRole } from "../../types/enum";

export const RenderLinks = ({
  links,
  isLoading = false,
  user,
  createAgency,
  isMobile,
  onClose,
}: {
  links: {
    id: number;
    icon: any;
    name: string;
    url: string;
  }[];
  isLoading?: boolean;
  user: MODELS.IUser | undefined;
  isMobile: boolean;
  createAgency?: () => void;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { logout } = useAuth();
  return (
    <HStack
      width={"full"}
      alignItems={"center"}
      justifyContent={"flex-end"}
      flexDirection={isMobile ? "column" : "row"}
    >
      <Flex
        width={"full"}
        alignItems={isMobile ? "flex-start" : "center"}
        gap={4}
        flexDirection={isMobile ? "column" : "row"}
      >
        <For each={links}>
          {(link, i) => (
            <Link key={i} href={link.url}>
              <BaseButton
                width={"full"}
                gap={2}
                variant={currentIndex === i ? "solid" : "plain"}
                color={currentIndex === i ? "white" : "black"}
                leftIcon={<link.icon />}
                onClick={() => {
                  const index = links?.findIndex(
                    (item) => item?.id === link?.id,
                  );
                  setCurrentIndex(index);
                }}
              >
                {link?.name}
              </BaseButton>
            </Link>
          )}
        </For>
      </Flex>

      <Flex
        width={isMobile ? "full" : "1/2"}
        alignItems={isMobile ? "none" : "center"}
        justifyContent={"flex-end"}
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
      >
        <BaseButton colorType={"secondary"} onClick={createAgency}>
          {user?.role !== UserRole.IMMO_OWNER
            ? " Créer mon agence"
            : "Accéder au tableau de bord"}
        </BaseButton>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {user ? (
              <>
                {!isMobile ? (
                  <>
                    <CiBellOn size={24} />
                    <Avatar
                      name={user?.name}
                      src={
                        user?.image! ?? "https://avatar.iran.liara.run/public"
                      }
                    />
                    <BaseIcon
                      color={"red"}
                      onClick={() => logout()}
                      cursor={"pointer"}
                    >
                      <CiLogout />
                    </BaseIcon>
                  </>
                ) : (
                  <UserMenu
                    user={user}
                    logout={() => {
                      onClose?.();
                      logout();
                    }}
                  />
                )}
              </>
            ) : (
              <BaseButton
                onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
                width={isMobile ? "full" : "fit-content"}
                variant={"outline"}
                colorType={"neutral"}
              >
                <BaseText color={"black"}>Connexion</BaseText>
              </BaseButton>
            )}
          </>
        )}
      </Flex>
    </HStack>
  );
};
