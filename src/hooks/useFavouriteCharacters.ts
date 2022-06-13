import { getCharacters } from "@/services/anilist";
import { CharacterSort } from "@/types/anilist";
import { useQuery } from "react-query";

const useFavouriteCharacters = () => {
  return useQuery(
    ["characters favourites"],
    async () => {
      const data = await getCharacters({
        perPage: 30,
        sort: [CharacterSort.Favourites_desc],
      });

      return data;
    },
    {
      retry: 0,
    }
  );
};

export default useFavouriteCharacters;
