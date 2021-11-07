import supabase from "@/lib/supabase";
import { User } from "@supabase/gotrue-js";
import { useEffect, useState } from "react";
import nookies from "nookies";

const useUser = () => {
  const [user, setUser] = useState<User>(supabase.auth.user());

  useEffect(() => {
    const currentDate = new Date();
    const session = supabase.auth.session();

    if (!session) {
      setUser(null);

      return;
    }

    if (currentDate.getMilliseconds() >= session.expires_at) {
      setUser(null);
    }

    setUser(supabase.auth.user());
  }, []);

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

      setUser(user);

      nookies.destroy(null, "sb:token");
      nookies.set(null, "sb:token", token, { path: "/" });
    });

    return data.unsubscribe;
  }, []);

  return user;
};

export default useUser;
