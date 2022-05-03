import CharacterCard from "@/components/shared/CharacterCard";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import TextIcon from "@/components/shared/TextIcon";
import { REVALIDATE_TIME } from "@/constants";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
import supabase from "@/lib/supabase";
import { Character, VoiceActor } from "@/types";
import { arePropertiesFalsy, formatDate, numberWithCommas } from "@/utils";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BiCake } from "react-icons/bi";

const KeyValue: React.FC<{ property: string; value: string }> = ({
  property,
  value,
}) => (
  <div>
    <b>{property}: </b>

    <span>{value || "Không rõ"}</span>
  </div>
);

interface VoiceActorWithCharacters extends VoiceActor {
  characters: { character: Character }[];
}

interface DetailsPageProps {
  voiceActor: VoiceActorWithCharacters;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ voiceActor }) => {
  const { t } = useTranslation("voice_actor_details");
  const { GENDERS } = useConstantTranslation();

  const gender = useMemo(
    () => GENDERS[voiceActor.gender?.toLowerCase()] || voiceActor.gender,
    [GENDERS, voiceActor.gender]
  );

  const birthday = useMemo(() => {
    const dateOfBirth = voiceActor.dateOfBirth;

    if (arePropertiesFalsy(dateOfBirth)) {
      return null;
    }

    return formatDate(dateOfBirth);
  }, [voiceActor.dateOfBirth]);

  const yearsActive = useMemo(() => {
    const yearsActive = voiceActor.yearsActive;

    if (!yearsActive?.length) return null;

    if (!yearsActive[1]) return `${yearsActive[0]} - ${t("common:present")}`;

    return `${yearsActive[0]} - ${yearsActive[1]}`;
  }, [t, voiceActor.yearsActive]);

  const isDead = useMemo(
    () => !arePropertiesFalsy(voiceActor.dateOfDeath),
    [voiceActor.dateOfDeath]
  );

  const isBirthday = useMemo(() => {
    const date = dayjs();
    const birthday = voiceActor.dateOfBirth;

    return date.date() === birthday.day && date.month() === birthday.month - 1;
  }, [voiceActor.dateOfBirth]);

  return (
    <>
      <Head
        title={`${voiceActor.name.userPreferred} - Kaguya`}
        image={voiceActor.image.large}
      />

      <div className="pb-8">
        <div className="w-full h-[200px] bg-background"></div>

        <div className="relative px-4 sm:px-12 z-10 bg-background-900 pb-4 mb-8">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 w-[186px] -mt-20 space-y-6">
              <PlainCard
                src={voiceActor.image.large}
                alt={voiceActor.name.userPreferred}
              />
            </div>

            <div className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start py-4 md:-mt-[5.5rem]">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-3xl font-semibold">
                    {voiceActor.name.userPreferred}
                  </h1>
                  <TextIcon
                    iconClassName="text-primary-500"
                    LeftIcon={AiFillHeart}
                  >
                    <p>{numberWithCommas(voiceActor.favourites)}</p>
                  </TextIcon>
                  {isBirthday && (
                    <TextIcon
                      iconClassName="text-primary-300"
                      LeftIcon={BiCake}
                    >
                      <p>{t("is_today_birthday")}</p>
                    </TextIcon>
                  )}
                </div>
                <p className="text-gray-300">{voiceActor.name.native}</p>
              </div>

              <div className="space-y-2">
                <KeyValue property={t("gender")} value={gender} />
                <KeyValue property={t("birthday")} value={birthday} />
                {isDead && (
                  <KeyValue
                    property={t("deathday")}
                    value={formatDate(voiceActor.dateOfDeath)}
                  />
                )}
                <KeyValue
                  property={t("age")}
                  value={voiceActor.age?.toString()}
                />
                <KeyValue property={t("years_active")} value={yearsActive} />
                <KeyValue
                  property={t("blood_type")}
                  value={voiceActor.bloodType}
                />
                <KeyValue
                  property={t("hometown")}
                  value={voiceActor.homeTown}
                />
              </div>
            </div>
          </div>
        </div>

        <Section title={t("characters_section")}>
          <List data={voiceActor.characters.map(({ character }) => character)}>
            {(character) => <CharacterCard character={character} />}
          </List>
        </Section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data, error } = await supabase
    .from("kaguya_voice_actors")
    .select(
      `
        *,
        characters:kaguya_voice_actor_connections(character:characterId(id, name, image))
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
      voiceActor: data as VoiceActor,
    },
    revalidate: REVALIDATE_TIME,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from<VoiceActor>("kaguya_voice_actors")
    .select("id")
    .order("favourites", { ascending: false })
    .limit(5);

  const paths = data.map((manga) => ({
    params: { id: manga.id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default DetailsPage;
