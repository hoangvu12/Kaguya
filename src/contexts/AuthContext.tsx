import { default as supabase, default as supabaseClient } from "@/lib/supabase";
import { AdditionalUser } from "@/types";
import nookies from "nookies";
import React, { useEffect, useState } from "react";

const AuthContext = React.createContext<AdditionalUser>(null);

const accessTokenCookieName = "sb-access-token";
const refreshTokenCookieName = "sb-refresh-token";

export const AuthContextProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = useState<AdditionalUser>(null);

  // Check if user session is invalid
  useEffect(() => {
    const currentDate = new Date();
    const session = supabase.auth.session();

    if (!session || currentDate.getMilliseconds() >= session.expires_at) {
      setUser(null);

      nookies.destroy(null, accessTokenCookieName);
      nookies.destroy(null, refreshTokenCookieName);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      const user = supabase.auth.user();

      if (!user) return;

      const { data: profileUser } = await supabaseClient
        .from<AdditionalUser>("users")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(profileUser);
    };

    getData();
  }, []);

  // Set cookies on auth state change
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = supabase.auth.user();

      if (!session) {
        setUser(null);

        nookies.destroy(null, accessTokenCookieName);
        nookies.destroy(null, refreshTokenCookieName);

        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN") {
        const { data: profileUser } = await supabaseClient
          .from<AdditionalUser>("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser(profileUser);
      }

      const token = session.access_token;
      const refreshToken = session.refresh_token;

      nookies.destroy(null, accessTokenCookieName);
      nookies.set(null, accessTokenCookieName, token, {
        path: "/",
        maxAge: 604800,
      });

      nookies.destroy(null, refreshTokenCookieName);
      nookies.set(null, refreshTokenCookieName, refreshToken, {
        path: "/",
        maxAge: 604800,
      });
    });

    return data.unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;
