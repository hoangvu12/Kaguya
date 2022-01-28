import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { useSupabaseQuery } from "@/utils/supabase";

const useBirthdayCharacters = () => {
  const day = dayjs();

  return useSupabaseQuery(
    ["characters birthday"],
    () => {
      return supabase
        .from("all_characters")
        .select("*")
        .eq("dateOfBirth->day", day.date())
        .eq("dateOfBirth->month", day.month() + 1)
        .limit(30)
        .order("favourites", { ascending: false });
    },
    {
      retry: 0,
    }
  );
};

export default useBirthdayCharacters;
