import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { getMedia } from "@/services/anilist";
import { Room } from "@/types";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const useRooms = () => {
  return useQuery(
    "rooms",
    async () => {
      const { data, error } = await supabase
        .from<Room>("kaguya_rooms")
        .select(
          `
        *,
        episode:episodeId(*),
        users:kaguya_room_users(id),
        hostUser:hostUserId(*)
      `
        )
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const anilistMedia = await getMedia({
        id_in: data.map((room) => room.mediaId),
      });

      return data.map((room) => {
        const media = anilistMedia.find((media) => media.id === room.mediaId);

        return {
          ...room,
          media,
        };
      });
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );
};

export default useRooms;
