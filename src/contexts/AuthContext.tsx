import supabase from "@/lib/supabase";
import { User } from "@supabase/gotrue-js";
import React, { useEffect, useState } from "react";
import nookies from "nookies";

const AuthContext = React.createContext(supabase.auth.user());

export const AuthContextProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = useState<User>(supabase.auth.user());

  // Check if user session is invalid
  useEffect(() => {
    const currentDate = new Date();
    const session = supabase.auth.session();

    if (!session || currentDate.getMilliseconds() >= session.expires_at) {
      setUser(null);

      nookies.destroy(null, "sb:token");
    }
  }, []);

  // Set cookies on auth state change
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const user = supabase.auth.user();

      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN") {
        setUser(user);
      }

      if (!session) {
        setUser(null);

        nookies.destroy(null, "sb:token");

        return;
      }

      const token = session.access_token;

      nookies.destroy(null, "sb:token");
      nookies.set(null, "sb:token", token, { path: "/", maxAge: 604800 });
    });

    return data.unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;
