import { useEffect, useState } from "react";

interface OtpData {
  email: string;
  expiresAt: number;
  blockUntil: number;
}

const STORAGE_KEY = "otpData";

export const useOtpStorage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [otpRemaining, setOtpRemaining] = useState<number>(0);
  const [blockRemaining, setBlockRemaining] = useState<number>(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const { email, expiresAt, blockUntil }: OtpData = JSON.parse(raw);
      const now = Date.now();
      const otpTimeLeft = Math.floor((expiresAt - now) / 1000);
      const blockTimeLeft = Math.floor((blockUntil - now) / 1000);

      if (otpTimeLeft > 0 || blockTimeLeft > 0) {
        setEmail(email);
        setOtpRemaining(Math.max(otpTimeLeft, 0));
        setBlockRemaining(Math.max(blockTimeLeft, 0));
      } else {
        clearOtpData();
      }
    } catch {
      clearOtpData();
    }
  }, []);

  const saveOtpData = (
    email: string,
    expiresIn: number,
    blockInSeconds: number,
  ) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    const blockUntil = Date.now() + blockInSeconds * 1000;
    const data: OtpData = { email, expiresAt, blockUntil };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setEmail(email);
    setOtpRemaining(expiresIn);
    setBlockRemaining(blockInSeconds);
  };

  const clearOtpData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmail(null);
    setOtpRemaining(0);
    setBlockRemaining(0);
  };

  return {
    email,
    otpRemaining,
    blockRemaining,
    saveOtpData,
    clearOtpData,
  };
};
