import { useUser } from "@/contexts/AuthContext";
import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  manga_id: number;
  chapter_id: number;
}

const useSaveRead = () => {
  const user = useUser();

  return useMutation((data: MutationInput) => {
    if (!user) return;

    return axios.post(`/api/manga/read`, data);
  });
};

export default useSaveRead;
