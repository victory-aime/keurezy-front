import { AuthContextProvider } from "_context/auth-context";
import { UserLayout } from "./layout/Layout";

export default function PublicPage() {
  return (
    <AuthContextProvider>
      <UserLayout />
    </AuthContextProvider>
  );
}
