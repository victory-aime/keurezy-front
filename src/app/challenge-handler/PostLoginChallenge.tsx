import { useEffect, useRef, useState } from "react";
import { useOtpStorage } from "_hooks/useOtpStorage";
import { AxiosError } from "axios";
import { FormikValues, FormikHelpers } from "formik";
import { OtpChallengeHandler } from "./OtpChallengeHandler";
import { useAuth } from "_hooks/useAuth";
import { StorageKey } from "_constants/StorageKeys";
import { CommonModule } from "_store/state-management";
import { MODELS } from "_types/index";
import { extractOtp } from "./utils/extractOtp";

export const PostLoginChallenge = ({
  onSuccess,
  user,
  manualTrigger = false,
}: {
  user?: MODELS.IUser;
  onSuccess?: () => Promise<void>;
  manualTrigger?: boolean;
}) => {
  const hasTriggeredRef = useRef(false);
  const [openModal, setOpenModal] = useState(false);
  const { logout } = useAuth();
  const {
    email,
    otpRemaining: expiresIn,
    blockRemaining,
    saveOtpData,
    clearOtpData,
  } = useOtpStorage();

  const shouldTriggerOtp =
    manualTrigger ||
    (typeof window !== "undefined" &&
      localStorage.getItem(StorageKey.OTP_REQUIRED) === "true");

  const { mutateAsync: generateOtp } =
    CommonModule.OtpModule.generateOtpMutation({
      mutationOptions: {
        onSuccess: (data) => {
          saveOtpData(data.email, data.expiresIn, 0);
          setOpenModal(true);
        },
        onError: (error: AxiosError | any) => {
          const data = error?.response?.data as
            | { message?: string; retryAfter?: string }
            | undefined;
          const retryAfter = Number(data?.retryAfter || 0);
          const targetEmail = email || user?.email || "";
          if (retryAfter && targetEmail) {
            saveOtpData(targetEmail, 0, retryAfter);
          }
        },
      },
    });

  const {
    mutateAsync: validateOtp,
    isPending,
    isSuccess,
  } = CommonModule.OtpModule.validateOtpMutation({
    mutationOptions: {
      onSuccess: async () => {
        setOpenModal(false);
        localStorage.removeItem(StorageKey.OTP_REQUIRED);
        clearOtpData();
        await onSuccess?.();
      },
    },
  });

  useEffect(() => {
    if (
      !hasTriggeredRef.current &&
      shouldTriggerOtp &&
      user?.email &&
      (manualTrigger || user?.enabled2FA)
    ) {
      hasTriggeredRef.current = true;
      generateOtp({ payload: user.email });
    }
  }, [shouldTriggerOtp, user, manualTrigger]);

  useEffect(() => {
    if (!user?.enabled2FA) {
      localStorage.removeItem(StorageKey.OTP_REQUIRED);
    }
  }, [user?.enabled2FA]);

  const handleValidateOtp = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => {
    try {
      await validateOtp({
        payload: {
          otp: extractOtp(values?.otpCode),
          email: email ?? "",
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const serverMessage = axiosError?.response?.data?.message ?? "";
      formikHelpers.setFieldError("otpCode", serverMessage);
    }
  };

  const handleRenewOtp = async () => {
    await generateOtp({ payload: email ?? "" });
  };

  const handleClose = async () => {
    setOpenModal(false);
    await logout();
    clearOtpData();
  };
  return (user?.enabled2FA || manualTrigger) && !isSuccess ? (
    <OtpChallengeHandler
      isOpen={openModal}
      otpType={"login"}
      onChange={handleClose}
      blockedTimeLeft={blockRemaining}
      data={{ expiresIn, user }}
      callback={handleValidateOtp}
      isLoading={isPending}
      renewOtpCallback={handleRenewOtp}
      closeButton={false}
    />
  ) : null;
};
