import { AcceptInvitation } from "_component/AcceptInvitation";

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const value = await searchParams;
  return <AcceptInvitation params={value.token} />;
}
