import { ForgetPassword } from "../../components/ForgetPassword";

export default async function ForgetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <ForgetPassword token={params?.token!} />;
}
