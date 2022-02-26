const isDev = process.env.NODE_ENV === "development";

const config = {
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  adminSupabaseKey: process.env.ADMIN_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  nodeServerUrl: isDev
    ? "http://localhost:3000/kaguya"
    : process.env.NODE_SERVER_URL,
  webPushPublicKey: process.env.NEXT_PUBLIC_WEB_PUSH,
};

export default config;
