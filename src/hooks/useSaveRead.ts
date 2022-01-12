import axios from "axios";
import { useMutation } from "react-query";

interface MutationInput {
  manga_id: number;
  chapter_id: number;
}

const useSaveRead = () => {
  return useMutation((data: MutationInput) => {
    return axios.post(`/api/manga/read`, data);
  });
};

export default useSaveRead;
