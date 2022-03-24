import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { VoiceActor } from "@/types";
import { useSupabaseQuery } from "@/utils/supabase";

const useBirthdayVA = () => {
  const day = dayjs();

  return useSupabaseQuery(
    ["voice-actors birthday"],
    () => {
      return (
        supabase
          .from<VoiceActor>("kaguya_voice_actors")
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

export default useBirthdayVA;
