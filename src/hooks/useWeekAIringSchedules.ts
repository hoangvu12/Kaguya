import { getAllAiringSchedules } from "@/services/anilist";
import { AiringSchedule, AiringScheduleArgs, PageArgs } from "@/types/anilist";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useQuery, UseQueryOptions } from "react-query";

const useWeekAiringSchedules = (
  args?: AiringScheduleArgs & PageArgs,
  options?: Omit<
    UseQueryOptions<AiringSchedule[], AxiosError, AiringSchedule[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<AiringSchedule[]>(
    ["weekAiringSchedule", { args }],
    () => {
      const firstDayOfWeek = dayjs().startOf("week").unix();
      const lastDayOfWeek = dayjs().endOf("week").unix();

      return getAllAiringSchedules({
        airingAt_greater: firstDayOfWeek,
        airingAt_lesser: lastDayOfWeek,
        perPage: 50,
        notYetAired: true,
        ...args,
      });
    },
    options
  );
};

export default useWeekAiringSchedules;
