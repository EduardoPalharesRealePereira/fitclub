import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JoinClient from "./JoinClient";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code) redirect("/");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: competition } = await supabase
    .from("competitions")
    .select("id, name, description, start_date, end_date, photo_url, invite_code")
    .eq("invite_code", code.toUpperCase())
    .maybeSingle();

  if (!competition) redirect("/");

  const { count } = await supabase
    .from("competition_members")
    .select("*", { count: "exact", head: true })
    .eq("competition_id", competition.id);

  // Check if user is already a member
  let alreadyMember = false;
  if (user) {
    const { data: membership } = await supabase
      .from("competition_members")
      .select("id")
      .eq("competition_id", competition.id)
      .eq("user_id", user.id)
      .maybeSingle();
    alreadyMember = !!membership;
  }

  return (
    <JoinClient
      competition={competition as {
        id: string; name: string; description: string;
        start_date: string; end_date: string;
        photo_url: string | null; invite_code: string;
      }}
      memberCount={count || 0}
      userId={user?.id || null}
      userEmail={user?.email || null}
      alreadyMember={alreadyMember}
    />
  );
}
