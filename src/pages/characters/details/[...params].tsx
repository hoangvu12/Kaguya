import VACard from "@/components/features/va/VACard";
import Card from "@/components/shared/Card";
import DetailsSection from "@/components/shared/DetailsSection";
import Head from "@/components/shared/Head";
import List from "@/components/shared/List";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import TextIcon from "@/components/shared/TextIcon";
import { REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
import { getCharacterDetails } from "@/services/anilist";
import { Character, MediaType } from "@/types/anilist";

import {
  isFalsy,
  numberWithCommas,
  removeArrayOfObjectDup,
  vietnameseSlug,
} from "@/utils";
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

interface DetailsPageProps {
  character: Character;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ character }) => {
  const { t } = useTranslation("character_details");
  const { GENDERS } = useConstantTranslation();

  const gender = useMemo(
    () => GENDERS[character.gender?.toLowerCase()] || character.gender,
    [GENDERS, character.gender]
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

  const voiceActors = useMemo(() => {
    return removeArrayOfObjectDup(
      character.media.edges.flatMap((edge) => edge.voiceActors),
      "id"
    );
  }, [character.media.edges]);

  const media = useMemo(() => {
    return character.media.edges.map((edge) => edge.node);
  }, [character.media.edges]);

  const anime = useMemo(
    () => media.filter((media) => media.type === MediaType.Anime),
    [media]
  );

  const manga = useMemo(
    () => media.filter((media) => media.type === MediaType.Manga),
    [media]
  );

  return (
    <>
      <Head
        title={`${character.name.userPreferred} - Kaguya`}
        image={character.image.large}
      />

      <div className="pb-8">
        <div className="w-full h-[200px] bg-background"></div>

        <Section className="relative z-10 bg-background-900 pb-4 mb-8">
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
                    <p>{t("is_today_birthday")}</p>
                  </TextIcon>
                )}
              </div>

              <div className="space-y-4">
                <KeyValue property={t("gender")} value={gender} />
                <KeyValue property={t("birthday")} value={birthday} />
                <KeyValue property={t("age")} value={character.age} />
              </div>
            </div>
          </div>
        </Section>

        <Section className="space-y-8">
          {!!voiceActors?.length && (
            <DetailsSection title={t("voice_actors_section")}>
              <List data={voiceActors}>
                {(voiceActor) => <VACard voiceActor={voiceActor} />}
              </List>
            </DetailsSection>
          )}

          {!!anime?.length && (
            <DetailsSection title={t("anime_section")}>
              <List data={anime}>{(anime) => <Card data={anime} />}</List>
            </DetailsSection>
          )}

          {!!manga?.length && (
            <DetailsSection title={t("manga_section")}>
              <List data={manga}>{(manga) => <Card data={manga} />}</List>
            </DetailsSection>
          )}
        </Section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { params },
}) => {
  try {
    const data = await getCharacterDetails({
      id: Number(params[0]),
    });

    return {
      props: {
        character: data,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (error) {
    console.log(error);

    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];

  if (slug) return null;

  return {
    url: `/characters/details/${id}/${vietnameseSlug(
      props.character.name.userPreferred
    )}`,
    options: {
      shallow: true,
    },
  };
});
