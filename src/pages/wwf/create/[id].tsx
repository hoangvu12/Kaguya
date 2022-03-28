import SourceEpisodeSelector from "@/components/features/anime/SourceEpisodeSelector";
import Button from "@/components/shared/Button";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import Select from "@/components/shared/Select";
import { REVALIDATE_TIME } from "@/constants";
import withAuthRedirect from "@/hocs/withAuthRedirect";
import useCreateRoom from "@/hooks/useCreateRoom";
import useDevice from "@/hooks/useDevice";
import supabase from "@/lib/supabase";
import { Anime, Episode } from "@/types";
import { convert, getTitle, sortMediaUnit } from "@/utils/data";
import classNames from "classnames";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
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

const visibilityModes: VisibilityOption[] = [
  {
    value: "public",
    label: "Công khai",
  },
  {
    value: "private",
    label: "Riêng tư",
  },
];

const CreateRoomPage: NextPage<CreateRoomPageProps> = ({ media }) => {
  const { isMobile } = useDevice();
  const [roomTitle, setRoomTitle] = useState("");
  const [visibility, setVisibility] = useState(visibilityModes[0].value);

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

  const mediaTitle = useMemo(() => getTitle(media), [media]);

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
      <Head
        title={`Tạo phòng ${mediaTitle} - Kaguya`}
        description={`Chọn các thiết lập như tên phòng, tập phim để xem ${mediaTitle} cùng với bạn bè tại Kaguya`}
        image={media.bannerImage || media.coverImage.extraLarge}
      />

      <h1 className="text-4xl font-semibold mb-8">Tạo phòng</h1>

      <div className="w-full flex flex-col md:flex-row gap-8 md:gap-0">
        <div className="md:w-1/3 bg-background-800 p-4 md:p-8 text-center md:text-left">
          <div className="w-[96px] mb-4 mx-auto md:mx-0">
            <PlainCard src={media.coverImage.extraLarge} />
          </div>

          <h3 className="font-semibold text-xl">{mediaTitle}</h3>

          <DotList className="mt-2">
            {media.genres.map((genre) => (
              <span key={genre}>{convert(genre, "genre")}</span>
            ))}
          </DotList>

          <p className="mt-4 line-clamp-6 text-gray-300">{media.description}</p>
        </div>
        <div className="flex flex-col justify-between md:w-2/3 bg-background-900 p-4 md:p-8 space-y-4">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                containerInputClassName="border border-white/80 p-2"
                LeftIcon={MdOutlineTitle}
                onChange={handleInputChange}
                defaultValue={roomTitle}
                placeholder="Tên phòng"
                label="Tên phòng (không bắt buộc)"
                containerClassName="w-full md:w-1/3"
              />

              <div className="space-y-2">
                <p className="font-semibold">Hiển thị</p>

                <Select
                  options={visibilityModes}
                  placeholder="Chọn chế độ"
                  value={visibilityModes.find(
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
                    Chỉ những người có link mới có thể truy cập phòng này
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-hidden">
              <SourceEpisodeSelector
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
            <p>Tạo phòng</p>
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
        sourceConnections:kaguya_anime_source!mediaId(*, episodes:kaguya_episodes(*, source:kaguya_sources(id, name)))
    `
    )
    .eq("id", Number(params.id))
    .single();

  if (error) {
    console.log(error);

    return { notFound: true };
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
