import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { provider } = await req.json();
  if (!provider) return NextResponse.json({ error: "Provedor obrigatório" }, { status: 400 });

  await supabase
    .from("wearable_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);

  return NextResponse.json({ success: true });
}
