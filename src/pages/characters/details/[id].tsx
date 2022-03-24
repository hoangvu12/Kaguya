import VACard from "@/components/features/va/VACard";
import Card from "@/components/shared/Card";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import { REVALIDATE_TIME } from "@/constants";
import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import {
  Anime,
  Character,
  CharacterConnection,
  Manga,
  VoiceActor,
  VoiceActorConnection,
} from "@/types";
import { isFalsy, numberWithCommas } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BiCake } from "react-icons/bi";

const genders = {
  male: "Nam",
  female: "Nữ",
};

const KeyValue: React.FC<{ property: string; value: string }> = ({
  property,
  value,
}) => (
  <div>
    <b>{property}: </b>

    <span>{value || "Không rõ"}</span>
  </div>
);

interface AdvancedCharacter extends Character {
  mangaConnections: CharacterConnection<Manga>[];
  animeConnections: CharacterConnection<Anime>[];
  voiceActorConnections: VoiceActorConnection[];
}

interface DetailsPageProps {
  character: AdvancedCharacter;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ character }) => {
  const gender = useMemo(
    () => genders[character.gender?.toLowerCase()] || character.gender,
    [character.gender]
  );

  const birthday = useMemo(() => {
    const dateOfBirth = character.dateOfBirth;
    let date = dayjs();
    let format = [];

    if (Object.keys(dateOfBirth).every((key) => !dateOfBirth[key])) {
      return null;
    }

    if (!isFalsy(dateOfBirth.day)) {
      date = date.date(dateOfBirth.day);
      format.push("DD");
    }

    if (!isFalsy(dateOfBirth.month)) {
      date = date.month(dateOfBirth.month - 1);
      format.push("MM");
    }

    if (!isFalsy(dateOfBirth.year)) {
      date = date.year(dateOfBirth.year);
      format.push("YYYY");
    }

    return date.format(format.join("/"));
  }, [character.dateOfBirth]);

  const isBirthday = useMemo(() => {
    const date = dayjs();
    const birthday = character.dateOfBirth;

    return date.date() === birthday.day && date.month() === birthday.month - 1;
  }, [character.dateOfBirth]);

  return (
    <>
      <Head
        title={`${character.name.userPreferred} - Kaguya`}
        image={character.image.large}
      />

      <div className="pb-8">
        <div className="w-full h-[200px] bg-background"></div>

        <div className="relative px-4 sm:px-12 z-10 bg-background-900 pb-4 mb-8">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20 space-y-6">
              <PlainCard
                src={character.image.large}
                alt={character.name.userPreferred}
              />
            </div>

            <div className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start py-4 mt-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-3xl font-semibold">
                  {character.name.userPreferred}
                </h1>

                <TextIcon
                  iconClassName="text-primary-500"
                  LeftIcon={AiFillHeart}
                >
                  <p>{numberWithCommas(character.favourites)}</p>
                </TextIcon>

                {isBirthday && (
                  <TextIcon iconClassName="text-primary-300" LeftIcon={BiCake}>
                    <p>Sinh nhật</p>
                  </TextIcon>
                )}
              </div>

              <div className="space-y-4">
                <KeyValue property="Giới tính" value={gender} />
                <KeyValue property="Ngày sinh" value={birthday} />
                <KeyValue property="Tuổi" value={character.age} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-12 space-y-8">
          {!!character.voiceActorConnections?.length && (
            <DetailsSection title="Seiyuu">
              <List
                data={character.voiceActorConnections.map(
                  (connection) => connection.voiceActor
                )}
              >
                {(voiceActor) => <VACard voiceActor={voiceActor} />}
              </List>
            </DetailsSection>
          )}

          {!!character.animeConnections?.length && (
            <DetailsSection title="Anime">
              <List
                data={character.animeConnections.map(
                  (connection) => connection.media
                )}
              >
                {(anime) => <Card type="anime" data={anime} />}
              </List>
            </DetailsSection>
          )}

          {!!character.mangaConnections?.length && (
            <DetailsSection title="Manga">
              <List
                data={character.mangaConnections.map(
                  (connection) => connection.media
                )}
              >
                {(manga) => <Card type="manga" data={manga} />}
              </List>
            </DetailsSection>
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("kaguya_characters")
    .select(
      `
        *,
        voiceActorConnections:kaguya_voice_actor_connections(voiceActor:voiceActorId(*), character:characterId(*)),
        mangaConnections:kaguya_manga_characters!characterId(media:mediaId(*)),
        animeConnections:kaguya_anime_characters!characterId(media:mediaId(*))
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
      character: data as AdvancedCharacter,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<Character>("kaguya_characters")
    .select("id")
    .order("favourites", { ascending: false })
    .limit(5);

  const paths = data.map((manga) => ({
    params: { id: manga.id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;
