import { getCharacters } from "@/services/anilist";
import { CharacterSort } from "@/types/anilist";
import { useQuery } from "react-query";

const useBirthdayCharacters = () => {
  return useQuery(["characters birthday"], async () => {
    const data = await getCharacters({
      isBirthday: true,
      perPage: 30,
      sort: [CharacterSort.Favourites_desc],
    });

    return data;
  });
};

export default useBirthdayCharacters;
