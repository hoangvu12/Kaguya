import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import Button from "@/components/shared/Button";
import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import Select from "@/components/shared/Select";
import { REVALIDATE_TIME } from "@/constants";
import withAuthRedirect from "@/hocs/withAuthRedirect";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import useCreateRoom from "@/hooks/useCreateRoom";
import useDevice from "@/hooks/useDevice";
import supabase from "@/lib/supabase";
import { Anime, Episode } from "@/types";
import { convert, getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { MdOutlineTitle } from "react-icons/md";

interface CreateRoomPageProps {
  media: Anime;
}

type Visibility = "public" | "private";
type VisibilityOption = {
  label: string;
  value: Visibility;
};

const CreateRoomPage: NextPage<CreateRoomPageProps> = ({ media }) => {
  const { isMobile } = useDevice();
  const [roomTitle, setRoomTitle] = useState("");
  const { VISIBILITY_MODES } = useConstantTranslation();
  const [visibility, setVisibility] = useState(
    VISIBILITY_MODES[0].value as "public" | "private"
  );
  const { locale } = useRouter();
  const { t } = useTranslation("wwf");

  const { mutate, isLoading } = useCreateRoom();

  const episodes = useMemo(
    () =>
      media.sourceConnections.flatMap((connection) =>
        connection.episodes.map((episode) => ({
          ...episode,
          sourceConnection: connection,
        }))
      ),
    [media.sourceConnections]
  );

  const sortedEpisodes = useMemo(() => sortMediaUnit(episodes), [episodes]);

  const [chosenEpisode, setChosenEpisode] = useState<Episode>(
    sortedEpisodes[0]
  );

  const mediaTitle = useMemo(() => getTitle(media, locale), [media, locale]);
  const mediaDescription = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoomTitle(event.target.value);
    },
    []
  );

  const handleCreateRoom = useCallback(() => {
    mutate({
      episodeId: `${chosenEpisode.sourceId}-${chosenEpisode.sourceEpisodeId}`,
      mediaId: media.id,
      visibility,
      title: roomTitle,
    });
  }, [
    chosenEpisode.sourceEpisodeId,
    chosenEpisode.sourceId,
    media.id,
    mutate,
    visibility,
    roomTitle,
  ]);

  return (
    <Section className="py-20">
      <Head title={t("create_page_title", { mediaTitle })} />

      <h1 className="text-4xl font-semibold mb-8">{t("create_room")}</h1>

      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-0">
        <div className="md:w-1/3 bg-background-800 p-4 md:p-8 text-center md:text-left">
          <div className="w-[96px] mb-4 mx-auto md:mx-0">
            <PlainCard src={media.coverImage.extraLarge} />
          </div>

          <h3 className="font-semibold text-xl">{mediaTitle}</h3>

          <DotList className="mt-2">
            {media.genres.map((genre) => (
              <span key={genre}>{convert(genre, "genre", { locale })}</span>
            ))}
          </DotList>

          <Description
            description={mediaDescription || t("common:updating") + "..."}
            className="mt-4 line-clamp-6 text-gray-300"
          />
        </div>
        <div className="flex flex-col justify-between md:w-2/3 bg-background-900 p-4 md:p-8 space-y-4">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                containerInputClassName="border border-white/80 p-2"
                LeftIcon={MdOutlineTitle}
                onChange={handleInputChange}
                defaultValue={roomTitle}
                placeholder={t("room_name")}
                label={`${t("room_name")} (${t("common:optional")})`}
                containerClassName="w-full md:w-1/3"
              />

              <div className="space-y-2">
                <p className="font-semibold">{t("room_visibility")}</p>

                <Select
                  options={VISIBILITY_MODES}
                  placeholder={t("pick_visibility_mode")}
                  value={VISIBILITY_MODES.find(
                    (mode) => mode.value === visibility
                  )}
                  onChange={(newValue: VisibilityOption) =>
                    setVisibility(newValue.value)
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#1a1a1a",
                      ...(!isMobile && {
                        minWidth: "12rem",
                        maxWidth: "14rem",
                      }),
                    }),
                  }}
                />

                {visibility === "private" && (
                  <p className="italic text-sm text-gray-400">
                    {t("private_visibility_note")}
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-hidden">
              <LocaleEpisodeSelector
                episodes={sortedEpisodes}
                activeEpisode={chosenEpisode}
                onEachEpisode={(episode) => (
                  <button
                    key={episode.sourceEpisodeId}
                    className={classNames(
                      "rounded-md bg-background-800 col-span-1 aspect-w-2 aspect-h-1 group",
                      episode.sourceEpisodeId ===
                        chosenEpisode?.sourceEpisodeId && "text-primary-300"
                    )}
                    onClick={() => setChosenEpisode(episode)}
                  >
                    <div className="flex items-center justify-center w-full h-full group-hover:bg-white/10 rounded-md transition duration-300">
                      <p>{episode.name}</p>
                    </div>
                  </button>
                )}
              />
            </div>
          </div>

          <Button
            isLoading={isLoading}
            className="mx-auto md:ml-auto md:mr-0"
            primary
            onClick={handleCreateRoom}
          >
            <p>{t("create_room")}</p>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("kaguya_anime")
    .select(
      `
        id,
        vietnameseTitle,
        title,
        genres,
        description,
        coverImage,
        sourceConnections:kaguya_anime_source!mediaId(*, episodes:kaguya_episodes(*, source:kaguya_sources(id, name, locales)))
    `
    )
    .eq("id", Number(params.id))
    .single();

  if (error) {
    console.log(error);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }

  return {
    props: {
      media: data as Anime,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Anime>("kaguya_anime")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(20);

  const paths = data.map((anime: Anime) => ({
    params: { id: anime.id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default withAuthRedirect(CreateRoomPage, { url: "/login" });
