import { useUser } from "@/contexts/AuthContext";
import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  media_id: number;
  episode_id: string;
  watched_time?: number;
}

const useSaveWatched = () => {
  const user = useUser();

  return useMutation((data: MutationInput) => {
    if (!user) return;

    return axios.post(`/api/anime/watched`, data);
  });
};

export default useSaveWatched;
