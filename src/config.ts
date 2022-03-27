const config = {
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  adminSupabaseKey: process.env.ADMIN_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  nodeServerUrl: process.env.NEXT_PUBLIC_NODE_SERVER_URL,
  proxyServerUrl: process.env.NEXT_PUBLIC_PROXY_SERVER_URL,
  socketServerUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  webPushPublicKey: process.env.NEXT_PUBLIC_WEB_PUSH,
};

export default config;
