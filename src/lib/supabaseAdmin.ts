import { createClient } from "@supabase/supabase-js";
import config from "@/config";

const supabaseAdmin = createClient(config.supabaseUrl, config.adminSupabaseKey);

export default supabaseAdmin;
