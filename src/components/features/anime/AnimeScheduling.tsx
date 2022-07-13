import Card from "@/components/shared/Card";
import CardSwiper from "@/components/shared/CardSwiper";
import DotList from "@/components/shared/DotList";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
import { AiringSchedule } from "@/types/anilist";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface AnimeSchedulingProps {
  schedules: AiringSchedule[];
}

const AnimeScheduling: React.FC<AnimeSchedulingProps> = ({ schedules }) => {
  const { t } = useTranslation("anime_home");
  const { DAYSOFWEEK } = useConstantTranslation();

  const today = dayjs();
  const todayIndex = today.day();

  const chunks = useMemo(
    () =>
      schedules.reduce((acc, cur) => {
        const day = dayjs.unix(cur.airingAt);

        const dayIndex = day.day();
        const dayName = DAYSOFWEEK[dayIndex];

        if (!(dayName in acc)) {
          acc[dayName] = [];
        }

        acc[dayName].push(cur);

        return acc;
      }, {}),
    [DAYSOFWEEK, schedules]
  );

  return (
    <Tabs defaultIndex={todayIndex} selectedTabClassName="bg-white !text-black">
      <TabList className="w-5/6 mx-auto flex items-center justify-center flex-wrap gap-x-4 lg:gap-x-8">
        {DAYSOFWEEK.map((day, index) => {
          const isToday = todayIndex === index;

          return (
            <Tab
              key={day}
              className={classNames(
                "px-3 py-2 rounded-[18px] cursor-pointer hover:bg-white hover:text-black transition duration-300",
                isToday && "text-primary-400"
              )}
            >
              {day}
            </Tab>
          );
        })}
      </TabList>

      <div className="mt-20">
        {DAYSOFWEEK.map((day) => {
          const hasSchedules = day in chunks;
          const schedules: AiringSchedule[] = chunks[day];

          return (
            <TabPanel key={day}>
              {!hasSchedules ? (
                <p className="text-2xl text-center">Không có...</p>
              ) : (
                <CardSwiper
                  data={schedules.map(
                    (schedule: AiringSchedule) => schedule.media
                  )}
                  onEachCard={(card) => {
                    const cardWithSchedule = schedules.find(
                      (schedule) => schedule.media.id === card.id
                    );

                    const isReleased = dayjs
                      .unix(cardWithSchedule.airingAt)
                      .isBefore(dayjs());

                    return (
                      <Card
                        data={card}
                        imageEndSlot={
                          <React.Fragment>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                            <DotList className="p-2 absolute bottom-0 w-full">
                              <span>
                                {t("common:episode")} {cardWithSchedule.episode}
                              </span>
                              <span>
                                {!isReleased
                                  ? dayjs
                                      .unix(cardWithSchedule.airingAt)
                                      .format("HH:mm")
                                  : t("airing_schedule_passed")}
                              </span>
                            </DotList>
                          </React.Fragment>
                        }
                      />
                    );
                  }}
                />
              )}
            </TabPanel>
          );
        })}
      </div>
    </Tabs>
  );
};

export default AnimeScheduling;
