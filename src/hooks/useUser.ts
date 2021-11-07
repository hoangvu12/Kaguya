import supabase from "@/lib/supabase";
import { User } from "@supabase/gotrue-js";
import { useEffect, useState } from "react";

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
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        console.log("signed out");

        setUser(null);
      } else if (event === "SIGNED_IN") {
        setUser(supabase.auth.user());
      }
    });

    return data.unsubscribe;
  }, []);

  return user;
};

export default useUser;
