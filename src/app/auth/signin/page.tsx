import { Suspense } from "react";
import { SignIn } from "../components/SignIn";

export default function SignInPages() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
