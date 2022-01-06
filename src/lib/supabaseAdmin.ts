import { createClient } from "@supabase/supabase-js";
import config from "@/config";

const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.adminSupabaseKey,
  // @ts-ignore
  { fetch }
);

export default supabaseAdmin;
