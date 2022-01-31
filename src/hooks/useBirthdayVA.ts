import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { useSupabaseQuery } from "@/utils/supabase";

const useBirthdayVA = () => {
  const day = dayjs();

  return useSupabaseQuery(
    ["voice-actors birthday"],
    () => {
      return supabase
        .from("voice_actors")
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

export default useBirthdayVA;
