import { withMiddlewareAuth } from "@supabase/auth-helpers-nextjs/dist/middleware";

export const middleware = withMiddlewareAuth({ redirectTo: "/login" });
