import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";
import { Attachment, uploadFile } from "@/services/upload";
import { AdditionalUser } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation<Attachment[], PostgrestError, File>(
    async (file) => {
      if (!user.id) {
        throw new Error("User not found");
      }

      const uploadedData = await uploadFile(file);

      if (!uploadedData?.length) throw new Error("Upload failed");

      // I don't know why I didn't return the full URL, just use this until I decided to change it.
      const url =
        `https://cdn.discordapp.com/attachments/` + uploadedData[0].url;

      const { error } = await supabaseClient
        .from<AdditionalUser>("users")
        .update({ avatarUrl: url }, { returning: "minimal" })
        .match({ id: user.id });

      if (error) throw error;

      return uploadedData;
    },
    {
      onMutate: (file) => {
        const fileUrl = URL.createObjectURL(file);

        queryClient.setQueryData<AdditionalUser>(
          ["user-profile", user.id],

          (old) => {
            return {
              ...old,
              avatarUrl: fileUrl,
            };
          }
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Avatar updated successfully");

        queryClient.invalidateQueries(["user-profile", user.id]);
      },
    }
  );
};

export default useUpdateAvatar;
