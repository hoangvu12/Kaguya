import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Anime, Manga } from "@/types";
import { useQuery } from "react-query";

const useIsSavedSub = () => {
  const user = useUser();

  return useQuery(
    ["saved_subscription", user?.id],
    async () => {
      const userAgent = navigator.userAgent;

      if (!userAgent) throw new Error("No user agent");

      const { data, error } = await supabase
        .from("kaguya_subscriptions")
        .select("userId")
        .eq("userId", user.id)
        .eq("userAgent", encodeURIComponent(userAgent))
        .limit(1)
        .single();

      if (error) return false;

      return !!data;
    },
    { enabled: !!user }
  );
};

export default useIsSavedSub;
