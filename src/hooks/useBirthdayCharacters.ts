import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { Character } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";

const useBirthdayCharacters = () => {
  const day = dayjs();

  return useSupabaseQuery(
    ["characters birthday"],
    () => {
      return (
        supabase
          .from<Character>("kaguya_characters")
          .select("*")
          // @ts-ignore
          .eq("dateOfBirth->day", day.date())
          // @ts-ignore
          .eq("dateOfBirth->month", day.month() + 1)
          .limit(30)
          .order("favourites", { ascending: false })
      );
    },
    {
      retry: 0,
    }
  );
};

export default useBirthdayCharacters;
