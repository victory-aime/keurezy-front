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
import { APP_ROUTES } from "_config/routes";
import { Center } from "@chakra-ui/react";

export const EmailVerified = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openSuccess, setOpenSuccess] = useState(false);

  const [state, setState] = useState<VerificationState>("loading");

  useEffect(() => {
    const mapped = resolveState(searchParams);
    setState(mapped);

    if (mapped === "success") {
      setOpenSuccess(true);
      setTimeout(() => {
        router.replace(APP_ROUTES.HOME);
      }, 3000);
    }
  }, [searchParams, router]);

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
          onChange={setOpenSuccess}
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
