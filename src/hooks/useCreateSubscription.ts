import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "react-query";

const useCreateSubscription = () => {
  const user = useUser();

  return useMutation<any, PostgrestError, PushSubscription, any>(
    async (subscription) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .upsert({ subscription, user_id: user.id });

      if (error) throw error;

      return data;
    }
  );
};

export default useCreateSubscription;
