import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "react-query";

const useCreateSubscription = () => {
  const { user } = useUser();

  return useMutation<any, PostgrestError, PushSubscription, any>(
    async (subscription) => {
      const userAgent = navigator.userAgent;

      const { data, error } = await supabase
        .from("kaguya_subscriptions")
        .upsert({
          subscription,
          userId: user.id,
          userAgent: encodeURIComponent(userAgent),
        });

      if (error) throw error;

      return data;
    }
  );
};

export default useCreateSubscription;
