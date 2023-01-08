import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";
import { AdditionalUser } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUpdateProfile = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError, Partial<AdditionalUser>>(
    async (updateData) => {
      // Check if username is available
      const { data } = await supabaseClient
        .from("users")
        .select("id")
        .eq("username", updateData.username)
        .single();

      if (data && data.id !== user.id) {
        throw new Error("Username is already taken.");
      }

      const { error } = await supabaseClient
        .from("users")
        .update(updateData, { returning: "minimal" })
        .match({ id: user.id });

      if (error) throw error;

      return null;
    },
    {
      onMutate: (updateData) => {
        queryClient.setQueryData<AdditionalUser>(
          ["user-profile", user.id],

          (old) => {
            return {
              ...old,
              ...updateData,
            };
          }
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Profile updated successfully");

        queryClient.invalidateQueries(["user-profile", user.id]);
      },
    }
  );
};

export default useUpdateProfile;
