import { useUser } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface CreateRoomBody {
  mediaId: number;
  episodeId: string;
  title?: string;
  visibility: "public" | "private";
}

const useCreateRoom = () => {
  const user = useUser();
  const router = useRouter();

  return useMutation<Room, PostgrestError, CreateRoomBody, any>(
    async (body) => {
      const { data, error } = await supabase
        .from<Room>("kaguya_rooms")
        .insert({
          hostUserId: user.id,
          mediaId: body.mediaId,
          episodeId: body.episodeId,
          visibility: body.visibility,
          title: body.title || null,
        })
        .single();

      if (error) throw error;

      return data;
    },
    {
      onSuccess: (room) => {
        router.replace(`/wwf/${room.id}`);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );
};

export default useCreateRoom;
