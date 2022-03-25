import supabase from "@/lib/supabase";
import { Room } from "@/types";
import { useSupabaseSingleQuery } from "@/utils/supabase";
import { useMemo } from "react";
import { toast } from "react-toastify";

const useRoom = (roomId: number) => {
  const queryKey = useMemo(() => ["room", roomId], [roomId]);

  return useSupabaseSingleQuery(
    queryKey,
    () =>
      supabase
        .from<Room>("kaguya_rooms")
        .select(
          "*, media:mediaId(*), episode:episodeId(*), users:kaguya_room_users(id), hostUser:hostUserId(*)"
        )
        .eq("id", roomId)
        .limit(1)
        .single(),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export default useRoom;
