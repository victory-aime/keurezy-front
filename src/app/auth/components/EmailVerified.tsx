"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BaseModal, BaseText, Loader, TextVariant } from "_components/custom";
import { VerificationState } from "../auth.types";
import { resolveState } from "../resolve-state";
import { TokenExpired } from "./TokenExpired";
import { TokenInvalid } from "./TokenInvalid";
import { UnknownError } from "./UnknownError";
import { CiMail } from "react-icons/ci";
import { Center } from "@chakra-ui/react";
import { authClient } from "../../lib/auth-client";
import { handleApiError } from "_utils/handleApiError";
import { APP_ROUTES } from "_config/routes";

export const EmailVerified = ({ params }: { params: string }) => {
  const router = useRouter();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [state, setState] = useState<VerificationState>("loading");

  const handleVerifyEmail = async (token: string) => {
    const { data, error } = await authClient.verifyEmail({
      query: { token },
    });

    if (error) {
      handleApiError({ status: error.status, message: error?.message! });
      setState(error?.message as VerificationState);
    }
    if (data?.status) {
      setOpenSuccess(true);
      setState("success");
      setTimeout(() => {
        router.replace(APP_ROUTES.REDIRECT);
      }, 3000);
    }
  };

  useEffect(() => {
    if (params) {
      const mapped = resolveState(params);
      setState(mapped);
      handleVerifyEmail(params);
    }
  }, [params]);

  return (
    <main>
      {state === "loading" && (
        <Center h={"100vh"}>
          <Loader loader showText />
        </Center>
      )}
      {state === "success" && (
        <BaseModal
          title={"Email Confirmé"}
          icon={<CiMail />}
          iconBackgroundColor={"tertiary.500"}
          isOpen={openSuccess}
          onChange={() => setOpenSuccess(false)}
          closeOnEscape={false}
          closeOnInteractOutside={false}
          showCloseButton={false}
          ignoreFooter
          animateConfetti
        >
          <BaseText variant={TextVariant.L}>
            🎉 Email confirmé avec succès. Préparation de votre espace…
          </BaseText>
        </BaseModal>
      )}
      {state === "token_expired" && <TokenExpired />}
      {state === "invalid_token" && <TokenInvalid />}
      {state === "unknown_error" && <UnknownError />}
    </main>
  );
};
