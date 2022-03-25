import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useRooms = () => {
  const queryClient = useQueryClient();

  return useSupabaseQuery(
    "rooms",
    () =>
      supabase
        .from<Room>("kaguya_rooms")
        .select(
          "*, media:mediaId(*), episode:episodeId(*), users:kaguya_room_users(id), hostUser:hostUserId(*)"
        ),
    {
      onSuccess: (rooms) => {
        rooms.forEach((room) => {
          queryClient.setQueryData(["room", room.id], room);
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useRooms;
