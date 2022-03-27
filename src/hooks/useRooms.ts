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
        .eq("visibility", "public")
        .order("created_at", { ascending: false }),
    {
      onError: (error) => {
        toast.error(error.message);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );
};

export default useRooms;
