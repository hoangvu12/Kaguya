import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import config from "@/config";

export async function middleware(req: NextRequest) {

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const supabase = createClient(
    config.supabaseUrl,
    config.supabaseKey,
    // @ts-ignore
    { fetch }
  );

  const { user, error: userError } = await supabase.auth.api.getUserByCookie(
    req
  );

  if (!user || userError) {
    return NextResponse.redirect("/");
  }

  const { data: syncUser, error: syncUserError } = await supabase
    .from("users")
    .select("auth_role")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (syncUserError) {
    return NextResponse.redirect("/");
  }

  if (syncUser.auth_role !== "admin") {
    return NextResponse.redirect("/");
  }

  return NextResponse.next();
}
