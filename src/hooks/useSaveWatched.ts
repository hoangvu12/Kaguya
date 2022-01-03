import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  anime_id: number;
  episode_id: number;
  watched_time?: number;
}

const useSaveWatched = () => {
  return useMutation((data: MutationInput) => {
    return axios.post(`/api/watched`, data);
  });
};

export default useSaveWatched;
