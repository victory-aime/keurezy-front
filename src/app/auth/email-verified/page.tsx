import { Suspense } from "react";
import { EmailVerified } from "../components/EmailVerified";

export default function EmailVerificationPage() {
  return (
    <Suspense>
      <EmailVerified />
    </Suspense>
  );
}
