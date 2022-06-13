import { getStaff } from "@/services/anilist";
import { StaffSort } from "@/types/anilist";
import { useQuery } from "react-query";

const useBirthdayVA = () => {
  return useQuery(
    ["voice-actors birthday"],
    async () => {
      const data = await getStaff({
        isBirthday: true,
        perPage: 30,
        sort: [StaffSort.Favourites_desc],
      });

      return data;
    },
    {
      retry: 0,
    }
  );
};

export default useBirthdayVA;
