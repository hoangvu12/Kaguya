import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { toast } from "react-toastify";

const useRooms = () => {
  return useSupabaseQuery(
    "rooms",
    () =>
      supabase
        .from<Room>("kaguya_rooms")
        .select(
          `
          *,
          media:mediaId(*),
          episode:episodeId(*),
          users:kaguya_room_users(id),
          hostUser:hostUserId(*)
        `
        )
        .eq("visibility", "public"),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useRooms;
